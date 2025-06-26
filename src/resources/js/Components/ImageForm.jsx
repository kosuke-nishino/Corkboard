import React, { useState } from 'react';
import axios from 'axios';

export default function ImageForm({ onSuccess, onClose, initialLocation = 'dashboard' }) {
    const [data, setData] = useState({
        z_index: 5,
        location: initialLocation,
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // プレビュー用のURL作成
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!image) {
            setErrors({ image: ['画像を選択してください'] });
            return;
        }
        
        setProcessing(true);
        setErrors({});

        try {
            // FormDataオブジェクトを作成
            const formData = new FormData();
            formData.append('image', image);
            formData.append('z_index', data.z_index);
            formData.append('location', data.location);
            
            console.log('画像アップロード開始:', {
                imageSize: image.size,
                imageName: image.name,
                imageType: image.type
            });
            
            // axiosを使用してアップロード
            console.log('🔄 画像アップロード開始 - axios設定確認:', {
                baseURL: axios.defaults.baseURL,
                csrfToken: axios.defaults.headers.common['X-CSRF-TOKEN'],
                withCredentials: axios.defaults.withCredentials
            });
            
            const response = await axios.post('/test/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000, // 30秒のタイムアウト
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`📤 アップロード進捗: ${percentCompleted}%`);
                }
            });
            
            console.log('アップロード成功:', response.data);
            
            if (onSuccess) onSuccess(response.data);
            
            // フォームをリセット
            setImage(null);
            setPreview(null);
            setData({
                alt_text: '',
                z_index: 5,
            });
        } catch (err) {
            console.error('アップロードエラー詳細:', err);
            
            // axiosエラーレスポンスの処理
            if (err.response) {
                // サーバーからエラーレスポンスが返された場合
                const errorMessage = err.response.data?.error || err.response.data?.message || `サーバーエラー: ${err.response.status}`;
                setErrors({ 
                    general: [`画像のアップロードに失敗しました: ${errorMessage}`] 
                });
            } else if (err.request) {
                // リクエストが送信されたが、レスポンスが受信されなかった場合
                setErrors({ 
                    general: ['ネットワークエラー: サーバーに接続できませんでした'] 
                });
            } else {
                // その他のエラー
                setErrors({ 
                    general: [`画像のアップロードに失敗しました: ${err.message}`] 
                });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-md rounded-md w-full max-w-md">
            <div>
                <label className="block text-sm font-bold mb-1">画像</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border px-3 py-2 rounded"
                />
                {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                
                {preview && (
                    <div className="mt-2">
                        <img 
                            src={preview} 
                            alt="プレビュー" 
                            className="max-h-40 max-w-full object-contain border rounded"
                        />
                    </div>
                )}
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

            {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

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
                    className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {processing ? 'アップロード中...' : 'アップロード'}
                </button>
            </div>
        </form>
    );
}