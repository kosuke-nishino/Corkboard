import React, { useState } from 'react';
import axios from 'axios';

export default function EditStickyNoteForm({ stickyNote, onSuccess, onClose }) {
    const [data, setData] = useState({
        content: stickyNote.content || '',
        color: stickyNote.color || '#ffeb3b',
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const res = await axios.put(`/sticky-notes/${stickyNote.id}`, data);
            if (onSuccess) onSuccess(res.data);
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
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-md rounded-md w-full max-w-sm">
            <div>
                <label className="block text-sm font-bold mb-1">内容</label>
                <textarea
                    value={data.content}
                    onChange={(e) => setData({ ...data, content: e.target.value })}
                    className="w-full border px-3 py-2 rounded h-20 resize-none"
                    placeholder="付箋の内容を入力..."
                ></textarea>
                {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">背景色</label>
                <div className="flex gap-2">
                    {['#ffeb3b', '#ff9800', '#4caf50', '#2196f3', '#9c27b0', '#f44336'].map(color => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setData({ ...data, color })}
                            className={`w-8 h-8 rounded border-2 ${data.color === color ? 'border-gray-800' : 'border-gray-300'}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
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
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                >
                    更新する
                </button>
            </div>
        </form>
    );
}