"use client";

import classNames from "classnames/bind";
import styles from "./Spring.module.css";
import { MouseEventHandler, useState } from "react";
import disks from "@/data/disks.json";
import { Disk as DiskType } from "@/types/spring/disk";
import { Movement } from "@/types/spring/movement";
import TestDisk from "@/components/TestDisk/Disk";
import Player from "@/components/Player/Player";

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

const initialY = (index: number) => index * 110 + 220;

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

  const calculateDiskMovement = (
    diskId: DiskType["id"],
    index: number,
  ): Movement => {
    const result: Movement = {
      translateX: interactionStatus.play ? -478 : -258,
      translateY: initialY(index),
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
      result.moveRotateX = interactionStatus.grab.speedY * -5;
      result.moveRotateY = interactionStatus.grab.speedX * 5;
      if (originalStatus === "preview") {
        result.scale = 2;
      }
    } else {
      if (originalStatus === "play" && interactionStatus.play) {
        result.translateX = window.innerWidth - 580;
        result.translateY = window.innerHeight / 2 + 110;
        result.scale = 2;
      } else if (originalStatus === "preview" && interactionStatus.preview) {
        result.translateX = window.innerWidth / 2 - 110;
        result.translateY = window.innerHeight / 2 + 110;
        result.scale = 2;
      } else if (originalStatus === "select" && interactionStatus.select) {
        result.translateX = -58;
      }
    }
    return result;
  };

  const onSelect =
    (diskId: DiskType["id"]): MouseEventHandler =>
    (e) => {
      if (interactionStatus.grab) return;

      const { originalStatus } = getDiskStatus(diskId);
      if (originalStatus === "idle") {
        setInteractionStatus({
          ...interactionStatus,
          select: {
            targetId: diskId,
          },
          preview: null,
        });
      }
    };

  const onGrabStart =
    (diskId: DiskType["id"], index: number): MouseEventHandler =>
    (e) => {
      if (interactionStatus.grab) return;
      const { originalStatus } = getDiskStatus(diskId);
      if (originalStatus === "idle") return;
      if (originalStatus === "select") {
        setInteractionStatus({
          ...interactionStatus,
          grab: {
            targetId: diskId,
            initialX: e.clientX + 58,
            initialY: e.clientY - initialY(index),
            currentX: -58,
            currentY: initialY(index),
            speedX: 0,
            speedY: 0,
          },
        });
      }
      if (originalStatus === "preview") {
        const x = window.innerWidth / 2 - 110;
        const y = window.innerHeight / 2 + initialY(index) - 330;
        setInteractionStatus({
          ...interactionStatus,
          grab: {
            targetId: diskId,
            initialX: e.clientX - x,
            initialY: e.clientY - y,
            currentX: x,
            currentY: y,
            speedX: 0,
            speedY: 0,
          },
        });
      }
      if (originalStatus === "play") {
        return;
      }
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

  const onGrabEnd: MouseEventHandler = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    if (interactionStatus.grab) {
      if (e.clientX > window.innerWidth / 2) {
        if (interactionStatus.select) {
          setInteractionStatus({
            ...interactionStatus,
            select: null,
            grab: null,
            preview: {
              targetId: interactionStatus.grab.targetId,
            },
          });
        }
        if (interactionStatus.preview) {
          setInteractionStatus({
            ...interactionStatus,
            grab: null,
            preview: null,
            play: {
              targetId: interactionStatus.grab.targetId,
              url: "",
              isPlaying: true,
            },
          });
        }
      } else {
        setInteractionStatus({
          ...interactionStatus,
          select: null,
          grab: null,
          preview: null,
        });
      }
    }
  };

  return (
    <div className={cx("main")} onMouseMove={onGrabMove} onMouseUp={onGrabEnd}>
      <Player
        isPlaying={!!interactionStatus.play}
        src={interactionStatus.play?.url || null}
        onEmit={() => {
          setInteractionStatus({
            ...interactionStatus,
            play: null,
          });
        }}
      />
      {disks.map(({ id, musicUrl, imageUrl, frontType, backType }, index) => {
        const { originalStatus, grabbed } = getDiskStatus(id);
        const { translateX, translateY, moveRotateX, moveRotateY, scale } =
          calculateDiskMovement(id, index);
        return (
          <TestDisk
            key={id}
            isGrabbed={grabbed}
            onMouseDown={onGrabStart(id, index)}
            onMouseUp={onGrabEnd}
            onClick={onSelect(id)}
            translateX={translateX}
            translateY={translateY}
            scale={scale}
            moveRotateX={moveRotateX}
            moveRotateY={moveRotateY}
            isPlaying={originalStatus === "play"}
            isPreview={originalStatus === "preview"}
            musicUrl={musicUrl}
            imageUrl={imageUrl}
            frontType={frontType as DiskType["frontType"]}
            backType={backType as DiskType["backType"]}
          />
        );
      })}
    </div>
  );
}
