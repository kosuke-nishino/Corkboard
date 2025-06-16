import React, { useRef, useState } from "react";
import Moveable from "react-moveable";
import axios from "axios";

export default function MoveableTask({ task, onEdit, onDelete }) {
    const targetRef = useRef(null);
    const frameRef = useRef({
        translate: [task.x || 0, task.y || 0],
        rotate: task.rotation || 0,
        scale: [1, 1],
    });

    const [isActive, setIsActive] = useState(false);

    const handleBackgroundClick = () => setIsActive(false);
    const handleCardClick = (e) => {
        e.stopPropagation();
        setIsActive(true);
    };

    const handleDeleteClick = async () => {
        try {
            await axios.delete(`/task-memos/${task.id}`);
            onDelete(task.id);
        } catch (err) {
            console.error("削除失敗:", err);
        }
    };

    return (
        <div
            onClick={handleBackgroundClick}
            style={{ position: "relative", width: "100%", height: "100vh" }}
        >
            <div
                ref={targetRef}
                onClick={handleCardClick}
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

                {isActive && (
                    <div className="mt-2 flex gap-2 text-xs">
                        <button
                            onClick={() => onEdit(task)}
                            className="text-blue-600 underline"
                        >
                            編集
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="text-red-600 underline"
                        >
                            削除
                        </button>
                    </div>
                )}
            </div>

            <Moveable
                target={isActive ? targetRef.current : null}
                draggable={isActive}
                scalable={isActive}
                rotatable={isActive}
                origin={false}
                onDrag={({ beforeTranslate }) => {
                    frameRef.current.translate = beforeTranslate;
                    targetRef.current.style.transform = `
                        translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)
                        rotate(${frameRef.current.rotate}deg)
                        scale(${frameRef.current.scale[0]}, ${frameRef.current.scale[1]})
                    `;
                }}
                onScale={({ scale, drag }) => {
                    frameRef.current.scale = scale;
                    frameRef.current.translate = drag.beforeTranslate;
                    targetRef.current.style.transform = `
                        translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)
                        rotate(${frameRef.current.rotate}deg)
                        scale(${scale[0]}, ${scale[1]})
                    `;
                }}
                onRotate={({ beforeRotate, drag }) => {
                    frameRef.current.rotate = beforeRotate;
                    frameRef.current.translate = drag.beforeTranslate;
                    targetRef.current.style.transform = `
                        translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)
                        rotate(${beforeRotate}deg)
                        scale(${frameRef.current.scale[0]}, ${frameRef.current.scale[1]})
                    `;
                }}
            />
        </div>
    );
}