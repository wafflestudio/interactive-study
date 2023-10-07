import { animated, useSpring } from "@react-spring/web";
import styles from "./MockDisk.module.css";
import classNames from "classnames/bind";
import { MouseEventHandler } from "react";
import { Disk } from "@/types/spring/disk";

const cx = classNames.bind(styles);

type DiskProps = {
  size: number;
  moveRotateX: number;
  moveRotateY: number;
  translateX: number;
  translateY: number;
  scale: number;
  isGrabbed: boolean;
  isPlaying: boolean;
  onMouseDown: MouseEventHandler;
  onMouseUp: MouseEventHandler;
};

export default function Disk({
  size,
  translateX,
  translateY,
  scale,
  moveRotateX,
  moveRotateY,
  isGrabbed,
  onMouseDown,
  onMouseUp,
}: DiskProps) {
  const radius = (size * scale) / 2;

  const translate = useSpring(() => ({
    from: {
      "--translate-x": `${translateX}px`,
      "--translate-y": `${translateY}px`,
      "--translate-z": "0px",
      "--scale": `${scale}`,
    },
  }));

  const [rotate, rotateApi] = useSpring(() => ({
    from: {
      "--rotate-x": `0deg`,
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
        "--rotate-x": `${-relativeY * 30 + moveRotateX}deg`,
        "--rotate-y": `${-relativeX * -30 + 180 + moveRotateY}deg`,
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
    <div className={cx("disk-wrapper")}>
      <animated.div
        className={cx("disk", { grabbing: isGrabbed })}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <div className={cx("mini-disk")}>
          <div className={cx("mini-mini-disk")}></div>
        </div>
      </animated.div>
    </div>
  );
}
