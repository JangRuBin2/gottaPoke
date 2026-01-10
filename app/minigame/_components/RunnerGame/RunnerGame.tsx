"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import PokemonSelector from "./PokemonSelector";
import { useRunnerGame, GAME_CONFIG, ObstacleType } from "./useRunnerGame";
import styles from "./RunnerGame.module.css";

export default function RunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(
    null
  );
  const [selectedPokemonImage, setSelectedPokemonImage] = useState<
    string | null
  >(null);
  const [pokemonImg, setPokemonImg] = useState<HTMLImageElement | null>(null);
  const [highScore, setHighScore] = useState<number>(0);
  const [isSavingScore, setIsSavingScore] = useState(false);

  const {
    gameState,
    playerY,
    obstacles,
    gameData,
    startGame,
    togglePause,
    restartGame,
    backToMenu,
    jump,
  } = useRunnerGame();

  // 포켓몬 이미지 로드
  useEffect(() => {
    if (selectedPokemonImage) {
      const img = new Image();
      img.src = selectedPokemonImage;
      img.onload = () => setPokemonImg(img);
    }
  }, [selectedPokemonImage]);

  // 최고 점수 불러오기
  useEffect(() => {
    fetchHighScore();
  }, []);

  const fetchHighScore = async () => {
    try {
      const response = await fetch("/api/minigame/runner/high-scores");
      if (response.ok) {
        const data = await response.json();
        if (data.highScores && data.highScores.length > 0) {
          setHighScore(data.highScores[0].score);
        }
      }
    } catch (error) {
      console.error("Failed to fetch high score:", error);
    }
  };

  // 점수 저장
  const saveScore = async () => {
    if (!selectedPokemonId || isSavingScore) return;

    try {
      setIsSavingScore(true);
      const response = await fetch("/api/minigame/runner/save-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedPokemonId,
          score: gameData.score,
          distance: gameData.distance,
          obstaclesPassed: gameData.obstaclesPassed,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isNewHighScore) {
          toast.success("🎉 새로운 최고 점수입니다!");
          setHighScore(gameData.score);
        } else {
          toast.success("점수가 저장되었습니다!");
        }
      }
    } catch (error) {
      toast.error("점수 저장에 실패했습니다");
      console.error(error);
    } finally {
      setIsSavingScore(false);
    }
  };

  // 게임 오버 시 자동 저장
  useEffect(() => {
    if (gameState === "GAME_OVER" && selectedPokemonId) {
      saveScore();
    }
  }, [gameState]);

  // Canvas 렌더링
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 배경 그리기
    const gradient = ctx.createLinearGradient(
      0,
      0,
      0,
      GAME_CONFIG.CANVAS_HEIGHT
    );
    gradient.addColorStop(0, "#E0F2FE");
    gradient.addColorStop(1, "#BAE6FD");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

    // 바닥 그리기 (전체 칠하기)
    const groundStartY = GAME_CONFIG.GROUND_Y + GAME_CONFIG.PLAYER_SIZE;
    ctx.fillStyle = "#8B9DC3";
    ctx.fillRect(
      0,
      groundStartY,
      GAME_CONFIG.CANVAS_WIDTH,
      GAME_CONFIG.CANVAS_HEIGHT - groundStartY
    );

    // 바닥 테두리선
    ctx.strokeStyle = "#64748B";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundStartY);
    ctx.lineTo(GAME_CONFIG.CANVAS_WIDTH, groundStartY);
    ctx.stroke();

    // 플레이어 그리기
    if (pokemonImg) {
      ctx.drawImage(
        pokemonImg,
        100,
        playerY,
        GAME_CONFIG.PLAYER_SIZE,
        GAME_CONFIG.PLAYER_SIZE
      );
    } else {
      ctx.fillStyle = "#3B82F6";
      ctx.fillRect(
        100,
        playerY,
        GAME_CONFIG.PLAYER_SIZE,
        GAME_CONFIG.PLAYER_SIZE
      );
    }

    // 디버그: 충돌 박스 그리기 (개발 중에만 활성화)
    if (process.env.NODE_ENV === 'development') {
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2;
      ctx.strokeRect(100, playerY, GAME_CONFIG.PLAYER_SIZE, GAME_CONFIG.PLAYER_SIZE);
    }

    // 장애물 그리기
    obstacles.forEach((obstacle) => {
      ctx.save();

      switch (obstacle.type) {
        case "pokeball":
          // 포켓볼 (빨강/흰색 원)
          ctx.beginPath();
          ctx.arc(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 2,
            obstacle.width / 2,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = "#EF4444";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 2,
            obstacle.width / 4,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
          break;

        case "berry":
          // 열매 (파란색 원)
          ctx.beginPath();
          ctx.arc(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 2,
            obstacle.width / 2,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = "#6366F1";
          ctx.fill();
          break;

        case "rock":
          // 바위 (회색 다각형)
          ctx.fillStyle = "#64748B";
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          break;

        case "thunderbolt":
          // 번개 (노란색 지그재그)
          ctx.fillStyle = "#FBBF24";
          ctx.beginPath();
          ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
          ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height / 2);
          ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
          ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
          ctx.lineTo(obstacle.x, obstacle.y + obstacle.height / 2);
          ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
          ctx.closePath();
          ctx.fill();
          break;
      }

      // 디버그: 장애물 충돌 박스 그리기
      if (process.env.NODE_ENV === 'development') {
        ctx.strokeStyle = "#EF4444";
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }

      ctx.restore();
    });
  }, [playerY, obstacles, pokemonImg]);

  // 애니메이션 프레임마다 렌더링
  useEffect(() => {
    if (gameState === "PLAYING" || gameState === "PAUSED") {
      drawGame();
    }
  }, [gameState, drawGame]);

  const handlePokemonSelect = (pokemonId: number, imageUrl: string) => {
    setSelectedPokemonId(pokemonId);
    setSelectedPokemonImage(imageUrl);
  };

  const handleCanvasClick = () => {
    if (gameState === "PLAYING") {
      jump();
    }
  };

  // 포켓몬 선택 화면
  if (!selectedPokemonId) {
    return (
      <div className={styles.container}>
        <PokemonSelector
          onSelect={handlePokemonSelect}
          selectedPokemonId={selectedPokemonId}
        />
        <div className={styles.selectPrompt}>
          <p>포켓몬을 선택한 후 게임을 시작할 수 있습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 게임 컨테이너 */}
      <div className={styles.gameWrapper}>
        {/* HUD */}
        <div className={styles.hud}>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>점수</span>
            <span className={styles.hudValue}>{gameData.score} / {gameData.obstaclesPassed}</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>생명</span>
            <span className={styles.hudValue}>{"❤️".repeat(gameData.lives)}</span>
          </div>
        </div>

        {/* 일시정지 버튼 */}
        {gameState === "PLAYING" && (
          <button className={styles.pauseButton} onClick={togglePause}>
            ⏸
          </button>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={GAME_CONFIG.CANVAS_WIDTH}
          height={GAME_CONFIG.CANVAS_HEIGHT}
          className={styles.canvas}
          onClick={handleCanvasClick}
        />

        {/* 메뉴 화면 */}
        {gameState === "MENU" && (
          <div className={styles.overlay}>
            <div className={styles.menuScreen}>
              <h1 className={styles.gameTitle}>포켓몬 러너</h1>
              {pokemonImg && (
                <img
                  src={selectedPokemonImage!}
                  alt="Selected Pokemon"
                  className={styles.previewImage}
                />
              )}
              <p className={styles.menuInstructions}>
                스페이스바 또는 화면 클릭으로 점프하세요!
              </p>
              {highScore > 0 && (
                <p className={styles.highScoreText}>최고 점수: {highScore}</p>
              )}
              <button className={styles.startButton} onClick={startGame}>
                게임 시작
              </button>
              <button
                className={styles.changeButton}
                onClick={() => setSelectedPokemonId(null)}
              >
                포켓몬 변경
              </button>
            </div>
          </div>
        )}

        {/* 일시정지 화면 */}
        {gameState === "PAUSED" && (
          <div className={styles.overlay}>
            <div className={styles.pauseScreen}>
              <h2 className={styles.pauseTitle}>일시정지</h2>
              <button className={styles.resumeButton} onClick={togglePause}>
                계속하기
              </button>
              <button className={styles.menuButton} onClick={backToMenu}>
                메뉴로
              </button>
            </div>
          </div>
        )}

        {/* 게임 오버 화면 */}
        {gameState === "GAME_OVER" && (
          <div className={styles.overlay}>
            <div className={styles.gameOverScreen}>
              <h1 className={styles.gameOverTitle}>게임 오버!</h1>
              <div className={styles.scoreBreakdown}>
                <div className={styles.scoreItem}>
                  <span>최종 점수</span>
                  <span className={styles.scoreValue}>{gameData.score}</span>
                </div>
                <div className={styles.scoreItem}>
                  <span>통과한 장애물</span>
                  <span className={styles.scoreValue}>
                    {gameData.obstaclesPassed}
                  </span>
                </div>
                <div className={styles.scoreItem}>
                  <span>이동 거리</span>
                  <span className={styles.scoreValue}>{gameData.distance}</span>
                </div>
                {highScore > 0 && (
                  <div className={styles.scoreItem}>
                    <span>최고 점수</span>
                    <span className={styles.highScoreValue}>{highScore}</span>
                  </div>
                )}
              </div>
              <div className={styles.gameOverButtons}>
                <button className={styles.retryButton} onClick={restartGame}>
                  다시 하기
                </button>
                <button className={styles.menuButton} onClick={backToMenu}>
                  메뉴로
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
