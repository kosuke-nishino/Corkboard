import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import MoveableCard from "@/Components/MoveableCard";
import TaskForm from "@/Components/TaskForm"; // 追加
import { useState } from 'react'; // 追加

export default function Dashboard() {
    const [showTaskForm, setShowTaskForm] = useState(false); // モーダル状態

    return (
        <AuthenticatedLayout>
            <Head title="Corkboard" />

            {/* 全体をラップするコンテンツエリア */}
            <div className="relative min-h-screen bg-[url('/images/bgcork.jpg')] p-6">

                {/* 左上：ゴミ箱ボタン */}
                <div className="absolute top-4 left-4">
                    <button
                        className="flex items-center justify-center w-12 h-12 bg-red-100 hover:bg-red-200 rounded-full shadow text-red-700 text-xl"
                        title="ゴミ箱"
                    >
                        🗑
                    </button>
                </div>

                {/* 右上：作成ボタンたち */}
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

                {/* モーダル：タスク作成フォーム */}
                {showTaskForm && (
                    <TaskForm onClose={() => setShowTaskForm(false)} />
                )}

                {/* メイン領域（仮） */}
                <div className="mt-24">
                    <p className="text-center text-gray-600">
                        <div className="p-10">
                            <MoveableCard />
                        </div>
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
