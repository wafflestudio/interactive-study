import ClipPath from "@/utils/ClipPath";
import styles from "./Preview.module.css";
import Disk from "@/components/disk-impl/Disk";

export default function Preview() {
  return (
    <main className={styles.main}>
      <Disk index={0} id={"1"} size={440} />
    </main>
  );
}
