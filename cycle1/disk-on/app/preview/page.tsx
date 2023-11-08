import styles from "./Preview.module.css";
import Disk from "@/components/disk-impl/Disk";

export default function Preview() {
  return (
    <main className={styles.main}>
      <Disk
        index={0}
        id={"1"}
        size={440}
        imageUrl="https://image.bugsm.co.kr/album/images/1000/40824/4082425.jpg"
        frontType="classic"
        backType="normal"
      />
    </main>
  );
}
