"use client";
import { CN, getLegend, getRandomNumber } from "@/app/_utils";
import GottaIcon from "@/app/_utils/icons/GottaIcon";
import HomeIcon from "@/app/_utils/icons/HomeIcon";
import SaveIcon from "@/app/_utils/icons/SaveIcon";
import SoundHandleIcon from "@/app/_utils/icons/SoundHandleIcon";
import Spinner from "@/app/_utils/icons/Spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "react-toastify";
import styles from "./GottaPokePage.module.css";
import PoketmonCard from "./PoketmonCard";

const GottaClientPokePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const isLove = params.get("love");
  const [cardInfo, setCardInfo] = useState<Poketmon[]>();
  const [seqnos, setSeqnos] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(false);

  const getPoke = async ({ isLove }: { isLove?: string }) => {
    if (isLoading) {
      toast.warning("이미 요청을 수행중입니다.");
      return;
    }
    try {
      const legendMode = isLove === "forever";
      setIsLoading(true);
      setCardInfo([]);
      setSeqnos([]);
      const result: Poketmon[] = [];
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
      toast.success("포켓몬이 왔습니다~");
      setCardInfo(result);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "포켓몬 데이터를 가져오는데 실패했습니다."
      );
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSave = async () => {
    if (!seqnos.length) return toast.warning("저장할 포켓몬을 선택해주세요");
    if (!cardInfo) return toast.error("포켓몬 정보가 없습니다");

    try {
      const selectedPokemons = cardInfo
        .filter((card) => seqnos.includes(card.id))
        .map((card) => ({
          pokemonId: card.id,
          thumbnailUrl: card.sprites.front_default,
        }));

      const response = await fetch("/api/pokemon/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pokemons: selectedPokemons }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "저장에 실패했습니다");
      }

      toast.success(`${selectedPokemons.length}개의 포켓몬이 저장되었습니다!`);
      setSeqnos([]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "포켓몬 저장에 실패했습니다."
      );
      console.error(error);
    }
  };
  return (
    <Suspense fallback={<Spinner loading={true} />}>
      <div className={CN([styles.contents, isLoading ? styles.loading : ""])}>
        <div className={styles.title}>
          <h1>{"포켓몬 자판기"}</h1>
        </div>
        <div className={styles.contentBox}>
          {isLoading ? (
            <Spinner loading={isLoading} />
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
    </Suspense>
  );
};

const isGetPokeResponse = (data: any): data is Poketmon => {
  return typeof data === "object" && typeof data.id === "number";
};

export default GottaClientPokePage;
