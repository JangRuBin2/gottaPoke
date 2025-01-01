"use client";

import { useState } from "react";
import { delay } from "../_utils/delay";
import styles from "./GottaPokePage.module.css";
import PoketmonCard from "./_components/PoketmonCard";
const isGetPokeResponse = (data: any): data is PoketmonInfo => {
  return typeof data === "object" && typeof data.id === "number";
};
const GottaPokePage = () => {
  const [cardInfo, setCardInfo] = useState<PoketmonInfo[]>();
  const [seqnos, setSeqnos] = useState<number[]>([]);

  const getPoke = async () => {
    try {
      setCardInfo([]);
      await delay(300);
      const result: PoketmonInfo[] = [];
      for (let i = 0; i < 6; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${getRandomNumber()}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok)
          throw new Error("포켓몬 데이터를 가져오는데 실패했습니다.");
        if (!isGetPokeResponse(data))
          throw new Error("올바르지 않은 반환값입니다.");
        result.push(data);
      }
      console.log("result:", result);
      alert("포켓몬이 왔습니다~");
      setCardInfo(result);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "포켓몬 데이터를 가져오는데 실패했습니다."
      );
      console.log(error);
    }
  };
  const handleSave = () => {
    console.log(seqnos);
  };
  return (
    <div className={styles.contents}>
      <div className={styles.title}>
        <h3>{"포켓몬 자판기"}</h3>
        <button onClick={getPoke}>{"뽑기"}</button>
      </div>
      <div className={styles.contentBox}>
        {cardInfo?.length && (
          <>
            {cardInfo.map((card, idx) => (
              <PoketmonCard
                key={idx}
                poketmonInfo={card}
                seqnos={seqnos}
                setSeqnos={setSeqnos}
              ></PoketmonCard>
            ))}
          </>
        )}
      </div>
      {cardInfo?.length && (
        <button
          className={styles.save}
          onClick={handleSave}
          disabled={!seqnos.length}
        >
          {"저장"}
        </button>
      )}
    </div>
  );
};
const getRandomNumber = () => Math.floor(Math.random() * 1025) + 1;
export default GottaPokePage;
