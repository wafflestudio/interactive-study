import ClipPath from "@/utils/ClipPath";
import styles from "./page.module.css";
import Disk from "@/components/disk-impl/Disk";

export default function Home() {
  return (
    <main className={styles.main}>
      <Disk size={440} />
      <div style={{ width: 0, height: 0 }}>
        <ClipPath holeSize={13} />
        <ClipPath holeSize={16.94} />
        <ClipPath holeSize={18.86} />
        <ClipPath holeSize={25} />
      </div>
    </main>
  );
}
