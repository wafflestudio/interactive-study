"use client";

import styles from "./Disk.module.css";
import { useSpring, animated, SpringValue } from "@react-spring/web";
import DiskFront from "@/components/disk-impl/DiskFront";
import DiskBack from "@/components/disk-impl/DiskBack";

/**
 * style에 필요한 값
 * --size: 220px;
 * --translate-x: 0px;
 * --translate-y: 0px;
 * --translate-z: 0px;
 * --rotate-x: 0deg;
 * --rotate-y: 0deg;
 * --rotate-z: 0deg;
 * --pointer-x: 110px;
 * --pointer-y: 110px;
 * --relative-x: 0;
 * --relative-y: 0;
 * --pointer-from-center: 0;
 */
type DiskProps = {
  size?: number;
  style?: Record<string, SpringValue<string | number>>;
};

function Disk({ size = 220, style }: DiskProps) {
  const radius = size / 2;

  const [translate, translateApi] = useSpring(() => ({
    from: {
      "--translate-x": "0px",
      "--translate-y": "0px",
      "--translate-z": "0px",
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
              (e.clientY - rect.top - radius) ** 2
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
        ...style,
      }}
    >
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
