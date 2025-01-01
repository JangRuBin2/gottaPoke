import mainImage from "@/app/_utils/images/pngwing.png";
import Image from "next/image";
import styles from "./mainPage.module.css";
const MainPage = () => {
  return (
    <>
      <div className={styles.container}>
        <span>
          <Image
            src={mainImage}
            fill
            alt={"gottaPoke_mainImage"}
            style={{ objectFit: "contain" }}
          />
        </span>
      </div>
    </>
  );
};

export default MainPage;
