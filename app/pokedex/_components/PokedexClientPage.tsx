"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import HomeIcon from "@/app/_utils/icons/HomeIcon";
import Spinner from "@/app/_utils/icons/Spinner";
import PokemonCard from "./PokemonCard";
import styles from "./PokedexPage.module.css";

type PokemonData = {
  pokemonId: number;
  thumbnailUrl: string;
  count: number;
};

type ExtendedPokemonData = PokemonData & {
  koreanName: string;
  rarity: 'mythical' | 'legendary' | 'normal';
};

const PokedexClientPage = () => {
  const router = useRouter();
  const [pokemons, setPokemons] = useState<ExtendedPokemonData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'rarity'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchExtendedData = async (pokemonList: PokemonData[]): Promise<ExtendedPokemonData[]> => {
    const promises = pokemonList.map(async (pokemon) => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.pokemonId}`);
        if (!response.ok) throw new Error('Failed to fetch species data');

        const data = await response.json();
        const koreanName = data.names?.find((n: any) => n.language.name === 'ko')?.name || `포켓몬 ${pokemon.pokemonId}`;
        const rarity: 'mythical' | 'legendary' | 'normal' = data.is_mythical ? 'mythical' : data.is_legendary ? 'legendary' : 'normal';

        return {
          ...pokemon,
          koreanName,
          rarity
        };
      } catch (error) {
        console.error(`Failed to fetch extended data for ${pokemon.pokemonId}:`, error);
        return {
          ...pokemon,
          koreanName: `포켓몬 ${pokemon.pokemonId}`,
          rarity: 'normal' as const
        };
      }
    });

    return await Promise.all(promises);
  };

  const fetchPokemons = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/pokemon/list");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "포켓몬 조회에 실패했습니다");
      }

      const extendedData = await fetchExtendedData(data.data);
      setPokemons(extendedData);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "포켓몬 조회에 실패했습니다."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 정렬 버튼 클릭 핸들러
  const handleSortChange = (newSortBy: 'date' | 'name' | 'rarity') => {
    if (sortBy === newSortBy) {
      // 같은 정렬이면 순서 토글
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 다른 정렬이면 정렬 방식 변경 (기본값은 desc)
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // 정렬 및 검색 로직
  const getFilteredAndSortedPokemons = () => {
    let result = [...pokemons];

    // 검색 필터링
    if (searchTerm.trim()) {
      result = result.filter(pokemon =>
        pokemon.koreanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.pokemonId.toString().includes(searchTerm)
      );
    }

    // 정렬
    switch (sortBy) {
      case 'rarity':
        result.sort((a, b) => {
          const rarityOrder = { mythical: 0, legendary: 1, normal: 2 };
          const diff = rarityOrder[a.rarity] - rarityOrder[b.rarity];
          return sortOrder === 'asc' ? diff : -diff;
        });
        break;
      case 'name':
        result.sort((a, b) => {
          const diff = a.koreanName.localeCompare(b.koreanName, 'ko');
          return sortOrder === 'asc' ? diff : -diff;
        });
        break;
      case 'date':
      default:
        // 이미 API에서 최신순으로 정렬되어 있음 (desc)
        if (sortOrder === 'asc') {
          result.reverse();
        }
        break;
    }

    return result;
  };

  const filteredPokemons = getFilteredAndSortedPokemons();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>포켓몬 도감</h1>
      </div>

      {!loading && (
        <>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="포켓몬 이름 또는 번호로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.sortContainer}>
            <button
              className={`${styles.sortBtn} ${sortBy === 'date' ? styles.active : ''}`}
              onClick={() => handleSortChange('date')}
            >
              최신순 {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`${styles.sortBtn} ${sortBy === 'name' ? styles.active : ''}`}
              onClick={() => handleSortChange('name')}
            >
              가나다순 {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`${styles.sortBtn} ${sortBy === 'rarity' ? styles.active : ''}`}
              onClick={() => handleSortChange('rarity')}
            >
              희귀도순 {sortBy === 'rarity' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>

          {filteredPokemons.length > 0 && (
            <div className={styles.resultCount}>
              {filteredPokemons.length}마리의 포켓몬
            </div>
          )}
        </>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spinner loading={loading} />
        </div>
      ) : pokemons.length === 0 ? (
        <div className={styles.emptyContainer}>
          <p>저장된 포켓몬이 없습니다</p>
        </div>
      ) : filteredPokemons.length === 0 ? (
        <div className={styles.emptyContainer}>
          <p>검색 결과가 없습니다</p>
        </div>
      ) : (
        <div className={styles.gridContainer}>
          {filteredPokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.pokemonId}
              pokemonId={pokemon.pokemonId}
              thumbnailUrl={pokemon.thumbnailUrl}
              count={pokemon.count}
              koreanName={pokemon.koreanName}
              rarity={pokemon.rarity}
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
