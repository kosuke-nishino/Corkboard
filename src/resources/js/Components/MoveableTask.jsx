// components/MoveableTask.jsx
import React from 'react';
import Moveable from './Moveable';

export default function MoveableTask({ task, onEdit, onDelete }) {
    return (
        <Moveable task={task} updateUrl="/task-memos">
            {({ targetRef, frameRef, isActive, onClick }) => {
                const translateX = frameRef.current?.translate?.[0] ?? task.x ?? 0;
                const translateY = frameRef.current?.translate?.[1] ?? task.y ?? 0;
                const rotate = frameRef.current?.rotate ?? task.rotation ?? 0;
                const scaleX = frameRef.current?.scale?.[0] ?? 1;
                const scaleY = frameRef.current?.scale?.[1] ?? 1;

                return (
                    <div
                        ref={targetRef}
                        onClick={onClick}
                        style={{
                            width: `${task.width || 200}px`,
                            height: `${task.height || 180}px`,
                            background: task.color || "#ffd",
                            border: isActive ? "2px solid blue" : "1px solid #ccc",
                            transform: `
                                translate(${translateX}px, ${translateY}px)
                                rotate(${rotate}deg)
                                scale(${scaleX}, ${scaleY})
                            `,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: task.z_index || 1,
                            padding: "8px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                            overflow: "auto",
                            fontSize: "14px",
                        }}
                    >
                        {isActive && (
                            <div className="absolute top-1 right-1 flex gap-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(task);
                                    }}
                                    className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 shadow"
                                >
                                    ✎
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('このタスクを削除しますか？')) {
                                            onDelete(task);
                                        }
                                    }}
                                    className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 shadow"
                                >
                                    🗑
                                </button>
                            </div>
                        )}

                        <strong className="block mb-1">{task.title}</strong>
                        <p className="mb-1">{task.content}</p>
                        {task.start_date && (
                            <p className="text-xs text-gray-600">開始日: {task.start_date}</p>
                        )}
                        {task.end_date && (
                            <p className="text-xs text-gray-600">終了日: {task.end_date}</p>
                        )}
                        <p className="text-xs text-gray-700">
                            {task.is_completed ? "✅ 完了" : "⏳ 未完了"}
                        </p>
                    </div>
                );
            }}
        </Moveable>
    );
}
