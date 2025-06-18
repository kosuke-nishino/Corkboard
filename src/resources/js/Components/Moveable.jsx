import React, { useRef, useState, useEffect, useCallback } from "react";
import Moveable from "react-moveable";
import axios from "axios";

export default function MoveableWrapper({ task, updateUrl = '/task-memos', children, onPositionUpdate }) {
    const targetRef = useRef(null);
    const frameRef = useRef({
        translate: [0, 0],
        rotate: 0,
        scale: [1, 1],
    });

    const [isActive, setIsActive] = useState(false);

    // デバウンス用のタイマー
    const saveTimeoutRef = useRef(null);

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

    // デバウンス付きの保存関数
    const debouncedSave = useCallback(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        
        saveTimeoutRef.current = setTimeout(async () => {
            const rect = targetRef.current?.getBoundingClientRect();

            const payload = {
                x: Math.round(frameRef.current.translate[0]),
                y: Math.round(frameRef.current.translate[1]),
                width: Math.round(rect?.width ?? task.width ?? 200),
                height: Math.round(rect?.height ?? task.height ?? 180),
                rotation: Math.round(frameRef.current.rotate),
                z_index: task.z_index ?? 0,
            };

            console.log("送信データ（位置更新）:", payload);

            try {
                const response = await axios.put(`${updateUrl}/${task.id}/position`, payload);
                console.log("位置保存成功:", payload);
                
                if (onPositionUpdate && response.data.task) {
                    onPositionUpdate(response.data.task);
                }
            } catch (err) {
                console.error("位置保存エラー:", err);
                // エラー時はローカルストレージに保存
                localStorage.setItem(`task_position_${task.id}`, JSON.stringify(payload));
            }
        }, 300); // 300ms のデバウンス
    }, [task.id, task.width, task.height, task.z_index, updateUrl, onPositionUpdate]);

    // タスクデータが変更された時の初期化
    useEffect(() => {
        if (targetRef.current && task) {
            // ローカルストレージから復旧を試行
            const savedPosition = localStorage.getItem(`task_position_${task.id}`);
            let position = null;
            
            if (savedPosition) {
                try {
                    position = JSON.parse(savedPosition);
                    console.log("ローカルストレージから位置復旧:", position);
                } catch (e) {
                    console.warn("ローカルストレージの位置データが無効:", e);
                }
            }

            const x = position?.x ?? task.x ?? 0;
            const y = position?.y ?? task.y ?? 0;
            const rotation = position?.rotation ?? task.rotation ?? 0;
            const width = position?.width ?? task.width ?? 200;
            const height = position?.height ?? task.height ?? 180;

            // frameRef を更新
            frameRef.current.translate = [x, y];
            frameRef.current.rotate = rotation;
            frameRef.current.scale = [1, 1];

            // DOM要素に直接適用
            targetRef.current.style.transform = `
                translate(${x}px, ${y}px)
                rotate(${rotation}deg)
                scale(1, 1)
            `;
            targetRef.current.style.width = `${width}px`;
            targetRef.current.style.height = `${height}px`;

            console.log("タスク初期位置設定:", { x, y, rotation, width, height });

            // 保存された位置がある場合は、サーバーに同期
            if (position) {
                setTimeout(() => {
                    debouncedSave();
                    localStorage.removeItem(`task_position_${task.id}`);
                }, 1000);
            }
        }
    }, [task.id, task.x, task.y, task.rotation, task.width, task.height, debouncedSave]);

    // クリーンアップ
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

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
            onDragEnd={debouncedSave}
            onScale={({ scale, drag }) => {
                frameRef.current.scale = scale;
                frameRef.current.translate = drag.beforeTranslate;
                targetRef.current.style.transform = `
                    translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)
                    rotate(${frameRef.current.rotate}deg)
                    scale(${scale[0]}, ${scale[1]})
                `;
            }}
            onScaleEnd={debouncedSave}
            onRotate={({ beforeRotate, drag }) => {
                frameRef.current.rotate = beforeRotate;
                frameRef.current.translate = drag.beforeTranslate;
                targetRef.current.style.transform = `
                    translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)
                    rotate(${beforeRotate}deg)
                    scale(${frameRef.current.scale[0]}, ${frameRef.current.scale[1]})
                `;
            }}
            onRotateEnd={debouncedSave}
        />
    </div>
);

    
}
