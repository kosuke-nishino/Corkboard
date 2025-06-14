import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import TaskForm from "@/Components/TaskForm";
import MoveableTask from "@/Components/MoveableTask"; // ← 変更点①
import { useState } from 'react';

export default function Dashboard() {
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [tasks, setTasks] = useState([]); // ← 変更点② タスクリスト

    const handleTaskCreated = (task) => {
        setTasks([...tasks, task]); // ← 変更点③ タスク追加
        setShowTaskForm(false);     // ← フォーム閉じる
    };

    return (
        <AuthenticatedLayout>
            <Head title="Corkboard" />

            <div className="relative min-h-screen bg-[url('/images/bgcork.jpg')] p-6">

                {/* ゴミ箱ボタン */}
                <div className="absolute top-4 left-4">
                    <button
                        className="flex items-center justify-center w-12 h-12 bg-red-100 hover:bg-red-200 rounded-full shadow text-red-700 text-xl"
                        title="ゴミ箱"
                    >
                        🗑
                    </button>
                </div>

                {/* 作成ボタンたち */}
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
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                        <TaskForm onSuccess={handleTaskCreated} onClose={() => setShowTaskForm(false)} />
                    </div>
                )}

                {/* メモ表示エリア */}
                <div className="mt-24 relative z-0">
                    {tasks.map((task, index) => (
                        <MoveableTask key={index} task={task} />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
