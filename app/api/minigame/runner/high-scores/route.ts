import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  try {
    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 최고 점수 조회 (상위 10개)
    const highScores = await prisma.gameScore.findMany({
      where: {
        userId: user.id,
        gameType: "runner",
      },
      orderBy: {
        score: "desc",
      },
      take: 10,
      select: {
        id: true,
        selectedPokemonId: true,
        score: true,
        distance: true,
        obstaclesPassed: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      highScores,
    });
  } catch (error) {
    console.error("최고 점수 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: "최고 점수 조회에 실패했습니다" },
      { status: 500 }
    );
  }
};
