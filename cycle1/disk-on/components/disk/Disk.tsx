"use client";

import styles from "./Disk.module.css";
import { useState } from "react";

type DiskProps = {
  size?: number;
};

function Disk({ size = 220 }: DiskProps) {
  const cdSize220 = size;
  const cdSize216 = (size * 216) / 220;

  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [translateZ, setTranslateZ] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left - size / 2) / size) * 2;
    const relativeY = ((e.clientY - rect.top - size / 2) / size) * -2;
    console.log(relativeX, relativeY);
    setRotateX(-relativeY * 30);
    setRotateY(-relativeX * 30);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className={styles.scene}
      style={{
        width: cdSize220,
        height: cdSize220,
        perspective: "1000px",
        // @ts-ignore
        "--translateX": `${translateX}px`,
        "--translateY": `${translateY}px`,
        "--translateZ": `${translateZ}px`,
        "--rotateX": `${rotateX}deg`,
        "--rotateY": `${rotateY}deg`,
        "--rotateZ": `${rotateZ}deg`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg>
        <defs>
          <clipPath
            id="cd"
            clipPathUnits="objectBoundingBox"
            clipRule="evenodd"
          >
            <path
              d="
              M1 0.5
              A0.5 0.5 0 0 1 0.5 1
              A0.5 0.5 0 0 1 0 0.5
              A0.5 0.5 0 0 1 0.5 0
              A0.5 0.5 0 0 1 1 0.5
              L0.565 0.5
              A0.065 0.065 0 0 1 0.5 0.565
              A0.065 0.065 0 0 1 0.435 0.5
              A0.065 0.065 0 0 1 0.5 0.435
              A0.065 0.065 0 0 1 0.565 0.5
              Z"
            />
          </clipPath>
        </defs>
      </svg>

      <div className={styles.diskTranslator}>
        <div className={styles.diskRotator}>
          <div className={styles.front}></div>
          <div className={styles.back}>
            <div className={styles.back_hologram}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Disk;
