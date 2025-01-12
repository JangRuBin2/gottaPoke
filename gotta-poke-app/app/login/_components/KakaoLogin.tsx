"use client";
import kakaoLoginImg from "@/app/_utils/images/kakao_login.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
const KakaoLogin = ({ styles }: { styles: Styles }) => {
  const router = useRouter();
  const handleLogin = async () => {
    try {
      const response = await fetch("/api/v1/login/social/kakao");
      const result = await response.json();
      if (!response || !result) throw new Error();
      router.push(result);
    } catch (error) {
      console.log(error);
      alert("로그인에 실패했습니다.");
    }
  };
  return (
    <button className={styles.button} onClick={handleLogin}>
      <span className={styles.login}>
        <Image src={kakaoLoginImg} fill alt={"kakoLogin"} />
      </span>
    </button>
  );
};

export default KakaoLogin;
