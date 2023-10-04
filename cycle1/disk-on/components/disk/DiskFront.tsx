import styles from "./DiskFront.module.css";

type DiskFrontProps = {
  type?: string;
};

function DiskFront({ type = "classic" }: DiskFrontProps) {
  return (
    <div className={`${styles.container} ${styles[type] ?? ""}`}>
      <div className={styles.mainLayer}>
        <div className={styles.hologram} />
        <div className={styles.opaque} />
      </div>
      <div className={styles.blendLayer}>
        <div className={`${styles.blend} ${styles.blend1}`} />
        <div className={`${styles.blend} ${styles.blend2}`} />
        <div className={`${styles.blend} ${styles.blend3}`} />
        <div className={`${styles.blend} ${styles.blend4}`} />
        <div className={`${styles.blend} ${styles.blend5}`} />
      </div>
      <div className={styles.holeLayer}>
        <div className={`${styles.hole} ${styles.hole1}`} />
        <div className={`${styles.hole} ${styles.hole2}`} />
      </div>
    </div>
  );
}

export default DiskFront;
