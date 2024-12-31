"use client";

import { useState } from "react";
import { delay } from "../_utils/delay";
import PoketmonCard from "./PoketmonCard";

const isGetPokeResponse = (data: any): data is PoketmonInfo => {
  return typeof data === "object" && typeof data.id === "number";
};
const GottaPokePage = () => {
  const [cardInfo, setCardInfo] = useState<PoketmonInfo[]>();
  const getPoke = async () => {
    try {
      await delay(300);
      const result: PoketmonInfo[] = [];
      for (let i = 0; i < 5; i++) {
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
  return (
    <div>
      <h3>{"포켓몬 자판기"}</h3>
      <button onClick={getPoke}>{"뽑기"}</button>
      {cardInfo?.length && (
        <>
          {cardInfo.map((card, idx) => (
            <PoketmonCard key={idx} poketmonInfo={card}></PoketmonCard>
          ))}
        </>
      )}
    </div>
  );
};
const getRandomNumber = () => Math.floor(Math.random() * 1062) + 1;
export default GottaPokePage;
