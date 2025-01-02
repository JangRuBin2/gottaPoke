"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CN } from "../_utils/CN";
import { delay } from "../_utils/delay";
import GottaIcon from "../_utils/icons/GottaIcon";
import HomeIcon from "../_utils/icons/HomeIcon";
import SaveIcon from "../_utils/icons/SaveIcon";
import SoundHandleIcon from "../_utils/icons/SoundHandleIcon";
import Spinner from "../_utils/icons/Spinner";
import styles from "./GottaPokePage.module.css";
import PoketmonCard from "./_components/PoketmonCard";
const isGetPokeResponse = (data: any): data is PoketmonInfo => {
  return typeof data === "object" && typeof data.id === "number";
};
const GottaPokePage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const isLove = params.get("love");
  const [cardInfo, setCardInfo] = useState<PoketmonInfo[]>();
  const [seqnos, setSeqnos] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(false);
  const getPoke = async ({ isLove }: { isLove?: string }) => {
    try {
      const legendMode = isLove === "forever";
      setLoading(true);
      setCardInfo([]);
      setSeqnos([]);
      await delay(300);
      const result: PoketmonInfo[] = [];
      for (let i = 0; i < 6; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${
          legendMode ? getLegend() : getRandomNumber()
        }`;
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
    if (!seqnos.length) return alert("저장할 포켓몬을 선택해주세요");
    console.log(seqnos);
    alert("준비중입니다!");
  };
  return (
    <div className={CN([styles.contents, loading ? styles.loading : ""])}>
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
              soundOn={soundOn}
              poketmonInfo={card}
              seqnos={seqnos}
              setSeqnos={setSeqnos}
            />
          ))
        )}
      </div>
      <div className={styles.handler}>
        <div className={styles.getCard}>
          <button
            className={CN([styles.gotta, !isLove ? styles.onlyGotta : ""])}
            onClick={() => getPoke({})}
          >
            {"뽑기"}
          </button>
          {isLove && (
            <button onClick={() => getPoke({ isLove })}>
              <GottaIcon />
            </button>
          )}
        </div>
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
          <button>
            <SoundHandleIcon soundOn={soundOn} setSoundOn={setSoundOn} />
          </button>
        </div>
      </div>
    </div>
  );
};
const getLegend = () => {
  const legendArray: number[] = [
    6, 9, 37, 38, 58, 25, 133, 104, 105, 132, 134, 135, 136, 144, 149, 150, 151,
    147, 148, 149, 172, 196, 197, 216, 258, 393, 394, 395, 470, 471, 501, 502,
    700, 778,
  ];
  const randomIndex = Math.floor(Math.random() * legendArray.length);
  return legendArray[randomIndex];
};
const getRandomNumber = () => Math.floor(Math.random() * 1025) + 1;
export default GottaPokePage;
