"use client";

import styles from "./Disk.module.css";
import { useSpring, animated } from "@react-spring/web";
import DiskFront from "@/components/disk/DiskFront";

type DiskProps = {
  size?: number;
};

function Disk({ size = 220 }: DiskProps) {
  const [translate, translateApi] = useSpring(() => ({
    from: {
      "--translate-x": "0px",
      "--translate-y": "0px",
      "--translate-z": "0px",
      "--scale": "1",
    },
  }));

  const [rotate, rotateApi] = useSpring(() => ({
    from: { "--rotate-x": "0deg", "--rotate-y": "0deg", "--rotate-z": "0deg" },
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left - size / 2) / size) * 2;
    const relativeY = ((e.clientY - rect.top - size / 2) / size) * -2;
    rotateApi.start({
      to: {
        "--rotate-x": `${-relativeY * 30}deg`,
        "--rotate-y": `${-relativeX * 30}deg`,
        "--rotate-z": "0",
      },
    });
  };

  const handleMouseLeave = () => {
    rotateApi.start({
      to: {
        "--rotate-x": "0deg",
        "--rotate-y": "0deg",
        "--rotate-z": "0deg",
      },
    });
  };

  return (
    <animated.div
      className={styles.scene}
      style={{
        // @ts-ignore
        "--size": `${size}px`,
        ...translate,
        ...rotate,
      }}
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
              A0.5 0.5 0 0 1 0 0.5
              A0.5 0.5 0 0 1 1 0.5
              L0.565 0.5
              A0.065 0.065 0 0 1 0.435 0.5
              A0.065 0.065 0 0 1 0.565 0.5
              Z"
            />
          </clipPath>
        </defs>
      </svg>

      <svg>
        <defs>
          <clipPath
            id="hole1"
            clipPathUnits="objectBoundingBox"
            clipRule="evenodd"
          >
            <path
              d="
              M1 0.5
              A0.5 0.5 0 0 1 0 0.5
              A0.5 0.5 0 0 1 1 0.5
              L0.87 0.5
              A0.37 0.37 0 0 1 0.13 0.5
              A0.37 0.37 0 0 1 0.87 0.5
              Z"
            />
          </clipPath>
        </defs>
      </svg>

      <svg>
        <defs>
          <clipPath
            id="hole2"
            clipPathUnits="objectBoundingBox"
            clipRule="evenodd"
          >
            <path
              d="
              M1 0.5
              A0.5 0.5 0 0 1 0 0.5
              A0.5 0.5 0 0 1 1 0.5
              L0.575 0.5
              A0.075 0.075 0 0 1 0.425 0.5
              A0.075 0.075 0 0 1 0.575 0.5
              Z"
            />
          </clipPath>
        </defs>
      </svg>

      <div
        className={styles.diskTranslator}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.diskRotator}>
          <DiskFront type="classic" />
          <div className={styles.back}>
            <div className={styles.back_hologram}></div>
          </div>
        </div>
      </div>
    </animated.div>
  );
}

export default Disk;
