import Image from "next/image";
import styles from "./page.module.scss";
import vars from "./vars.module.scss";

export default function Page() {
  return (
    <main>
      <h1 className={styles.title}>03-next-styleAndAssets</h1>
      <div className={styles.block}>scss :export primaryColor: {vars.primaryColor}</div>

      <div className={styles.block}>
        <div>public image:</div>
        <Image src="/next.svg" alt="Next" width={120} height={24} priority />
      </div>
    </main>
  );
}
