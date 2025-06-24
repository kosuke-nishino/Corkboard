import React, { useRef, useEffect, useState } from 'react';
import Moveable from 'react-moveable';
import axios from 'axios';

export default function MoveableImage({ image, onDelete, onPositionUpdate }) {
    const imageRef = useRef(null);
    const [isSelected, setIsSelected] = useState(false);

    // デバッグ: 画像データの確認
    useEffect(() => {
        console.log('🖼️ MoveableImage初期化:', {
            id: image.id,
            file_path: image.file_path,
            x: image.x,
            y: image.y,
            width: image.width,
            height: image.height,
            rotation: image.rotation,
            z_index: image.z_index
        });
    }, [image]);

    const handleDrag = async ({ target, left, top }) => {
        // リアルタイムで位置を更新
        target.style.left = `${left}px`;
        target.style.top = `${top}px`;
        
        // 状態を即座に更新
        if (onPositionUpdate) {
            onPositionUpdate({
                ...image,
                x: left,
                y: top,
            });
        }
    };

    const handleDragEnd = async ({ target }) => {
        // ドラッグ終了時にサーバーに保存
        const rect = target.getBoundingClientRect();
        const parentRect = target.parentElement.getBoundingClientRect();
        
        const newX = rect.left - parentRect.left;
        const newY = rect.top - parentRect.top;

        try {
            console.log('📍 画像位置保存:', { id: image.id, x: newX, y: newY });
            await axios.put(`/test/images/${image.id}/position`, {
                x: newX,
                y: newY,
            });
            console.log('✅ 画像位置保存完了');
        } catch (error) {
            console.error('❌ 画像位置保存エラー:', error);
        }
    };

    const handleResize = async ({ target, width, height, drag }) => {
        // リアルタイムでサイズを更新
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        
        // ドラッグも同時に発生する場合
        if (drag) {
            target.style.left = `${drag.left}px`;
            target.style.top = `${drag.top}px`;
        }

        // 状態を即座に更新
        if (onPositionUpdate) {
            onPositionUpdate({
                ...image,
                width: width,
                height: height,
                x: drag ? drag.left : image.x,
                y: drag ? drag.top : image.y,
            });
        }
    };

    const handleResizeEnd = async ({ target }) => {
        // リサイズ終了時にサーバーに保存
        const rect = target.getBoundingClientRect();
        const parentRect = target.parentElement.getBoundingClientRect();
        
        const newX = rect.left - parentRect.left;
        const newY = rect.top - parentRect.top;
        const newWidth = rect.width;
        const newHeight = rect.height;

        try {
            console.log('📏 画像サイズ保存:', { 
                id: image.id, 
                x: newX, 
                y: newY, 
                width: newWidth, 
                height: newHeight 
            });
            await axios.put(`/test/images/${image.id}/position`, {
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight,
            });
            console.log('✅ 画像サイズ保存完了');
        } catch (error) {
            console.error('❌ 画像サイズ保存エラー:', error);
        }
    };

    const handleRotate = async ({ target, rotate }) => {
        // リアルタイムで回転を更新
        target.style.transform = `rotate(${rotate}deg)`;
        
        // 状態を即座に更新
        if (onPositionUpdate) {
            onPositionUpdate({
                ...image,
                rotation: rotate,
            });
        }
    };

    const handleRotateEnd = async () => {
        // 回転終了時にサーバーに保存
        try {
            console.log('🔄 画像回転保存:', { id: image.id, rotation: image.rotation });
            await axios.put(`/test/images/${image.id}/position`, {
                rotation: image.rotation,
            });
            console.log('✅ 画像回転保存完了');
        } catch (error) {
            console.error('❌ 画像回転保存エラー:', error);
        }
    };

    const handleDelete = () => {
        if (confirm('この画像を削除しますか？')) {
            onDelete(image);
        }
    };

    return (
        <>
            <div
                ref={imageRef}
                className={`absolute cursor-pointer group ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
                style={{
                    left: `${image.x || 300}px`,
                    top: `${image.y || 300}px`,
                    width: `${image.width || 200}px`,
                    height: `${image.height || 150}px`,
                    transform: `rotate(${image.rotation || 0}deg)`,
                    zIndex: image.z_index || 5,
                }}
                onClick={() => setIsSelected(!isSelected)}
            >
                {image.file_path ? (
                    <img
                        src={`/storage/${image.file_path}`}
                        alt="アップロード画像"
                        className="w-full h-full object-cover rounded shadow-lg"
                        draggable={false}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-sm">画像なし</span>
                    </div>
                )}
                
                {/* 削除ボタン */}
               <div className="absolute top-1 right-1 flex gap-1">
                                
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('この付箋を削除しますか？')) {
                                            onDelete(Image);
                                        }
                                    }}
                                    className="bg-red-500 text-white text-xs px-1 py-1 rounded hover:bg-red-600 shadow"
                                    style={{ fontSize: '10px', lineHeight: '1' }}
                                >
                                    🗑
                                </button>
                            </div>
               
            </div>

            {/* Moveableコンポーネント */}
            {isSelected && (
                <Moveable
                    target={imageRef.current}
                    draggable={true}
                    resizable={true}
                    rotatable={true}
                    keepRatio={false}
                    origin={false}
                    throttleDrag={1}
                    throttleResize={1}
                    throttleRotate={1}
                    renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
                    onDrag={handleDrag}
                    onDragEnd={handleDragEnd}
                    onResize={handleResize}
                    onResizeEnd={handleResizeEnd}
                    onRotate={handleRotate}
                    onRotateEnd={handleRotateEnd}
                    // スタイリング
                    className="moveable-control"
                />
            )}
        </>
    );
}