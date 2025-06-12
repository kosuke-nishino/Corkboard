import React, { useRef, useState } from "react";
import Moveable from "react-moveable";

export default function MoveableCard() {
  const targetRef = useRef(null);
  const [frame] = useState({
    translate: [0, 0],
    rotate: 0,
    scale: [1, 1],
  });
  const [isActive, setIsActive] = useState(false);

  // 背景クリックで非表示にする処理
  const handleBackgroundClick = () => {
    setIsActive(false);
  };

  const handleCardClick = (e) => {
    e.stopPropagation(); // 背景にクリックイベントが伝わらないようにする
    setIsActive(true);
  };

  return (
    <div
      onClick={handleBackgroundClick} // 背景クリックで非表示
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundImage: "url('/path/to/your/background.png')",
        backgroundSize: "cover",
      }}
    >
      {/* メモカード本体 */}
      <div
        ref={targetRef}
        onClick={handleCardClick} // カードクリックで選択
        style={{
          width: "200px",
          height: "150px",
          background: "#ffd",
          border: isActive ? "2px solid blue" : "1px solid #ccc",
          transform: `
            translate(${frame.translate[0]}px, ${frame.translate[1]}px)
            rotate(${frame.rotate}deg)
            scale(${frame.scale[0]}, ${frame.scale[1]})
          `,
          position: "absolute",
          top: "50px",
          left: "50px",
        }}
      >
        メモ内容をここに
      </div>

      {/* Moveable */}
      <Moveable
        target={isActive ? targetRef.current : null}
        draggable={isActive}
        scalable={isActive}
        rotatable={isActive}
        renderDirections={["nw", "ne", "sw", "se", "n", "s", "e", "w"]}
        origin={false}
        onDrag={({ beforeTranslate }) => {
          frame.translate = beforeTranslate;
          targetRef.current.style.transform = `
            translate(${frame.translate[0]}px, ${frame.translate[1]}px)
            rotate(${frame.rotate}deg)
            scale(${frame.scale[0]}, ${frame.scale[1]})
          `;
        }}
        onScale={({ scale, drag }) => {
          frame.scale = scale;
          frame.translate = drag.beforeTranslate;
          targetRef.current.style.transform = `
            translate(${frame.translate[0]}px, ${frame.translate[1]}px)
            rotate(${frame.rotate}deg)
            scale(${frame.scale[0]}, ${frame.scale[1]})
          `;
        }}
        onRotate={({ beforeRotate, drag }) => {
          frame.rotate = beforeRotate;
          frame.translate = drag.beforeTranslate;
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
