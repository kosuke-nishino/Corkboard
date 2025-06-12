// resources/js/Components/MoveableCard.jsx

import React, { useRef, useState } from "react";
import Moveable from "react-moveable";

export default function MoveableCard() {
  const targetRef = useRef();
  const [frame] = useState({
    translate: [0, 0],
    rotate: 0,
    scale: [1, 1],
  });

  return (
    <div>
      {/* 動かす対象 */}
      <div
        ref={targetRef}
        style={{
          width: "200px",
          height: "150px",
          background: "#ffd",
          border: "1px solid #ccc",
          transform: `
            translate(${frame.translate[0]}px, ${frame.translate[1]}px)
            rotate(${frame.rotate}deg)
            scale(${frame.scale[0]}, ${frame.scale[1]})
          `,
        }}
      >
        メモ内容をここに
      </div>

      {/* moveable制御 */}
      <Moveable
        target={targetRef}
        draggable={true}
        scalable={true}
        rotatable={true}
        throttleDrag={0}
        throttleScale={0}
        throttleRotate={0}
        onDrag={({ beforeTranslate }) => {
          frame.translate = beforeTranslate;
          targetRef.current.style.transform = `
            translate(${frame.translate[0]}px, ${frame.translate[1]}px)
            rotate(${frame.rotate}deg)
            scale(${frame.scale[0]}, ${frame.scale[1]})
          `;
        }}
        onScale={({ scale }) => {
          frame.scale = scale;
          targetRef.current.style.transform = `
            translate(${frame.translate[0]}px, ${frame.translate[1]}px)
            rotate(${frame.rotate}deg)
            scale(${frame.scale[0]}, ${frame.scale[1]})
          `;
        }}
        onRotate={({ beforeRotate }) => {
          frame.rotate = beforeRotate;
          targetRef.current.style.transform = `
            translate(${frame.translate[0]}px, ${frame.translate[1]}px)
            rotate(${frame.rotate}deg)
            scale(${frame.scale[0]}, ${frame.scale[1]})
          `;
        }}
      />
    </div>
  );
}
