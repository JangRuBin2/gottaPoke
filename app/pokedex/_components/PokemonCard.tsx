"use client";
import Image from "next/image";
import styles from "./PokemonCard.module.css";

type PokemonCardProps = {
  pokemonId: number;
  thumbnailUrl: string;
  count: number;
};

const PokemonCard = ({ pokemonId, thumbnailUrl, count }: PokemonCardProps) => {
  return (
    <div className={styles.cardContainer}>
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
      </div>
    </div>
  );
};

export default PokemonCard;
