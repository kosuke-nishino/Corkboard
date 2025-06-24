import React, { useState } from 'react';
import axios from 'axios';

export default function ImageForm({ onSuccess, onClose }) {
    const [data, setData] = useState({
        file_path: '',
        x: 0,
        y: 100,
        z_index: 15,
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const res = await axios.post('/images', data);
            if (onSuccess) onSuccess(res.data);

            setData({
                file_path: '',
                x: 0,
                y: 100,
                z_index: 15,
            });
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
                <label className="block text-sm font-bold mb-1">画像投稿</label>
                
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
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                >
                    作成する
                </button>
            </div>
        </form>
    );
}