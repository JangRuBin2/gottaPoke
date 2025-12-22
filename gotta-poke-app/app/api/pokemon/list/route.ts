import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async () => {
  try {
    const pokemons = await prisma.pokemon.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const pokemonMap = new Map();

    pokemons.forEach((pokemon) => {
      const existing = pokemonMap.get(pokemon.pokemonId);
      if (existing) {
        existing.count += 1;
      } else {
        pokemonMap.set(pokemon.pokemonId, {
          pokemonId: pokemon.pokemonId,
          thumbnailUrl: pokemon.thumbnailUrl,
          count: 1,
        });
      }
    });

    const uniquePokemons = Array.from(pokemonMap.values());

    return NextResponse.json({
      success: true,
      data: uniquePokemons,
    });
  } catch (error) {
    console.error("포켓몬 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: "포켓몬 조회에 실패했습니다." },
      { status: 500 }
    );
  }
};
