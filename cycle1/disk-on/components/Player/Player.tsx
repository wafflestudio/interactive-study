import classNames from "classnames/bind";
import styles from "./Player.module.css";
import { MouseEventHandler } from "react";

const cx = classNames.bind(styles);

type PlayerProps = {
  isPlaying: boolean;
  src: string | null;
  onEmit: MouseEventHandler;
};

export default function Player({ isPlaying, src, onEmit }: PlayerProps) {
  return (
    <div className={cx("wrapper", { playing: isPlaying })}>
      <div className={cx("images")}>
        <img
          className={cx("button")}
          src="Player_button.png"
          onClick={(e) => {
            onEmit(e);
          }}
        />
        <img className={cx("base")} src="/Player_base.png" />
      </div>
      {src && (
        <iframe
          className={cx("youtube")}
          width="550"
          height="50"
          src="https://www.youtube.com/embed/Km71Rr9K-Bw?si=0rX6J7Zlu9wadWfL"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      )}
    </div>
  );
}
