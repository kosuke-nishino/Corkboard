import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import TaskForm from "@/Components/TaskForm";
import EditTaskForm from "@/Components/EditTaskForm";
import MoveableTask from "@/Components/MoveableTask";
import Modal from "@/Components/Modal";
import { useState, useRef } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const { props } = usePage();
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [tasks, setTasks] = useState(props.tasks || []);
    const [editingTask, setEditingTask] = useState(null);
    const formContainerRef = useRef(null); // ← タスクフォームの位置参照用

    const handleTaskCreated = async (task) => {
        // タスクフォームの位置から新規タスクの初期位置を取得
        const formRect = formContainerRef.current?.getBoundingClientRect();
        const offsetX = Math.max(100, (formRect?.left || 100) - 100);
        const offsetY = Math.max(100, (formRect?.top || 100) - 100);

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

    return (
        <AuthenticatedLayout>
            <Head title="Corkboard" />

            <div className="relative min-h-screen bg-[url('/images/bgcork.jpg')] p-6 overflow-hidden">
                {/* ゴミ箱ボタン */}
                <div className="absolute top-4 left-4">
                    <button
                        className="flex items-center justify-center w-12 h-12 bg-red-100 hover:bg-red-200 rounded-full shadow text-red-700 text-xl"
                        title="ゴミ箱"
                    >
                        🗑
                    </button>
                </div>

                {/* 作成ボタン群 */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-black py-2 px-4 rounded-full shadow"
                        onClick={() => setShowTaskForm(true)}
                    >
                        タスク作成
                    </button>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full shadow">
                        付箋作成
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow">
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

                {/* 編集モーダル */}
                <Modal show={!!editingTask} onClose={() => setEditingTask(null)}>
                    {editingTask && (
                        <EditTaskForm
                            task={editingTask}
                            onSuccess={handleTaskUpdated}
                            onClose={() => setEditingTask(null)}
                        />
                    )}
                </Modal>

                {/* タスク表示エリア */}
                <div className="mt-24 relative z-0">
                    {tasks.map((task) => (
                        <MoveableTask
                            key={task.id}
                            task={task}
                            onEdit={(t) => setEditingTask(t)}
                            onDelete={handleTaskDeleted}
                            onPositionUpdate={(updatedTask) => {
                                setTasks(prev => prev.map(t => 
                                    t.id === updatedTask.id ? { ...t, ...updatedTask } : t
                                ));
                            }}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
