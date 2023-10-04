"use client";

import classNames from "classnames/bind";
import styles from "./Spring.module.css";
import { MouseEventHandler, useState } from "react";
import disks from "@/data/disks.json";
import Disk from "@/components/spring/Disk/Disk";
import { Disk as DiskType } from "@/types/spring/disk";
import { Movement } from "@/types/spring/movement";

const cx = classNames.bind(styles);

// types
type GrabStatus = {
  grabStatus: "idle" | "grabbing";
  grabTarget: {
    targetId: DiskType["id"] | null;
    targetX: number;
    targetY: number;
  };
  movementX: number;
  movementY: number;
  speedX: number;
  speedY: number;
};

type DiskStatus = {
  diskStatus: "idle" | "preview" | "play";
  diskTarget: DiskType["id"] | null;
};

// constants
const initialDiskStatus: DiskStatus = {
  diskStatus: "idle",
  diskTarget: null,
};

const initialGrabStatus: GrabStatus = {
  grabStatus: "idle",
  grabTarget: {
    targetId: null,
    targetX: 0,
    targetY: 0,
  },
  movementX: 0,
  movementY: 0,
  speedX: 0,
  speedY: 0,
};

export default function Spring() {
  const [diskStatus, setDiskStatus] = useState<DiskStatus>(initialDiskStatus);
  const [grabStatus, setGrabStatus] = useState<GrabStatus>(initialGrabStatus);

  const calculateDiskMovement = (diskId: DiskType["id"]): Movement => {
    const result: Movement = { x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0 };
    if (grabStatus.grabTarget.targetId === diskId) {
      result.x = grabStatus.movementX;
      result.y = grabStatus.movementY;
      /**
       * TODO: refine rotate calculation
       */
      result.rotateX = grabStatus.speedY * -5;
      result.rotateY = grabStatus.speedX * 5;
    } else if (diskStatus.diskTarget === diskId) {
    }
    return result;
  };

  const calculateDiskMouseDownHandler =
    (diskId: DiskType["id"]): MouseEventHandler =>
    (e) => {
      if (grabStatus.grabStatus !== "idle") return;
      setGrabStatus({
        ...grabStatus,
        grabStatus: "grabbing",
        grabTarget: {
          targetId: diskId,
          targetX: e.clientX,
          targetY: e.clientY,
        },
      });
    };

  const onMouseUp = () => {
    if (grabStatus.grabStatus === "grabbing") {
      setGrabStatus(initialGrabStatus);
    }
  };

  return (
    <div
      className={cx("main")}
      onMouseMove={(e) => {
        if (grabStatus.grabStatus === "grabbing") {
          setGrabStatus({
            ...grabStatus,
            movementX: e.clientX - grabStatus.grabTarget.targetX,
            movementY: e.clientY - grabStatus.grabTarget.targetY,
            speedX: e.movementX,
            speedY: e.movementY,
          });
        }
      }}
      onMouseUp={onMouseUp}
    >
      {disks.map(({ id, backgroundColor }) => {
        const movement = calculateDiskMovement(id);
        return (
          <Disk
            key={id}
            movement={movement}
            backgroundColor={backgroundColor}
            onMouseDown={calculateDiskMouseDownHandler(id)}
            onMouseUp={onMouseUp}
          />
        );
      })}
    </div>
  );
}
