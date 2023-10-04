import styles from "./DiskFront.module.css";

type DiskFrontProps = {
  type?: string;
};

function DiskFront({ type = "classic" }: DiskFrontProps) {
  return (
    <div className={`${styles.container} ${styles[type] ?? ""}`}>
      <div className={styles.hologram} />
      <div className={styles.mainBackground} />
      <div className={styles.blendLayerSet}>
        <div className={`${styles.blendLayer} ${styles.blendBackground1}`} />
        <div className={`${styles.blendLayer} ${styles.blendBackground2}`} />
        <div className={`${styles.blendLayer} ${styles.blendBackground3}`} />
        <div className={`${styles.blendLayer} ${styles.blendBackground4}`} />
        <div className={`${styles.blendLayer} ${styles.blendBackground5}`} />
      </div>
      <div className={styles.holeLayer}>
        <div className={`${styles.hole} ${styles.hole1}`} />
        <div className={`${styles.hole} ${styles.hole2}`} />
      </div>
    </div>
  );
}

export default DiskFront;
