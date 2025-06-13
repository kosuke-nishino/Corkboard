import React, { useRef, useState } from "react";
import Moveable from "react-moveable";

export default function MoveableTask({ task }) {
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

    return (
        <div onClick={handleBackgroundClick} style={{ position: "relative", width: "100%", height: "100vh" }}>
            <div
                ref={targetRef}
                onClick={handleCardClick}
                style={{
                    width: task.width || "200px",
                    height: task.height || "150px",
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
                }}
            >
                <strong>{task.title}</strong>
                <p>{task.content}</p>
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
