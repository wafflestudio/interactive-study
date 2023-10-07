import styles from "./DiskBack.module.css";

type DiskBackProps = {
  type?: "normal" | "dim" | "bright";
};

function DiskBack({ type = "normal" }: DiskBackProps) {
  return (
    <div className={styles.container}>
      <div className={styles.mainLayer}>
        <div className={styles.hologram} />
        <div className={styles.opaque} />
        <div className={styles.hologram} />
      </div>
      <div className={styles.holeLayer}>
        <div className={`${styles.hole} ${styles.hole1}`} />
        <div className={`${styles.hole} ${styles.hole2}`} />
      </div>
    </div>
  );
}

export default DiskBack;
