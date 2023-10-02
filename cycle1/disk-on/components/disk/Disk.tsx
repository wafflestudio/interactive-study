"use client";

import styles from "./Disk.module.css";
import { useSpring, animated } from "@react-spring/web";

type DiskProps = {
  size?: number;
};

function Disk({ size = 220 }: DiskProps) {
  const cdSize220 = size;
  const cdSize216 = (size * 216) / 220;

  const [translate, translateApi] = useSpring(() => ({
    from: { "--translateX": "0", "--translateY": "0", "--translateZ": "0" },
  }));

  const [rotate, rotateApi] = useSpring(() => ({
    from: { "--rotateX": "0", "--rotateY": "0", "--rotateZ": "0" },
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left - size / 2) / size) * 2;
    const relativeY = ((e.clientY - rect.top - size / 2) / size) * -2;
    rotateApi.start({
      to: {
        "--rotateX": `${-relativeY * 30}deg`,
        "--rotateY": `${-relativeX * 30}deg`,
        "--rotateZ": "0",
      },
    });
  };

  const handleMouseLeave = () => {
    rotateApi.start({
      to: {
        "--rotateX": "0",
        "--rotateY": "0",
        "--rotateZ": "0",
      },
    });
  };

  return (
    <animated.div
      className={styles.scene}
      style={{
        width: cdSize220,
        height: cdSize220,
        perspective: "1000px",
        ...translate,
        ...rotate,
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
    </animated.div>
  );
}

export default Disk;
