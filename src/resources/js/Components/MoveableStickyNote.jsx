import React from 'react';
import Moveable from './Moveable';

export default function MoveableStickyNote({ stickyNote, onEdit, onDelete }) {
    return (
        <Moveable stickyNote={stickyNote} updateUrl="/sticky-notes" onPositionUpdate={onPositionUpdate}>
            {({ targetRef, frameRef, isActive, onClick }) => {
                const translateX = frameRef.current?.translate?.[0] ?? stickyNote.x ?? 0;
                const translateY = frameRef.current?.translate?.[1] ?? stickyNote.y ?? 0;
                const rotate = frameRef.current?.rotate ?? stickyNote.rotation ?? 0;
                const scaleX = frameRef.current?.scale?.[0] ?? 1;
                const scaleY = frameRef.current?.scale?.[1] ?? 1;

                return (
                    <div
                        ref={targetRef}
                        onClick={onClick}
                        style={{
                            width: `${stickyNote.width ?? 150}px`,
                            height: `${stickyNote.height ?? 100}px`,
                            background: stickyNote.color || "#ffeb3b",
                            border: isActive ? "2px solid #f57c00" : "1px solid #fbc02d",
                            transform: `
                                translate(${translateX}px, ${translateY}px)
                                rotate(${rotate}deg)
                                scale(${scaleX}, ${scaleY})
                            `,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: stickyNote.z_index || 1,
                            padding: "8px",
                            borderRadius: "4px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            overflow: "auto",
                            fontSize: "12px",
                            fontFamily: "Comic Sans MS, cursive",
                            cursor: "move",
                        }}
                    >
                        {isActive && (
                            <div className="absolute top-1 right-1 flex gap-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(stickyNote);
                                    }}
                                    className="bg-orange-500 text-white text-xs px-1 py-1 rounded hover:bg-orange-600 shadow"
                                    style={{ fontSize: '10px', lineHeight: '1' }}
                                >
                                    ✎
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('この付箋を削除しますか？')) {
                                            onDelete(stickyNote);
                                        }
                                    }}
                                    className="bg-red-500 text-white text-xs px-1 py-1 rounded hover:bg-red-600 shadow"
                                    style={{ fontSize: '10px', lineHeight: '1' }}
                                >
                                    🗑
                                </button>
                            </div>
                        )}

                        <div className="sticky-note-content" style={{ 
                            whiteSpace: 'pre-wrap', 
                            wordBreak: 'break-word',
                            marginTop: isActive ? '16px' : '0'
                        }}>
                            {stickyNote.content || '新しい付箋'}
                        </div>
                    </div>
                );
            }}
        </Moveable>
    );
}