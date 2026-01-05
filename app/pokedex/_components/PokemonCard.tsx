"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./PokemonCard.module.css";

type PokemonCardProps = {
  pokemonId: number;
  thumbnailUrl: string;
  count: number;
};

const PokemonCard = ({ pokemonId, thumbnailUrl, count }: PokemonCardProps) => {
  const [rarity, setRarity] = useState<"mythical" | "legendary" | null>(null);

  useEffect(() => {
    const fetchRarity = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.is_mythical) {
            setRarity("mythical");
          } else if (data.is_legendary) {
            setRarity("legendary");
          }
        }
      } catch (error) {
        console.error("Failed to fetch rarity:", error);
      }
    };

    fetchRarity();
  }, [pokemonId]);

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
        <span className={styles.pokemonId}>No. {pokemonId}</span>
        {count > 1 && (
          <span className={styles.count}>{count}장 보유</span>
        )}
        {rarity && (
          <span className={styles.rarityBadge}>
            {rarity === "mythical" ? "환상" : "전설"}
          </span>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
