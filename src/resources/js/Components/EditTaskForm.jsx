import React, { useState } from 'react';
import axios from 'axios';

export default function EditTaskForm({ task, onSuccess, onClose }) {
    const [data, setData] = useState({
        title: task.title || '',
        content: task.content || '',
        start_date: task.start_date || '',
        end_date: task.end_date || '',
        color: task.color || '#fffacd',
        is_completed: task.is_completed || false,
        z_index: task.z_index || 10,
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const res = await axios.put(`/task-memos/${task.id}`, data);
            if (onSuccess) onSuccess(res.data); // 親に更新済みtaskを渡す
            setErrors({});
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                console.error(err);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-md rounded-md w-full max-w-md">
            <div>
                <label className="block text-sm font-bold mb-1">タイトル</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">内容</label>
                <textarea
                    value={data.content}
                    onChange={(e) => setData({ ...data, content: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                ></textarea>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-bold mb-1">開始日</label>
                    <input
                        type="date"
                        value={data.start_date}
                        onChange={(e) => setData({ ...data, start_date: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-bold mb-1">終了日</label>
                    <input
                        type="date"
                        value={data.end_date}
                        onChange={(e) => setData({ ...data, end_date: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">背景色</label>
                <input
                    type="color"
                    value={data.color}
                    onChange={(e) => setData({ ...data, color: e.target.value })}
                    className="w-16 h-10 p-1 border rounded"
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={data.is_completed}
                    onChange={(e) => setData({ ...data, is_completed: e.target.checked })}
                    className="mr-2"
                />
                <span className="text-sm">完了としてマーク</span>
            </div>
            
            <div>
                <label className="block text-sm font-bold mb-1">重なり順 (z-index): {data.z_index}</label>
                <input
                    type="range"
                    min="0"
                    max="999"
                    value={data.z_index}
                    onChange={(e) => setData({ ...data, z_index: parseInt(e.target.value) })}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                    <span>手前</span>
                    <span>奥</span>
                </div>
            </div>

            <div className="text-right flex justify-between">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-red-300 hover:bg-red-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                    キャンセル
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    更新する
                </button>
            </div>
        </form>
    );
}
