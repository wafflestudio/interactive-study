"use client";

import classNames from "classnames/bind";
import styles from "./Spring.module.css";
import { MouseEventHandler, useState } from "react";
import disks from "@/data/disks.json";
import { Disk as DiskType } from "@/types/spring/disk";
import { Movement } from "@/types/spring/movement";
import MockDisk from "@/components/MockDisk/MockDisk";

const cx = classNames.bind(styles);

type DiskStatus = {
  originalStatus: "idle" | "select" | "preview" | "play";
  grabbed: boolean;
};

type GrabStatus = {
  targetId: DiskType["id"];
  initialX: number;
  initialY: number;
  currentX: number;
  currentY: number;
  speedX: number;
  speedY: number;
};

type SelectStatus = {
  targetId: DiskType["id"];
};

type PreviewStatus = SelectStatus;

type PlayStatus = SelectStatus & { url: string; isPlaying: boolean };

type InteractionStatus = {
  grab: null | GrabStatus;
  select: null | SelectStatus;
  preview: null | PreviewStatus;
  play: null | PlayStatus;
};

export default function Spring() {
  const [interactionStatus, setInteractionStatus] = useState<InteractionStatus>(
    {
      grab: null,
      select: null,
      preview: null,
      play: null,
    },
  );

  const getDiskStatus = (diskId: DiskType["id"]): DiskStatus => {
    let status: DiskStatus["originalStatus"] = "idle";
    let grabbed = false;
    if (interactionStatus.grab?.targetId === diskId) grabbed = true;
    if (interactionStatus.play?.targetId === diskId) {
      status = "play";
    } else if (interactionStatus.preview?.targetId === diskId) {
      status = "preview";
    } else if (interactionStatus.select?.targetId === diskId) {
      status = "select";
    }
    return { originalStatus: status, grabbed };
  };

  const calculateDiskMovement = (diskId: DiskType["id"]): Movement => {
    const result: Movement = {
      translateX: 0,
      translateY: 0,
      scale: 1,
      moveRotateX: 0,
      moveRotateY: 0,
    };

    const { originalStatus, grabbed } = getDiskStatus(diskId);

    if (interactionStatus.grab && grabbed) {
      result.translateX = interactionStatus.grab.currentX;
      result.translateY = interactionStatus.grab.currentY;
      /**
       * TODO: refine rotate calculation
       */
      result.moveRotateX = interactionStatus.grab.speedY * -2.5;
      result.moveRotateY = interactionStatus.grab.speedX * 2.5;
    } else {
      if (originalStatus === "play" && interactionStatus.play) {
      }
      if (originalStatus === "preview" && interactionStatus.preview) {
      }
      if (originalStatus === "select" && interactionStatus.select) {
      }
    }
    return result;
  };

  const onGrabStart =
    (diskId: DiskType["id"]): MouseEventHandler =>
    (e) => {
      if (interactionStatus.grab) return;
      setInteractionStatus({
        ...interactionStatus,
        grab: {
          targetId: diskId,
          initialX: e.clientX,
          initialY: e.clientY,
          currentX: 0,
          currentY: 0,
          speedX: 0,
          speedY: 0,
        },
      });
    };

  const onGrabMove: MouseEventHandler = (e) => {
    if (!interactionStatus.grab) return;
    const { grab } = interactionStatus;
    const previousX = grab.currentX;
    const previousY = grab.currentY;

    setInteractionStatus({
      ...interactionStatus,
      grab: {
        ...grab,
        currentX: e.clientX - grab.initialX,
        currentY: e.clientY - grab.initialY,
        speedX: e.clientX - grab.initialX - previousX,
        speedY: e.clientY - grab.initialY - previousY,
      },
    });
  };

  const onGrabEnd = () => {
    if (interactionStatus.grab)
      setInteractionStatus({ ...interactionStatus, grab: null });
  };

  return (
    <div className={cx("main")} onMouseMove={onGrabMove} onMouseUp={onGrabEnd}>
      <div className={cx("preview")} />
      {disks.map(({ id }) => {
        const { originalStatus, grabbed } = getDiskStatus(id);
        const { translateX, translateY, moveRotateX, moveRotateY, scale } =
          calculateDiskMovement(id);
        return (
          <MockDisk
            key={id}
            size={220}
            isGrabbed={grabbed}
            onMouseDown={onGrabStart(id)}
            onMouseUp={onGrabEnd}
            translateX={translateX}
            translateY={translateY}
            scale={scale}
            moveRotateX={moveRotateX}
            moveRotateY={moveRotateY}
            isPlaying={
              originalStatus === "play" && !!interactionStatus.play?.isPlaying
            }
          />
        );
      })}
    </div>
  );
}
