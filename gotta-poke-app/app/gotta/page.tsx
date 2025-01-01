"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { delay } from "../_utils/delay";
import GottaIcon from "../_utils/icons/GottaIcon";
import HomeIcon from "../_utils/icons/HomeIcon";
import SaveIcon from "../_utils/icons/SaveIcon";
import Spinner from "../_utils/icons/Spinner";
import styles from "./GottaPokePage.module.css";
import PoketmonCard from "./_components/PoketmonCard";
const isGetPokeResponse = (data: any): data is PoketmonInfo => {
  return typeof data === "object" && typeof data.id === "number";
};
const GottaPokePage = () => {
  const router = useRouter();
  const [cardInfo, setCardInfo] = useState<PoketmonInfo[]>();
  const [seqnos, setSeqnos] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const getPoke = async () => {
    try {
      setLoading(true);
      setCardInfo([]);
      setSeqnos([]);
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
    } finally {
      setLoading(false);
    }
  };
  const handleSave = () => {
    console.log(seqnos);
  };
  return (
    <div className={styles.contents}>
      <div className={styles.title}>
        <h1>{"포켓몬 자판기"}</h1>
      </div>
      <div className={styles.contentBox}>
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          cardInfo?.map((card, idx) => (
            <PoketmonCard
              key={idx}
              poketmonInfo={card}
              seqnos={seqnos}
              setSeqnos={setSeqnos}
            />
          ))
        )}
      </div>
      <div className={styles.handler}>
        <button className={styles.gotta} onClick={getPoke}>
          <GottaIcon />
        </button>
        <div className={styles.save}>
          {cardInfo?.length ? (
            <>
              <button onClick={handleSave} disabled={!seqnos.length}>
                <SaveIcon />
              </button>
            </>
          ) : (
            <Spinner loading={!!cardInfo?.length} />
          )}
          <button onClick={() => router.push("/")}>
            <HomeIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
const getRandomNumber = () => Math.floor(Math.random() * 1025) + 1;
export default GottaPokePage;
