"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LeftArrowIcon from "../_utils/icons/LeftArrowIcon";
import styles from "./LoverPage.module.css";
const LoverPage = () => {
  const router = useRouter();
  const answer = "장루빈최고";
  const [inputValue, setInputValue] = useState<string>("");
  const handleInput = (val: string) => {
    setInputValue(val);
  };
  const getAnswer = () => {
    if (inputValue !== answer) return alert("잘못된 접근입니다.");
    alert("호정아 생일축하해~ 사랑해");
    router.push(`/lover/${"forever"}`);
  };
  return (
    <div className={styles.container}>
      <div>
        <span>{"당신은 성호정입니까?"}</span>
        <input
          type="text"
          onChange={(e) => handleInput(e.target.value)}
          value={inputValue}
        />
        <button disabled={!inputValue.length} onClick={getAnswer}>
          {"제출"}
        </button>
      </div>
      <LeftArrowIcon
        className={styles.goBack}
        onClick={() => router.push("/")}
      />
    </div>
  );
};

export default LoverPage;
