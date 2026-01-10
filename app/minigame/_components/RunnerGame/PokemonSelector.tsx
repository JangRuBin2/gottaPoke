"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "@/app/_utils/icons/Spinner";
import styles from "./PokemonSelector.module.css";

interface PokemonData {
  pokemonId: number;
  thumbnailUrl: string;
  count: number;
  koreanName?: string;
}

interface PokemonSelectorProps {
  onSelect: (pokemonId: number, imageUrl: string) => void;
  selectedPokemonId: number | null;
}

export default function PokemonSelector({
  onSelect,
  selectedPokemonId,
}: PokemonSelectorProps) {
  const [pokemons, setPokemons] = useState<PokemonData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserPokemons();
  }, []);

  const fetchUserPokemons = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/pokemon/list");
      if (!response.ok) {
        throw new Error("포켓몬 목록을 가져오지 못했습니다");
      }
      const data = await response.json();
      setPokemons(data.pokemons || []);

      // 포켓몬이 하나도 없으면 첫 번째 포켓몬 자동 선택 불가능
      if (data.pokemons && data.pokemons.length === 0) {
        toast.info("먼저 포켓몬을 뽑아주세요!");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "포켓몬을 불러오는데 실패했습니다"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner loading={true} />
        <p>포켓몬을 불러오는 중...</p>
      </div>
    );
  }

  if (pokemons.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyText}>보유한 포켓몬이 없습니다</p>
        <p className={styles.emptySubtext}>
          먼저 포켓몬을 뽑아서 도감을 채워주세요!
        </p>
        <a href="/gotta" className={styles.gottaLink}>
          포켓몬 뽑으러 가기
        </a>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>플레이할 포켓몬을 선택하세요</h2>
      <div className={styles.grid}>
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.pokemonId}
            className={`${styles.pokemonCard} ${
              selectedPokemonId === pokemon.pokemonId ? styles.selected : ""
            }`}
            onClick={() => onSelect(pokemon.pokemonId, pokemon.thumbnailUrl)}
          >
            <div className={styles.imageWrapper}>
              <img
                src={pokemon.thumbnailUrl}
                alt={`Pokemon ${pokemon.pokemonId}`}
                className={styles.pokemonImage}
              />
            </div>
            <p className={styles.pokemonName}>
              {pokemon.koreanName || `No.${pokemon.pokemonId}`}
            </p>
            {pokemon.count > 1 && (
              <span className={styles.countBadge}>x{pokemon.count}</span>
            )}
            {selectedPokemonId === pokemon.pokemonId && (
              <div className={styles.checkmark}>✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
