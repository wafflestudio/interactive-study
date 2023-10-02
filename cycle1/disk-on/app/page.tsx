import styles from "./page.module.css";
import Disk from "@/components/disk/Disk";

export default function Home() {
  return (
    <main className={styles.main}>
      <Disk size={440} />
    </main>
  );
}
