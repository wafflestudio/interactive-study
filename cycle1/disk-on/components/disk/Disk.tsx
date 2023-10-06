"use client";

import styles from "./Disk.module.css";
import { useSpring, animated } from "@react-spring/web";
import DiskFront from "@/components/disk/DiskFront";
import DiskBack from "@/components/disk/DiskBack";

type DiskProps = {
  size?: number;
};

function Disk({ size = 220 }: DiskProps) {
  const radius = size / 2;

  const [translate, translateApi] = useSpring(() => ({
    from: {
      "--translate-x": "0px",
      "--translate-y": "0px",
      "--translate-z": "0px",
      "--scale": "1",
    },
  }));

  const [rotate, rotateApi] = useSpring(() => ({
    from: {
      "--rotate-x": "0deg",
      "--rotate-y": "180deg",
      "--rotate-z": "0deg",
    },
  }));

  const [pointer, pointerApi] = useSpring(() => ({
    from: {
      "--pointer-x": `${radius}px`,
      "--pointer-y": `${radius}px`,
      "--relative-x": 0,
      "--relative-y": 0,
      "--pointer-from-center": 0,
    },
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    const relativeX = (pointerX - radius) / radius;
    const relativeY = (pointerY - radius) / radius;

    rotateApi.start({
      to: {
        "--rotate-x": `${-relativeY * 30}deg`,
        "--rotate-y": `${-relativeX * -30 + 180}deg`,
        "--rotate-z": "0",
      },
    });

    pointerApi.start({
      to: {
        "--pointer-x": `${pointerX}px`,
        "--pointer-y": `${pointerY}px`,
        "--relative-x": relativeX,
        "--relative-y": relativeY,
        "--pointer-from-center":
          Math.sqrt(
            (e.clientX - rect.left - radius) ** 2 +
              (e.clientY - rect.top - radius) ** 2,
          ) / radius,
      },
    });
  };

  const handleMouseLeave = () => {
    const fadeOutConfig = { mass: 1, tension: 200, friction: 40 };

    rotateApi.start({
      to: {
        "--rotate-x": "0deg",
        "--rotate-y": "180deg",
        "--rotate-z": "0deg",
      },
      config: fadeOutConfig,
    });
    pointerApi.start({
      to: {
        "--pointer-x": `${radius}px`,
        "--pointer-y": `${radius}px`,
        "--relative-x": 0,
        "--relative-y": 0,
        "--pointer-from-center": 0,
      },
      config: fadeOutConfig,
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
        ...pointer,
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
          <DiskFront />
          <DiskBack />
          <div className={`${styles.glare} ${styles.front}`} />
          <div className={`${styles.glare} ${styles.back}`} />
        </div>
      </div>
    </animated.div>
  );
}

export default Disk;
