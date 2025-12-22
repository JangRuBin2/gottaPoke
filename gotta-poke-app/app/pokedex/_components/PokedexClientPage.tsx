"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HomeIcon from "@/app/_utils/icons/HomeIcon";
import Spinner from "@/app/_utils/icons/Spinner";
import PokemonCard from "./PokemonCard";
import styles from "./PokedexPage.module.css";

type PokemonData = {
  pokemonId: number;
  thumbnailUrl: string;
  count: number;
};

const PokedexClientPage = () => {
  const router = useRouter();
  const [pokemons, setPokemons] = useState<PokemonData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/pokemon/list");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "포켓몬 조회에 실패했습니다");
      }

      setPokemons(data.data);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "포켓몬 조회에 실패했습니다."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>포켓몬 도감</h1>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spinner loading={loading} />
        </div>
      ) : pokemons.length === 0 ? (
        <div className={styles.emptyContainer}>
          <p>저장된 포켓몬이 없습니다</p>
        </div>
      ) : (
        <div className={styles.gridContainer}>
          {pokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.pokemonId}
              pokemonId={pokemon.pokemonId}
              thumbnailUrl={pokemon.thumbnailUrl}
              count={pokemon.count}
            />
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <button onClick={() => router.push("/")} className={styles.homeBtn}>
          <HomeIcon />
        </button>
      </div>
    </div>
  );
};

export default PokedexClientPage;
