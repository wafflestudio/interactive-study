'use client';

import Disk, { DiskProps } from '@/components/Disk/Disk';
import Player from '@/components/Player/Player';
import disks from '@/data/disks.json';
import useInteractionStore from '@/hooks/useInteractionStore';
import { basePath } from '@/next.config';
import { DISK_SIZE } from '@/physics/constants';

import styles from './page.module.css';

export default function Home() {
  const onGrabMove = useInteractionStore((state) => state.onGrabMove);
  const onMouseUp = useInteractionStore((state) => state.onMouseUp);
  const onEmit = useInteractionStore((state) => state.onEmit);
  const grabbedDiskId = useInteractionStore((state) => state.grabbedDiskId);
  const playingDiskId = useInteractionStore((state) => state.playingDiskId);

  const musicUrl =
    basePath +
    '/' +
    (disks.find(({ id }) => id === playingDiskId)?.musicUrl || 'musics/1.mp3');

  return (
    <main
      className={styles.main}
      // style={{ background: "url('mosaic.png') repeat #463c29" }}
      onMouseMove={(e) => {
        if (!grabbedDiskId) return;
        onGrabMove({ x: e.clientX, y: e.clientY });
      }}
      onMouseUp={onMouseUp}
    >
      <Player isPlaying={!!playingDiskId} src={musicUrl} onEmit={onEmit} />
      {disks.map(({ id, imageUrl, frontType, backType }, index) => (
        <Disk
          key={id}
          id={id}
          index={index}
          size={DISK_SIZE}
          imageUrl={imageUrl}
          frontType={frontType as DiskProps['frontType']}
          backType={backType as DiskProps['backType']}
        />
      ))}
    </main>
  );
}
