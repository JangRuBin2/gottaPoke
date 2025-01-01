"use client";

import { CN } from "@/app/_utils/CN";
import { PokeDetail } from "@/app/types/pokeDetail/pokeDetail";
import Image from "next/image";
import { useState } from "react";
import PokeDetailInfo from "./PokeDetailInfo";
import styles from "./PoketmonCard.module.css";
const PoketmonCard = ({
  poketmonInfo: poke,
}: {
  poketmonInfo: PoketmonInfo;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [detailPokeInfo, setIsDetailPokeInfo] = useState<PokeDetail>();
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
            <span>
              <Image
                src={
                  poke.sprites.other.showdown.front_default ||
                  poke.sprites.front_default
                }
                fill
                sizes={"96px"}
                alt={`gottaPoke_${poke.name}`}
                style={{ objectFit: "contain" }}
              ></Image>
            </span>
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
