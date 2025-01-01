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
        <p>{"시작하려면 화면을 눌러주세요."}</p>
      </div>
    </>
  );
};

export default MainPage;
