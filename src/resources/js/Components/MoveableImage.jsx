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

    // 背景クリックで選択解除
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (imageRef.current && !imageRef.current.contains(event.target)) {
                setIsSelected(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // ドラッグ中リアルタイム更新
    const handleDrag = ({ target, left, top }) => {
        target.style.left = `${left}px`;
        target.style.top = `${top}px`;
        if (onPositionUpdate) {
            onPositionUpdate({
                ...image,
                x: left,
                y: top,
            });
        }
    };

    // ドラッグ終了 → 回転を解除して正しい位置取得・保存
    const handleDragEnd = async ({ target }) => {
        const parentRect = target.parentElement.getBoundingClientRect();
        const originalTransform = target.style.transform;
        target.style.transform = 'none';
        const rect = target.getBoundingClientRect();
        target.style.transform = originalTransform;

        const newX = rect.left - parentRect.left;
        const newY = rect.top - parentRect.top;

        try {
            await axios.put(`/test/images/${image.id}/position`, {
                x: newX,
                y: newY,
                rotation: image.rotation,
            });
            console.log('✅ 画像位置保存完了');
        } catch (error) {
            console.error('❌ 画像位置保存エラー:', error);
        }
    };

    // リサイズ中リアルタイム更新
    const handleResize = ({ target, width, height, drag }) => {
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        if (drag) {
            target.style.left = `${drag.left}px`;
            target.style.top = `${drag.top}px`;
        }
        if (onPositionUpdate) {
            onPositionUpdate({
                ...image,
                width,
                height,
                x: drag ? drag.left : image.x,
                y: drag ? drag.top : image.y,
            });
        }
    };

    // リサイズ終了 → 回転解除して正しいサイズ取得・保存
    const handleResizeEnd = async ({ target }) => {
        const parentRect = target.parentElement.getBoundingClientRect();
        const originalTransform = target.style.transform;
        target.style.transform = 'none';
        const rect = target.getBoundingClientRect();
        target.style.transform = originalTransform;

        const newX = rect.left - parentRect.left;
        const newY = rect.top - parentRect.top;
        const newWidth = rect.width;
        const newHeight = rect.height;

        try {
            await axios.put(`/test/images/${image.id}/position`, {
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight,
                rotation: image.rotation,
            });
            console.log('✅ 画像サイズ保存完了');
        } catch (error) {
            console.error('❌ 画像サイズ保存エラー:', error);
        }
    };

    // 回転中リアルタイム更新
    const handleRotate = ({ target, rotate }) => {
        target.style.transform = `rotate(${rotate}deg)`;
        if (onPositionUpdate) {
            onPositionUpdate({
                ...image,
                rotation: rotate,
            });
        }
    };

    // 回転終了 → 回転だけ保存
    const handleRotateEnd = async () => {
        try {
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
                onClick={(e) => {
                    e.stopPropagation(); // 画像クリック時は選択状態維持
                    setIsSelected(true);
                }}
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
                            if (confirm('この画像を削除しますか？')) {
                                onDelete(image);
                            }
                        }}
                        className="bg-red-500 text-white text-xs px-1 py-1 rounded hover:bg-red-600 shadow"
                        style={{ fontSize: '10px', lineHeight: '1' }}
                    >
                        🗑
                    </button>
                </div>
            </div>

            {/* Moveable コンポーネント */}
            {isSelected && (
                <Moveable
                    target={imageRef.current}
                    draggable
                    resizable
                    rotatable
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
                    className="moveable-control"
                />
            )}
        </>
    );
}
