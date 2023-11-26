import classNames from 'classnames/bind';
import { MouseEventHandler, useEffect, useMemo, useRef } from 'react';

import styles from './Player.module.css';

const cx = classNames.bind(styles);

type PlayerProps = {
  isPlaying: boolean;
  src: string | null;
  onEmit: MouseEventHandler;
};

export default function Player({ isPlaying, src, onEmit }: PlayerProps) {
  const diskSoundRef = useRef<HTMLAudioElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (!diskSoundRef.current) return;
    if (!musicRef.current) return;
    if (isPlaying) {
      diskSoundRef.current.play();
      setTimeout(() => {
        if (musicRef.current) {
          musicRef.current.play();
        }
      }, 15000);
      setTimeout(() => {
        if (diskSoundRef.current) {
          diskSoundRef.current.pause();
          diskSoundRef.current.currentTime = 0;
        }
      }, 20000);
    } else {
      diskSoundRef.current.pause();
      diskSoundRef.current.currentTime = 0;
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
  }, [src, isPlaying, diskSoundRef, musicRef]);
  return (
    <div className={cx('wrapper', { playing: isPlaying })}>
      <div className={cx('images')}>
        <img
          className={cx('button')}
          src="Player_button.png"
          onClick={(e) => {
            onEmit(e);
          }}
        />
        <img className={cx('base')} src="/Player_base.png" />
      </div>
      {/* {src && (
        <iframe
          className={cx("youtube")}
          width="550"
          height="50"
          src="https://www.youtube.com/embed/Km71Rr9K-Bw?si=0rX6J7Zlu9wadWfL"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      )} */}
      {isPlaying && <audio ref={diskSoundRef} src="musics/disk.mp3" />}
      {isPlaying && src && <audio ref={musicRef} src={src} />}
    </div>
  );
}
