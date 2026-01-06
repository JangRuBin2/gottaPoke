"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./PokemonCard.module.css";

type PokemonCardProps = {
  pokemonId: number;
  thumbnailUrl: string;
  count: number;
  koreanName: string;
  rarity: "mythical" | "legendary" | "normal";
};

const PokemonCard = ({ pokemonId, thumbnailUrl, count, koreanName, rarity }: PokemonCardProps) => {

  const getRarityClass = () => {
    if (rarity === "mythical") return styles.mythical;
    if (rarity === "legendary") return styles.legendary;
    return "";
  };

  return (
    <div className={`${styles.cardContainer} ${getRarityClass()}`}>
      <div className={styles.imageContainer}>
        <Image
          src={thumbnailUrl}
          unoptimized
          fill
          sizes="150px"
          alt={`pokemon_${pokemonId}`}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className={styles.info}>
        <span className={styles.koreanName}>{koreanName}</span>
        <span className={styles.pokemonId}>No. {pokemonId}</span>
        {count > 1 && (
          <span className={styles.count}>{count}장 보유</span>
        )}
        {rarity !== "normal" && (
          <span className={styles.rarityBadge}>
            {rarity === "mythical" ? "환상" : "전설"}
          </span>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
