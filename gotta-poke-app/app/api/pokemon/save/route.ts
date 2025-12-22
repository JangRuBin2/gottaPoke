import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { pokemons } = body;

    if (!pokemons || !Array.isArray(pokemons)) {
      return NextResponse.json(
        { error: "포켓몬 데이터가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    const savedPokemons = await Promise.all(
      pokemons.map((pokemon) =>
        prisma.pokemon.create({
          data: {
            pokemonId: pokemon.pokemonId,
            thumbnailUrl: pokemon.thumbnailUrl,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      data: savedPokemons,
    });
  } catch (error) {
    console.error("포켓몬 저장 중 오류 발생:", error);
    return NextResponse.json(
      { error: "포켓몬 저장에 실패했습니다." },
      { status: 500 }
    );
  }
};
