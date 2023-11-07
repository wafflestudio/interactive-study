"use client";

import Player from "@/components/Player/Player";
import styles from "./page.module.css";
import Disk from "@/components/disk-impl/Disk";
import disks from "@/data/disks.json";
import useInteractionStore from "@/hooks/useInteractionStore";
import { Disk as DiskType } from "@/types/spring/disk";
import { DISK_SIZE } from "@/physics/constants";

export default function Home() {
  const onGrabMove = useInteractionStore((state) => state.onGrabMove);
  const onMouseUp = useInteractionStore((state) => state.onMouseUp);
  const onEmit = useInteractionStore((state) => state.onEmit);
  const grabbedDiskId = useInteractionStore((state) => state.grabbedDiskId);
  const playingDiskId = useInteractionStore((state) => state.playingDiskId);

  return (
    <main
      className={styles.main}
      onMouseMove={(e) => {
        if (!grabbedDiskId) return;
        onGrabMove({ x: e.clientX, y: e.clientY });
      }}
      onMouseUp={onMouseUp}
    >
      <Player
        isPlaying={!!playingDiskId}
        src={disks.find(({ id }) => id === playingDiskId)?.musicUrl || null}
        onEmit={onEmit}
      />
      {disks.map(({ id, imageUrl, frontType, backType }, index) => (
        <Disk
          key={id}
          id={id}
          index={index}
          size={DISK_SIZE}
          imageUrl={imageUrl}
          frontType={frontType as DiskType["frontType"]}
          backType={backType as DiskType["backType"]}
        />
      ))}
    </main>
  );
}
