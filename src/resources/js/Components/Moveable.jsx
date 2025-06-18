import React, { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";
import axios from "axios";

export default function MoveableWrapper({ task, updateUrl = '/task-memos', children }) {
    const targetRef = useRef(null);
    const frameRef = useRef({
        translate: [task.translateX ?? task.x ?? 0, task.translateY ?? task.y ?? 0],
        rotate: task.rotate ?? task.rotation ?? 0,
        scale: [task.scaleX ?? 1, task.scaleY ?? 1],
    });

    const [isActive, setIsActive] = useState(false);

    const handleClickOutside = (e) => {
        if (targetRef.current && !targetRef.current.contains(e.target)) {
            setIsActive(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClick = (e) => {
        e.stopPropagation();
        setIsActive(true);
    };

    const savePosition = async () => {
        const rect = targetRef.current?.getBoundingClientRect();

        const payload = {
            x: Number(frameRef.current.translate?.[0]) ?? 0,
            y: Number(frameRef.current.translate?.[1]) ?? 0,
            width: rect?.width ?? 0,
            height: rect?.height ?? 0,
            rotation: Number(frameRef.current.rotate) ?? 0,
            scaleX: Number(frameRef.current.scale?.[0]) ?? 1,
            scaleY: Number(frameRef.current.scale?.[1]) ?? 1,
            z_index: Number(task.z_index) ?? 0,
        };

        console.log("送信データ（位置更新）:", payload);

        try {
            await axios.put(`${updateUrl}/${task.id}/position`, payload);
        } catch (err) {
            console.error("保存エラー:", err);
        }
    };

    useEffect(() => {
        if (targetRef.current) {
            const {
                translateX = 0,
                translateY = 0,
                width = 200,
                height = 180,
                rotate = 0,
                scaleX = 1,
                scaleY = 1,
                x = 0,
                y = 0,
                rotation = 0
            } = task;

            const tx = translateX ?? x ?? 0;
            const ty = translateY ?? y ?? 0;
            const rot = rotate ?? rotation ?? 0;

            frameRef.current.translate = [tx, ty];
            frameRef.current.rotate = rot;
            frameRef.current.scale = [scaleX ?? 1, scaleY ?? 1];

            targetRef.current.style.transform = `
                translate(${tx}px, ${ty}px)
                rotate(${rot}deg)
                scale(${scaleX ?? 1}, ${scaleY ?? 1})
            `;
            targetRef.current.style.width = `${width}px`;
            targetRef.current.style.height = `${height}px`;
        }
    }, [task]);

    return (
    <div className="absolute top-0 left-0 w-full h-full">
        {children({
            targetRef,
            frameRef,
            isActive,
            onClick: handleClick,
        })}

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
            onDragEnd={savePosition}
            onScale={({ scale, drag }) => {
                frameRef.current.scale = scale;
                frameRef.current.translate = drag.beforeTranslate;
                targetRef.current.style.transform = `
                    translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)
                    rotate(${frameRef.current.rotate}deg)
                    scale(${scale[0]}, ${scale[1]})
                `;
            }}
            onScaleEnd={savePosition}
            onRotate={({ beforeRotate, drag }) => {
                frameRef.current.rotate = beforeRotate;
                frameRef.current.translate = drag.beforeTranslate;
                targetRef.current.style.transform = `
                    translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)
                    rotate(${beforeRotate}deg)
                    scale(${frameRef.current.scale[0]}, ${frameRef.current.scale[1]})
                `;
            }}
            onRotateEnd={savePosition}
        />
    </div>
);

    
}
