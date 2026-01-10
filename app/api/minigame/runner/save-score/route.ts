import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { selectedPokemonId, score, distance, obstaclesPassed } = body;

    // 유효성 검사
    if (!selectedPokemonId || score === undefined || distance === undefined || obstaclesPassed === undefined) {
      return NextResponse.json(
        { error: "필수 데이터가 누락되었습니다" },
        { status: 400 }
      );
    }

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

    // 점수 저장
    const gameScore = await prisma.gameScore.create({
      data: {
        userId: user.id,
        gameType: "runner",
        selectedPokemonId,
        score,
        distance,
        obstaclesPassed,
      },
    });

    // 최고 점수 확인
    const highScores = await prisma.gameScore.findMany({
      where: {
        userId: user.id,
        gameType: "runner",
      },
      orderBy: {
        score: "desc",
      },
      take: 1,
    });

    const isNewHighScore = highScores.length > 0 && highScores[0].id === gameScore.id;

    // 사용자 순위 계산
    const higherScores = await prisma.gameScore.count({
      where: {
        userId: user.id,
        gameType: "runner",
        score: {
          gt: score,
        },
      },
    });

    const rank = higherScores + 1;

    return NextResponse.json({
      success: true,
      isNewHighScore,
      rank,
      score: gameScore.score,
    });
  } catch (error) {
    console.error("점수 저장 중 오류 발생:", error);
    return NextResponse.json(
      { error: "점수 저장에 실패했습니다" },
      { status: 500 }
    );
  }
};
