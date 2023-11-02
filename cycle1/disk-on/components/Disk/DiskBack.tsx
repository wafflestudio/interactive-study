import styles from "./DiskBack.module.css";

type DiskBackProps = {
  type?: "normal" | "dim" | "bright";
};

function DiskBack({ type = "normal" }: DiskBackProps) {
  return (
    <div className={styles.container}>
      <img className={styles.basePlate} src="/base-plate.png" />
      {/* <div className={styles.blendLayer}> */}
      <div className={styles.hologram + " " + styles.hologram1} />
      <div className={styles.hologram + " " + styles.hologram2} />
      <div className={styles.hologram + " " + styles.hologram3} />
      {/* </div> */}
    </div>
  );
}

export default DiskBack;
