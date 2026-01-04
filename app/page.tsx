import mainImage from "@/app/_utils/images/pngwing.png";
import Image from "next/image";
import Link from "next/link";
import LoverIcon from "./_utils/icons/LoverIcon";
import PokedexIcon from "./_utils/icons/PokedexIcon";
import styles from "./mainPage.module.css";

const MainPage = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image
            src={mainImage}
            fill
            alt={"gottaPoke_mainImage"}
            style={{ objectFit: "contain" }}
          />
        </div>
        <Link href={"/gotta"} className={styles.startButton}>
          {"시작하려면 화면을 눌러주세요."}
        </Link>
        <Link href={"/pokedex"} className={styles.pokedexLink}>
          <PokedexIcon className={styles.pokedex} />
        </Link>
        <Link href={"/lover"} className={styles.loverLink}>
          <LoverIcon className={styles.lover} />
        </Link>
      </div>
    </>
  );
};

export default MainPage;
