import KakaoLogin from "./_components/KakaoLogin";
import styles from "./LoginPage.module.css";
const page = () => {
  return (
    <div className={styles.container}>
      <h3>{"로그인"}</h3>
      <KakaoLogin styles={styles} />
    </div>
  );
};

export default page;
