import { animated, useSpring } from "@react-spring/web";
import styles from "./Disk.module.css";
import classNames from "classnames/bind";
import { MouseEventHandler } from "react";
import { Disk } from "@/types/spring/disk";
import { Movement } from "@/types/spring/movement";

const cx = classNames.bind(styles);

type DiskProps = {
  movement: Movement;
  backgroundColor: Disk["backgroundColor"];
  isGrabbed: boolean;
  onMouseDown: MouseEventHandler;
  onMouseUp: MouseEventHandler;
};

export default function Disk({
  movement,
  backgroundColor,
  isGrabbed,
  onMouseDown,
  onMouseUp,
}: DiskProps) {
  const spring = useSpring(movement);
  return (
    <div className={cx("disk-wrapper")}>
      <animated.div
        className={cx("disk", { grabbing: isGrabbed })}
        style={{ backgroundColor, ...spring }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />
    </div>
  );
}
