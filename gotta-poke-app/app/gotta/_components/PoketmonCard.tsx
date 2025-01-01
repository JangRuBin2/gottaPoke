"use client";

import { CN } from "@/app/_utils/CN";
import { PokeDetail } from "@/app/types/pokeDetail/pokeDetail";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import PokeDetailInfo from "./PokeDetailInfo";
import styles from "./PoketmonCard.module.css";
const PoketmonCard = ({
  poketmonInfo: poke,
  seqnos,
  setSeqnos,
  soundOn,
}: {
  poketmonInfo: PoketmonInfo;
  seqnos: number[];
  setSeqnos: Dispatch<SetStateAction<number[]>>;
  soundOn: boolean;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [detailPokeInfo, setIsDetailPokeInfo] = useState<PokeDetail>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const getPokeDetailInfo = async (id: number) => {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("포켓몬 정보를 확인할 수 없습니다.");
      const result = await response.json();
      if (!isGetPokeDetailInfo(result))
        throw new Error("올바르지 않은 반환값입니다.");
      console.log(result);
      setIsDetailOpen(true);
      setIsDetailPokeInfo(result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCheck = (id: number) => {
    setSeqnos((p) =>
      p.includes(id) ? p.filter((e) => e !== id && e !== -1) : [...p, id]
    );
  };

  const handlePlay = () => {
    if (!seqnos.includes(poke.id)) audioRef.current?.play();
  };

  return (
    <div
      className={CN([styles.cardContainer, !isOpen ? styles.disabled : ""])}
      onClick={handleOpen}
    >
      {isOpen ? (
        <>
          <div className={styles.title}>
            <span>{poke.name}</span>
          </div>
          <div
            className={styles.container}
            onClick={() => getPokeDetailInfo(poke.id)}
          >
            {soundOn && (
              <audio ref={audioRef} controls>
                <source
                  src={poke.cries.legacy || poke.cries.latest}
                  type="audio/ogg"
                />
              </audio>
            )}
            <span>
              <Image
                src={
                  seqnos.includes(poke.id)
                    ? poke.sprites.other.showdown.front_shiny
                    : poke.sprites.other.showdown.front_default ||
                      poke.sprites.front_default
                }
                fill
                sizes={"96px"}
                alt={`gottaPoke_${poke.name}`}
                style={{ objectFit: "contain" }}
              />
            </span>
          </div>
          <div className={styles.checkBox}>
            <input
              type="checkbox"
              checked={seqnos.includes(poke.id)}
              onClick={() => handlePlay()}
              onChange={() => handleCheck(poke.id)}
            />
          </div>
        </>
      ) : (
        <div></div>
      )}
      {isDetailOpen && detailPokeInfo && (
        <PokeDetailInfo
          pokeDetailInfo={detailPokeInfo}
          setIsDetailOpen={setIsDetailOpen}
        />
      )}
    </div>
  );
};
const isGetPokeDetailInfo = (data: any): data is PokeDetail => {
  return (
    typeof data === "object" &&
    Array.isArray(data.flavor_text_entries) &&
    typeof data.id === "number"
  );
};
export default PoketmonCard;
