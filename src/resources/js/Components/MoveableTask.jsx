// components/MoveableTask.jsx
import React from 'react';
import Moveable from './Moveable';

export default function MoveableTask({ task }) {
    return (
        <Moveable task={task} updateUrl="/task-memos">
            {({ targetRef, frameRef, isActive, onClick }) => (
                <div
                    ref={targetRef}
                    onClick={onClick}
                    style={{
                        width: task.width || "200px",
                        height: task.height || "180px",
                        background: task.color || "#ffd",
                        border: isActive ? "2px solid blue" : "1px solid #ccc",
                        transform: `
                            translate(${frameRef.current.translate[0]}px, ${frameRef.current.translate[1]}px)
                            rotate(${frameRef.current.rotate}deg)
                            scale(${frameRef.current.scale[0]}, ${frameRef.current.scale[1]})
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
            )}
        </Moveable>
    );
}
