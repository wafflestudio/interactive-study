import styles from "./Disk.module.css";

type DiskProps = {
  size?: number;
};

function Disk({ size = 220 }: DiskProps) {
  const cdSize220 = size;
  const cdSize216 = (size * 216) / 220;

  return (
    <div
      className={styles.scene}
      style={{
        width: cdSize220,
        height: cdSize220,
        perspective: "1000px",
      }}
    >
      <svg>
        <defs>
          <clipPath
            id="cd"
            clipPathUnits="objectBoundingBox"
            clipRule="evenodd"
          >
            <path
              d="
              M1 0.5
              A0.5 0.5 0 0 1 0.5 1
              A0.5 0.5 0 0 1 0 0.5
              A0.5 0.5 0 0 1 0.5 0
              A0.5 0.5 0 0 1 1 0.5
              L0.565 0.5
              A0.065 0.065 0 0 1 0.5 0.565
              A0.065 0.065 0 0 1 0.435 0.5
              A0.065 0.065 0 0 1 0.5 0.435
              A0.065 0.065 0 0 1 0.565 0.5
              Z"
            />
          </clipPath>
        </defs>
      </svg>

      <div className={styles.disk}>
        <div className={styles.front}></div>
        <div className={styles.back}>
          <div className={styles.back_hologram}></div>
        </div>
      </div>
    </div>
  );
}

export default Disk;
