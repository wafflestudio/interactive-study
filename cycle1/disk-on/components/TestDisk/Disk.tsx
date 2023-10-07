"use client";

import styles from "./Disk.module.css";
import { useSpring, animated } from "@react-spring/web";
import DiskFront from "@/components/disk/DiskFront";
import DiskBack from "@/components/disk/DiskBack";
import { MouseEventHandler } from "react";

type DiskProps = {
  size?: number;
  moveRotateX: number;
  moveRotateY: number;
  translateX: number;
  translateY: number;
  scale: number;
  isGrabbed: boolean;
  isPlaying: boolean;
  isPreview: boolean;
  musicUrl: string;
  imageUrl: string;
  frontType: "classic" | "paper" | "holographic";
  backType: "normal" | "dim" | "bright";
  onMouseDown: MouseEventHandler;
  onMouseUp: MouseEventHandler;
  onClick: MouseEventHandler;
};

function TestDisk({
  size = 220,
  translateX,
  translateY,
  scale,
  moveRotateX,
  moveRotateY,
  isGrabbed,
  frontType,
  backType,
  onMouseDown,
  onMouseUp,
  onClick,
  isPreview,
  isPlaying,
}: DiskProps) {
  const flip = isPreview ? 180 : 0;

  const radius = (scale * size) / 2;

  const translate = useSpring({
    "--translate-x": `${translateX}px`,
    "--translate-y": `${translateY}px`,
    "--translate-z": "0px",
    "--scale": `${scale}`,
    "--move-rotate-x": `${moveRotateX}deg`,
    "--move-rotate-y": `${moveRotateY}deg`,
  });

  const [rotate, rotateApi] = useSpring(() => ({
    from: {
      "--rotate-x": "0deg",
      "--rotate-y": `${flip}deg`,
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

    if (!isPlaying) {
      rotateApi.start({
        to: {
          "--rotate-x": `${-relativeY * 30}deg`,
          "--rotate-y": `${-relativeX * -30 + flip}deg`,
          "--rotate-z": "0",
        },
      });
    }

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
        "--rotate-y": `${flip}deg`,
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
        onMouseDown={(e) => {
          e.preventDefault();
          onMouseDown(e);
        }}
        onMouseUp={(e) => {
          onMouseUp(e);
          onClick(e);
        }}
      >
        <div className={styles.diskRotator}>
          <DiskFront type={frontType} />
          <DiskBack type={backType} />
          <div className={`${styles.glare} ${styles.front}`} />
          <div className={`${styles.glare} ${styles.back}`} />
        </div>
      </div>
    </animated.div>
  );
}

export default TestDisk;
