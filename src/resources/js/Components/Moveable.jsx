import React, { useRef, useState, useEffect, useCallback } from "react";
import Moveable from "react-moveable";
import axios from "axios";

export default function MoveableWrapper({ task, stickyNote, updateUrl = '/task-memos', children, onPositionUpdate }) {
    const item = task || stickyNote;
    const targetRef = useRef(null);
    const frameRef = useRef({
        translate: [0, 0],
        rotate: 0,
        scale: [1, 1],
    });

    const [isActive, setIsActive] = useState(false);
    const saveTimeoutRef = useRef(null);
    const baseSize = useRef(null);
    const initialized = useRef(false);

    const handleClickOutside = useCallback((e) => {
        if (targetRef.current && !targetRef.current.contains(e.target)) {
            setIsActive(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleClick = (e) => {
        e.stopPropagation();
        setIsActive(true);
    };

    const debouncedSave = useCallback(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        
        saveTimeoutRef.current = setTimeout(async () => {
            const currentWidth = parseFloat(targetRef.current.style.width) || baseSize.current?.width || (task ? 200 : 150);
            const currentHeight = parseFloat(targetRef.current.style.height) || baseSize.current?.height || (task ? 180 : 100);

            const payload = {
                x: Math.round(frameRef.current.translate[0]),
                y: Math.round(frameRef.current.translate[1]),
                width: Math.round(currentWidth),
                height: Math.round(currentHeight),
                rotation: Math.round(frameRef.current.rotate),
                z_index: item.z_index ?? 0,
            };

            console.log("FIXED SAVE:", payload);

            try {
                const response = await axios.put(`${updateUrl}/${item.id}/position`, payload);
                console.log("SAVE SUCCESS:", payload);
                
                if (onPositionUpdate && (response.data.task || response.data.stickyNote)) {
                    onPositionUpdate(response.data.task || response.data.stickyNote);
                }
            } catch (err) {
                console.error("SAVE ERROR:", err);
            }
        }, 300);
    }, [item?.id, updateUrl, onPositionUpdate, task]);

    useEffect(() => {
        console.log("INIT CHECK:", {
            itemId: item?.id,
            targetExists: !!targetRef.current,
            alreadyInitialized: initialized.current
        });
        
        if (targetRef.current && item && !initialized.current) {
            initialized.current = true;
            
            if (!baseSize.current) {
                const defaultWidth = task ? 200 : 150;
                const defaultHeight = task ? 180 : 100;
                baseSize.current = {
                    width: item.width ?? defaultWidth,
                    height: item.height ?? defaultHeight
                };
                console.log("BASE SIZE SET:", baseSize.current);
            }

            const x = item.x ?? 0;
            const y = item.y ?? 0;
            const rotation = item.rotation ?? 0;
            const width = item.width ?? baseSize.current.width;
            const height = item.height ?? baseSize.current.height;

            frameRef.current.translate = [x, y];
            frameRef.current.rotate = rotation;
            frameRef.current.scale = [1, 1];

            targetRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(1, 1)`;
            targetRef.current.style.width = `${width}px`;
            targetRef.current.style.height = `${height}px`;

            console.log("INIT COMPLETE:", { itemId: item.id, x, y, rotation, width, height });
        }
    }, [item?.id]);

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
                    targetRef.current.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px) rotate(${frameRef.current.rotate}deg) scale(1, 1)`;
                }}
                onDragEnd={debouncedSave}
                onScale={({ scale, drag }) => {
                    frameRef.current.scale = scale;
                    frameRef.current.translate = drag.beforeTranslate;
                    
                    if (baseSize.current) {
                        const newWidth = baseSize.current.width * scale[0];
                        const newHeight = baseSize.current.height * scale[1];
                        
                        targetRef.current.style.width = `${newWidth}px`;
                        targetRef.current.style.height = `${newHeight}px`;
                        targetRef.current.style.transform = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px) rotate(${frameRef.current.rotate}deg) scale(1, 1)`;
                        
                        console.log("SCALE APPLIED:", { scale, newWidth, newHeight });
                    }
                    
                    frameRef.current.scale = [1, 1];
                }}
                onScaleEnd={debouncedSave}
                onRotate={({ beforeRotate, drag }) => {
                    frameRef.current.rotate = beforeRotate;
                    frameRef.current.translate = drag.beforeTranslate;
                    targetRef.current.style.transform = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px) rotate(${beforeRotate}deg) scale(1, 1)`;
                }}
                onRotateEnd={debouncedSave}
            />
        </div>
    );
}
