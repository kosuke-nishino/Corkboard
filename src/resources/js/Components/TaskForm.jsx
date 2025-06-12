import { useForm } from '@inertiajs/react';
import React from 'react';

export default function TaskForm({ onSuccess }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        start_date: '',
        end_date: '',
        color: '#fffacd',
        is_completed: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('tasks.store'), {
            onSuccess: () => {
                reset();
                if (onSuccess) onSuccess(); // オプションの成功時コールバック
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-md rounded-md w-full max-w-md">
            <div>
                <label className="block text-sm font-bold mb-1">タイトル</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">内容</label>
                <textarea
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                ></textarea>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-bold mb-1">開始日</label>
                    <input
                        type="date"
                        value={data.start_date}
                        onChange={(e) => setData('start_date', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-bold mb-1">終了日</label>
                    <input
                        type="date"
                        value={data.end_date}
                        onChange={(e) => setData('end_date', e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">背景色</label>
                <input
                    type="color"
                    value={data.color}
                    onChange={(e) => setData('color', e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={data.is_completed}
                    onChange={(e) => setData('is_completed', e.target.checked)}
                    className="mr-2"
                />
                <span className="text-sm">完了としてマーク</span>
            </div>

            <div className="text-right">
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    作成する
                </button>
            </div>
        </form>
    );
}
