import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import TaskForm from "@/Components/TaskForm";
import EditTaskForm from "@/Components/EditTaskForm";
import MoveableTask from "@/Components/MoveableTask";
import StickyNoteForm from "@/Components/StickyNoteForm";
import ImageForm from '@/Components/ImageForm';
import EditStickyNoteForm from "@/Components/EditStickyNoteForm";
import MoveableStickyNote from "@/Components/MoveableStickyNote";
import MoveableImage from "@/Components/MoveableImage";
import Modal from "@/Components/Modal";
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const { props } = usePage();
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showStickyNoteForm, setShowStickyNoteForm] = useState(false);
    const [showImageForm, setShowImageForm] = useState(false);
    const [tasks, setTasks] = useState(props.tasks || []);
    const [stickyNotes, setStickyNotes] = useState([]);
    const [images, setImages] = useState(props.images || []);
    const [editingTask, setEditingTask] = useState(null);
    const [editingStickyNote, setEditingStickyNote] = useState(null);
    const formContainerRef = useRef(null); // ← タスクフォームの位置参照用

    // 画像データの初期取得
    useEffect(() => {
        const fetchImages = async () => {
            try {
                console.log('🔄 画像データ取得開始');
                const imagesResponse = await axios.get('/test/images?location=dashboard');
                console.log('📷 取得した画像データ:', imagesResponse.data);
                setImages(imagesResponse.data || []);
            } catch (error) {
                console.error('画像データ取得エラー:', error);
                // エラーでも空配列で初期化
                setImages([]);
            }
        };

        fetchImages();
    }, []);

    // 付箋データの初期取得
    useEffect(() => {
        const fetchStickyNotes = async () => {
            try {
                console.log('🔄 付箋データ取得開始');
                const stickyNotesResponse = await axios.get('/sticky-notes?location=dashboard');
                console.log('📝 取得した付箋データ:', stickyNotesResponse.data);
                setStickyNotes(stickyNotesResponse.data || []);
            } catch (error) {
                console.error('付箋データ取得エラー:', error);
                setStickyNotes([]);
            }
        };

        fetchStickyNotes();
    }, []);

    // デバッグ: 初期データの確認
    useEffect(() => {
        console.log('🔍 Dashboard初期化 - サーバーから受信したタスクデータ:', props.tasks?.map(t => ({
            id: t.id,
            title: t.title,
            width: t.width,
            height: t.height,
            x: t.x,
            y: t.y,
            widthType: typeof t.width,
            heightType: typeof t.height
        })));
        
        console.log('🔍 Dashboard初期化 - 画像データ:', images?.map(img => ({
            id: img.id,
            file_path: img.file_path,
            x: img.x,
            y: img.y,
            width: img.width,
            height: img.height
        })));
    }, [props.tasks, images]);
    const handleTaskCreated = async (task) => {
        // デバッグ: フォームの位置情報を確認
        const formRect = formContainerRef.current?.getBoundingClientRect();
        console.log("🔍 FormRect debug:", {
            formRect,
            left: formRect?.left,
            top: formRect?.top,
            width: formRect?.width,
            height: formRect?.height,
            showTaskForm,
            formContainerExists: !!formContainerRef.current
        });
        
        // 一時的に固定位置でテスト
        const offsetX = 200; // 固定値でテスト
        const offsetY = 200; // 固定値でテスト
        
        console.log("🎯 Using fixed position:", { offsetX, offsetY });

        // 新規タスクの初期位置をDBに保存
        try {
            const response = await axios.put(`/task-memos/${task.id}/position`, {
                x: offsetX,
                y: offsetY,
                width: 200,
                height: 180,
                rotation: 0,
                z_index: 10,
            });
            
            // 位置情報を含むタスクオブジェクトを作成
            const newTask = {
                ...task,
                x: offsetX,
                y: offsetY,
                width: 200,
                height: 180,
                rotation: 0,
                z_index: 10,
            };
            
            setTasks([...tasks, newTask]);
            console.log("新規タスク作成完了:", newTask);
        } catch (error) {
            console.error('初期位置保存エラー:', error);
            // エラーでも表示はする（位置は後で調整可能）
            const newTask = {
                ...task,
                x: offsetX,
                y: offsetY,
                width: 200,
                height: 180,
                rotation: 0,
                z_index: 10,
            };
            setTasks([...tasks, newTask]);
        }

        setShowTaskForm(false);
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
        setEditingTask(null);
    };

    const handleTaskDeleted = async (task) => {
        try {
            await axios.delete(`/task-memos/${task.id}`);
            setTasks((prev) => prev.filter((t) => t.id !== task.id));
        } catch (error) {
            console.error('削除エラー:', error);
            alert('削除に失敗しました');
        }
    };

    const handleStickyNoteCreated = async (stickyNote) => {
        // 付箋フォームの位置から新規付箋の初期位置を取得
        const formRect = formContainerRef.current?.getBoundingClientRect();
        const offsetX = Math.max(100, (formRect?.left || 100) - 50);
        const offsetY = Math.max(100, (formRect?.top || 100) - 50);

        // 新規付箋の初期位置をDBに保存
        try {
            const response = await axios.put(`/sticky-notes/${stickyNote.id}/position`, {
                x: offsetX,
                y: offsetY,
                width: 150,  // 横長の付箋
                height: 100, // タスクより小さく
                rotation: 0,
                z_index: 15,
            });
            
            // 位置情報を含む付箋オブジェクトを作成
            const newStickyNote = {
                ...stickyNote,
                x: offsetX,
                y: offsetY,
                width: 150,
                height: 100,
                rotation: 0,
                z_index: 15,
            };
            
            setStickyNotes([...stickyNotes, newStickyNote]);
            console.log("新規付箋作成完了:", newStickyNote);
        } catch (error) {
            console.error('初期位置保存エラー:', error);
            // エラーでも表示はする
            const newStickyNote = {
                ...stickyNote,
                x: offsetX,
                y: offsetY,
                width: 150,
                height: 100,
                rotation: 0,
                z_index: 15,
            };
            setStickyNotes([...stickyNotes, newStickyNote]);
        }

        setShowStickyNoteForm(false);
    };

    const handleStickyNoteUpdated = (updatedStickyNote) => {
        setStickyNotes((prevStickyNotes) =>
            prevStickyNotes.map((sn) => (sn.id === updatedStickyNote.id ? updatedStickyNote : sn))
        );
        setEditingStickyNote(null);
    };

    const handleStickyNoteDeleted = async (stickyNote) => {
        try {
            await axios.delete(`/sticky-notes/${stickyNote.id}`);
            setStickyNotes((prev) => prev.filter((sn) => sn.id !== stickyNote.id));
        } catch (error) {
            console.error('削除エラー:', error);
            alert('削除に失敗しました');
        }
    };

    const handleImageCreated = async (image) => {
        console.log('📷 画像作成完了:', image);
        
        // 画像フォームの位置から新規画像の初期位置を取得
        const formRect = formContainerRef.current?.getBoundingClientRect();
        const offsetX = Math.max(300, (formRect?.left || 300) - 100);
        const offsetY = Math.max(300, (formRect?.top || 300) - 100);

        // 新規画像の初期位置をDBに保存
        try {
            const response = await axios.put(`/test/images/${image.id}/position`, {
                x: offsetX,
                y: offsetY,
                width: image.width || 200,
                height: image.height || 150,
                rotation: 0,
                z_index: image.z_index || 5,
            });
            
            // 位置情報を含む画像オブジェクトを作成
            const newImage = {
                ...image,
                x: offsetX,
                y: offsetY,
                width: image.width || 200,
                height: image.height || 150,
                rotation: 0,
                z_index: image.z_index || 5,
            };
            
            setImages([...images, newImage]);
            console.log("新規画像作成完了:", newImage);
        } catch (error) {
            console.error('画像初期位置保存エラー:', error);
            // エラーでも表示はする
            const newImage = {
                ...image,
                x: offsetX,
                y: offsetY,
                width: image.width || 200,
                height: image.height || 150,
                rotation: 0,
                z_index: image.z_index || 5,
            };
            setImages([...images, newImage]);
        }

        setShowImageForm(false);
    };

    const handleImageDeleted = async (image) => {
        try {
            await axios.delete(`/test/images/${image.id}`);
            setImages((prev) => prev.filter((img) => img.id !== image.id));
            console.log('画像削除完了:', image.id);
        } catch (error) {
            console.error('画像削除エラー:', error);
            alert('画像削除に失敗しました');
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Corkboard" />

            <div className="relative min-h-screen bg-[url('/images/bgcork.jpg')] p-6 overflow-hidden">
                
                {/* 作成ボタン群 */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-black py-2 px-4 rounded-full shadow"
                        onClick={() => setShowTaskForm(true)}
                    >
                        タスク作成
                    </button>
                    <button 
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full shadow"
                        onClick={() => setShowStickyNoteForm(true)}
                    >
                        付箋作成
                    </button>
                    <button 
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow"
                        onClick={() => setShowImageForm(true)}>
                        画像作成
                    </button>
                </div>

                {/* タスク作成フォーム */}
                {showTaskForm && (
                    <div
                        ref={formContainerRef}
                        className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50"
                    >
                        <TaskForm
                            onSuccess={handleTaskCreated}
                            onClose={() => setShowTaskForm(false)}
                        />
                    </div>
                )}

                {/* 付箋作成フォーム */}
                {showStickyNoteForm && (
                    <div
                        ref={formContainerRef}
                        className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50"
                    >
                        <StickyNoteForm
                            onSuccess={handleStickyNoteCreated}
                            onClose={() => setShowStickyNoteForm(false)}
                            initialLocation="dashboard"
                        />
                    </div>
                )}

                {/* 画像作成フォーム */}
                {showImageForm && (
                    <div
                        ref={formContainerRef}
                        className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50"
                    >
                        <ImageForm
                            onSuccess={handleImageCreated}
                            onClose={() => setShowImageForm(false)}
                            initialLocation="dashboard"
                        />
                    </div>
                )}

                {/* タスク編集モーダル */}
                <Modal show={!!editingTask} onClose={() => setEditingTask(null)}>
                    {editingTask && (
                        <EditTaskForm
                            task={editingTask}
                            onSuccess={handleTaskUpdated}
                            onClose={() => setEditingTask(null)}
                        />
                    )}
                </Modal>

                {/* 付箋編集モーダル */}
                <Modal show={!!editingStickyNote} onClose={() => setEditingStickyNote(null)}>
                    {editingStickyNote && (
                        <EditStickyNoteForm
                            stickyNote={editingStickyNote}
                            onSuccess={handleStickyNoteUpdated}
                            onClose={() => setEditingStickyNote(null)}
                        />
                    )}
                </Modal>

                {/* タスク・付箋・画像表示エリア */}
                <div className="mt-24 relative z-0">
                    {/* タスク表示 */}
                    {tasks.map((task) => (
                        <MoveableTask
                            key={`task-${task.id}`}
                            task={task}
                            onEdit={(t) => setEditingTask(t)}
                            onDelete={handleTaskDeleted}
                        />
                    ))}
                    
                    {/* 付箋表示 */}
                    {stickyNotes.map((stickyNote) => (
                        <MoveableStickyNote
                            key={`sticky-${stickyNote.id}`}
                            stickyNote={stickyNote}
                            onEdit={(sn) => setEditingStickyNote(sn)}
                            onDelete={handleStickyNoteDeleted}
                        />
                    ))}

                    {/* 画像表示 */}
                    {images.map((image) => (
                        <MoveableImage
                            key={`image-${image.id}`}
                            image={image}
                            onDelete={handleImageDeleted}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
