"use client";

import { CN } from "@/app/_utils";
import backImage from "@/app/_utils/images/pocketmonBack.png";
import { PokeDetail } from "@/app/types/pokeDetail/pokeDetail";
import Image from "next/image";
import { useRef, useState } from "react";
import PokeDetailInfo from "./PokeDetailInfo";
import styles from "./PoketmonCard.module.css";
const PoketmonCard = ({
  poketmonInfo: poke,
  soundOn,
  cardIndex,
  openedCards,
  setOpenedCards,
}: {
  poketmonInfo: Poketmon;
  soundOn: boolean;
  cardIndex: number;
  openedCards: Set<number>;
  setOpenedCards: React.Dispatch<React.SetStateAction<Set<number>>>;
}) => {
  const isOpen = openedCards.has(cardIndex);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [detailPokeInfo, setIsDetailPokeInfo] = useState<PokeDetail>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      setOpenedCards(prev => new Set(prev).add(cardIndex));
    }
  };
  const getPokeDetailInfo = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
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

  const getRarityClass = () => {
    if (poke.is_mythical) return styles.mythical;
    if (poke.is_legendary) return styles.legendary;
    return "";
  };

  const getTypeBackground = () => {
    if (!poke.types || poke.types.length === 0) return undefined;

    const primaryType = poke.types[0].type.name;
    const typeColors: { [key: string]: string } = {
      normal: "linear-gradient(135deg, rgba(168, 168, 120, 0.3), rgba(168, 168, 120, 0.15))",
      fire: "linear-gradient(135deg, rgba(240, 128, 48, 0.4), rgba(255, 68, 34, 0.2))",
      water: "linear-gradient(135deg, rgba(104, 144, 240, 0.4), rgba(56, 163, 255, 0.2))",
      electric: "linear-gradient(135deg, rgba(248, 208, 48, 0.4), rgba(255, 204, 51, 0.2))",
      grass: "linear-gradient(135deg, rgba(120, 200, 80, 0.4), rgba(34, 197, 94, 0.2))",
      ice: "linear-gradient(135deg, rgba(152, 216, 216, 0.4), rgba(103, 232, 249, 0.2))",
      fighting: "linear-gradient(135deg, rgba(192, 48, 40, 0.4), rgba(220, 38, 38, 0.2))",
      poison: "linear-gradient(135deg, rgba(160, 64, 160, 0.4), rgba(168, 85, 247, 0.2))",
      ground: "linear-gradient(135deg, rgba(224, 192, 104, 0.4), rgba(217, 119, 6, 0.2))",
      flying: "linear-gradient(135deg, rgba(168, 144, 240, 0.4), rgba(147, 197, 253, 0.2))",
      psychic: "linear-gradient(135deg, rgba(248, 88, 136, 0.4), rgba(236, 72, 153, 0.2))",
      bug: "linear-gradient(135deg, rgba(168, 184, 32, 0.4), rgba(132, 204, 22, 0.2))",
      rock: "linear-gradient(135deg, rgba(184, 160, 56, 0.4), rgba(146, 64, 14, 0.2))",
      ghost: "linear-gradient(135deg, rgba(112, 88, 152, 0.4), rgba(139, 92, 246, 0.2))",
      dragon: "linear-gradient(135deg, rgba(112, 56, 248, 0.4), rgba(124, 58, 237, 0.2))",
      dark: "linear-gradient(135deg, rgba(112, 88, 72, 0.4), rgba(87, 83, 78, 0.2))",
      steel: "linear-gradient(135deg, rgba(184, 184, 208, 0.4), rgba(148, 163, 184, 0.2))",
      fairy: "linear-gradient(135deg, rgba(238, 153, 172, 0.4), rgba(249, 168, 212, 0.2))",
    };

    return typeColors[primaryType] || undefined;
  };

  const typeBackground = getTypeBackground();

  return (
    <div
      style={
        !isOpen
          ? {
              backgroundImage: `url(${backImage.src || backImage})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }
          : typeBackground
          ? {
              backgroundImage: typeBackground,
            }
          : undefined
      }
      className={CN([
        styles.cardContainer,
        !isOpen ? styles.cardBack : "",
        isOpen ? getRarityClass() : ""
      ])}
      onClick={handleOpen}
    >
      {isOpen ? (
        <>
          <div className={styles.title}>
            <span>{poke.name}</span>
          </div>
          <div
            className={styles.container}
            onClick={(e) => getPokeDetailInfo(e, poke.id)}
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
                  poke.sprites.other.showdown.front_default ||
                  poke.sprites.front_default
                }
                unoptimized
                fill
                sizes={"96px"}
                alt={`gottaPoke_${poke.name}`}
                style={{ objectFit: "contain" }}
              />
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
