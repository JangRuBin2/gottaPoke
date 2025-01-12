import kakaoLoginImg from "@/app/_utils/images/kakao_login.png";
import Image from "next/image";
const KakaoLogin = ({ styles }: { styles: Styles }) => {
  return (
    <button className={styles.button}>
      <span className={styles.login}>
        <Image src={kakaoLoginImg} fill alt={"kakoLogin"} />
      </span>
    </button>
  );
};

export default KakaoLogin;
