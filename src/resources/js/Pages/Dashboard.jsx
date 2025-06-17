import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import TaskForm from "@/Components/TaskForm";
import MoveableTask from "@/Components/MoveableTask";
import { useRef, useState } from 'react';

export default function Dashboard() {
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [tasks, setTasks] = useState([]);

    // 表示エリアの ref
    const taskAreaRef = useRef(null);

    // タスク作成後の処理
    const handleTaskCreated = (task) => {
        const viewportWidth = window.innerWidth;
        const defaultWidth = 200;
        const defaultHeight = 180;
        const offset = tasks.length * 20;

        // 中央座標を計算（タスクエリアの中）
        let centerY = (window.innerHeight - defaultHeight) / 2;

        if (taskAreaRef.current) {
            const rect = taskAreaRef.current.getBoundingClientRect();
            centerY = rect.top + (rect.height - defaultHeight) / 2;
        }

        const centerX = (viewportWidth - defaultWidth) / 2;

        const newTask = {
            ...task,
            id: Date.now(), // ユニークなIDを付加
            x: centerX + offset,
            y: centerY + offset,
            z_index: tasks.length + 1, // ← 追加（明示的に z-index を増やす）
        };
        console.log("新しいタスク", newTask);
        setTasks([...tasks, newTask]);
        setShowTaskForm(false);
    };
    console.log('📌 表示するタスク一覧:', tasks);
    return (
        <AuthenticatedLayout>
            <Head title="Corkboard" />

            <div className="relative min-h-screen bg-[url('/images/bgcork.jpg')] p-6">

                {/* ゴミ箱ボタン */}
                <div className="absolute top-4 left-4 z-10">
                    <button
                        className="flex items-center justify-center w-12 h-12 bg-red-100 hover:bg-red-200 rounded-full shadow text-red-700 text-xl"
                        title="ゴミ箱"
                    >
                        🗑
                    </button>
                </div>

                {/* 作成ボタンたち */}
                <div className="absolute top-4 right-4 flex gap-2 z-50">
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
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                        <TaskForm
                            onSuccess={handleTaskCreated}
                            onClose={() => setShowTaskForm(false)}
                        />
                    </div>
                )}

                {/* メモ表示エリア */}
                
                <div
  ref={taskAreaRef}
  className="absolute inset-0 overflow-hidden z-0"
  
>
  {tasks.map((task, index) => (
    <MoveableTask key={task.id} task={task} />
  ))}
</div>

            </div>
        </AuthenticatedLayout>
    );
}
