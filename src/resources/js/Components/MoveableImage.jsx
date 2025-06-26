import React from 'react';
import Moveable from './Moveable';

export default function MoveableImage({ image, onDelete }) {
    return (
        <Moveable item={image} updateUrl="/test/images">
            {({ targetRef, frameRef, isActive, onClick }) => {
                const translateX = frameRef.current?.translate?.[0] ?? image.x ?? 0;
                const translateY = frameRef.current?.translate?.[1] ?? image.y ?? 0;
                const rotate = frameRef.current?.rotate ?? image.rotation ?? 0;
                const scaleX = frameRef.current?.scale?.[0] ?? 1;
                const scaleY = frameRef.current?.scale?.[1] ?? 1;

                return (
                    <div
                        ref={targetRef}
                        onClick={onClick}
                        style={{
                            width: `${image.width ?? 200}px`,
                            height: `${image.height ?? 150}px`,
                            transform: `
                                translate(${translateX}px, ${translateY}px)
                                rotate(${rotate}deg)
                                scale(${scaleX}, ${scaleY})
                            `,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: image.z_index || 5,
                            cursor: "move",
                            border: isActive ? "2px solid #4285F4" : "none",
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

                        {isActive && (
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
                        )}
                    </div>
                );
            }}
        </Moveable>
    );
}
