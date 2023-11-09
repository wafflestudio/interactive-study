"use client";

import styles from "./Disk.module.css";
import { animated, SpringValue } from "@react-spring/web";
import DiskFront from "@/components/Disk/DiskFront";
import DiskBack from "@/components/Disk/DiskBack";
import { useDiskMovement } from "@/hooks/useDiskMovement";
import ClipPath from "@/utils/ClipPath";

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
  index: number;
  id: string;
  imageUrl: string;
  frontType: "classic" | "paper" | "holographic";
  backType: "normal" | "dim" | "bright";
  size?: number;
  style?: Record<string, SpringValue<string | number>>;
};

function Disk({
  index,
  id,
  size = 220,
  style,
  imageUrl,
  frontType,
  backType,
}: DiskProps) {
  const {
    movement,
    handleMouseDownOnDisk,
    handleMouseLeaveFromDisk,
    handleMouseMoveOnDisk,
    handleMouseClickOnDisk,
  } = useDiskMovement({
    size,
    id,
    index,
  });
  return (
    <>
      <animated.div
        className={styles.scene}
        // @ts-ignore
        style={{
          ...movement,
          ...style,
        }}
      >
        <div
          className={styles.diskTranslator}
          onClick={handleMouseClickOnDisk}
          onMouseDown={handleMouseDownOnDisk}
          onMouseMove={handleMouseMoveOnDisk}
          onMouseLeave={handleMouseLeaveFromDisk}
        >
          <div className={styles.diskRotator}>
            <DiskFront type={frontType} imageUrl={imageUrl} />
            <DiskBack type={backType} />
            <div className={`${styles.glare} ${styles.front}`} />
            <div className={`${styles.glare} ${styles.back}`} />
          </div>
        </div>
      </animated.div>
      <div style={{ width: 0, height: 0 }}>
        <ClipPath holeSize={13} />
        <ClipPath holeSize={16.94} />
        <ClipPath holeSize={18.86} />
        <ClipPath holeSize={25} />
      </div>
    </>
  );
}

export default Disk;
