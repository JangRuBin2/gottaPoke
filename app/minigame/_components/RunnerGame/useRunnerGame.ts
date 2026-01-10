import { useState, useEffect, useRef, useCallback } from "react";

// 게임 설정 상수
export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,
  GRAVITY: 0.8,
  JUMP_FORCE: -15,
  GROUND_Y: 320, // 플레이어가 바닥에 붙도록 조정 (400 - 80 = 320)
  PLAYER_SIZE: 80,
  INITIAL_OBSTACLE_SPEED: 5,
  OBSTACLE_SPAWN_INTERVAL: 1500,
  FPS: 60,
};

// 장애물 타입
export type ObstacleType = "pokeball" | "berry" | "rock" | "thunderbolt";

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: ObstacleType;
  passed: boolean;
}

export type GameState = "MENU" | "PLAYING" | "PAUSED" | "GAME_OVER";

export interface GameData {
  score: number;
  distance: number;
  obstaclesPassed: number;
  lives: number;
}

export function useRunnerGame() {
  const [gameState, setGameState] = useState<GameState>("MENU");
  const [playerY, setPlayerY] = useState(GAME_CONFIG.GROUND_Y);
  const [playerVelocity, setPlayerVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [obstaclesPassed, setObstaclesPassed] = useState(0);
  const [lives, setLives] = useState(3);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacleSpeed, setObstacleSpeed] = useState(
    GAME_CONFIG.INITIAL_OBSTACLE_SPEED
  );

  const animationFrameRef = useRef<number>();
  const lastObstacleTimeRef = useRef<number>(0);
  const gameStartTimeRef = useRef<number>(0);
  const lastSpeedIncreaseRef = useRef<number>(0);
  const lastHitTimeRef = useRef<number>(0); // 마지막 충돌 시간 (무적 시간용)

  // 장애물 생성 헬퍼
  const createObstacle = useCallback((): Obstacle => {
    const rand = Math.random();
    let type: ObstacleType;
    let width: number;
    let height: number;

    if (rand < 0.5) {
      type = "pokeball";
      width = 40; // 30 → 40
      height = 40;
    } else if (rand < 0.8) {
      type = "berry";
      width = 35; // 25 → 35
      height = 35;
    } else if (rand < 0.95) {
      type = "rock";
      width = 50; // 35 → 50
      height = 50;
    } else {
      type = "thunderbolt";
      width = 30; // 20 → 30
      height = 30;
    }

    return {
      x: GAME_CONFIG.CANVAS_WIDTH,
      y: GAME_CONFIG.CANVAS_HEIGHT - height, // 장애물이 바닥에 서있도록 조정
      width,
      height,
      type,
      passed: false,
    };
  }, []);

  // 점프
  const jump = useCallback(() => {
    if (gameState !== "PLAYING" || isJumping) return;

    setPlayerVelocity(GAME_CONFIG.JUMP_FORCE);
    setIsJumping(true);
  }, [gameState, isJumping]);

  // 충돌 감지 (AABB)
  const checkCollision = useCallback(
    (
      playerX: number,
      playerY: number,
      obstacle: Obstacle
    ): boolean => {
      const playerSize = GAME_CONFIG.PLAYER_SIZE;

      // 플레이어 영역
      const playerLeft = playerX;
      const playerRight = playerX + playerSize;
      const playerTop = playerY;
      const playerBottom = playerY + playerSize;

      // 장애물 영역
      const obstacleLeft = obstacle.x;
      const obstacleRight = obstacle.x + obstacle.width;
      const obstacleTop = obstacle.y;
      const obstacleBottom = obstacle.y + obstacle.height;

      // AABB 충돌 감지
      const collision = (
        playerRight > obstacleLeft &&
        playerLeft < obstacleRight &&
        playerBottom > obstacleTop &&
        playerTop < obstacleBottom
      );

      // 디버그 로그 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        // 근접한 장애물만 로그
        if (Math.abs(playerX - obstacle.x) < 150) {
          console.log('장애물 근접:', {
            collision,
            player: { left: playerLeft, right: playerRight, top: playerTop, bottom: playerBottom },
            obstacle: { left: obstacleLeft, right: obstacleRight, top: obstacleTop, bottom: obstacleBottom },
          });
        }
      }

      return collision;
    },
    []
  );

  // 게임 시작
  const startGame = useCallback(() => {
    setGameState("PLAYING");
    setPlayerY(GAME_CONFIG.GROUND_Y);
    setPlayerVelocity(0);
    setObstacles([]);
    setScore(0);
    setDistance(0);
    setObstaclesPassed(0);
    setLives(3);
    setIsJumping(false);
    setObstacleSpeed(GAME_CONFIG.INITIAL_OBSTACLE_SPEED);
    gameStartTimeRef.current = Date.now();
    lastObstacleTimeRef.current = Date.now();
    lastSpeedIncreaseRef.current = Date.now();
    lastHitTimeRef.current = 0; // 무적 시간 초기화
    console.log('게임 시작! 생명: 3');
  }, []);

  // 게임 일시정지/재개
  const togglePause = useCallback(() => {
    if (gameState === "PLAYING") {
      setGameState("PAUSED");
    } else if (gameState === "PAUSED") {
      setGameState("PLAYING");
    }
  }, [gameState]);

  // 게임 재시작
  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // 메뉴로 돌아가기
  const backToMenu = useCallback(() => {
    setGameState("MENU");
    setPlayerY(GAME_CONFIG.GROUND_Y);
    setPlayerVelocity(0);
    setObstacles([]);
    setScore(0);
    setDistance(0);
    setObstaclesPassed(0);
    setLives(3);
    setIsJumping(false);
    setObstacleSpeed(GAME_CONFIG.INITIAL_OBSTACLE_SPEED);
  }, []);

  // 게임 루프
  useEffect(() => {
    if (gameState !== "PLAYING") {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const gameLoop = () => {
      const now = Date.now();

      // 물리 업데이트 - 플레이어
      setPlayerVelocity((prev) => {
        const newVelocity = prev + GAME_CONFIG.GRAVITY;
        return newVelocity;
      });

      setPlayerY((prev) => {
        const newY = prev + playerVelocity;
        if (newY >= GAME_CONFIG.GROUND_Y) {
          setIsJumping(false);
          return GAME_CONFIG.GROUND_Y;
        }
        return newY;
      });

      // 난이도 증가 (10초마다)
      if (now - lastSpeedIncreaseRef.current > 10000) {
        setObstacleSpeed((prev) => Math.min(prev + 0.5, 10));
        lastSpeedIncreaseRef.current = now;
      }

      // 장애물 생성
      if (now - lastObstacleTimeRef.current > GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL) {
        setObstacles((prev) => [...prev, createObstacle()]);
        lastObstacleTimeRef.current = now;
      }

      // 장애물 업데이트 및 충돌 검사
      const playerX = 100; // 플레이어 고정 X 위치
      const INVINCIBILITY_TIME = 500; // 무적 시간 (ms)

      setObstacles((prev) => {
        let collisionDetected = false;

        const updated = prev
          .map((obstacle) => {
            const newX = obstacle.x - obstacleSpeed;

            // 충돌 검사 (아직 통과하지 않은 장애물만)
            if (
              !obstacle.passed &&
              checkCollision(playerX, playerY, { ...obstacle, x: newX })
            ) {
              // 무적 시간이 지났으면 충돌 처리
              if (now - lastHitTimeRef.current > INVINCIBILITY_TIME) {
                collisionDetected = true;
                lastHitTimeRef.current = now;

                // 즉시 생명 감소
                setLives((prevLives) => {
                  const newLives = prevLives - 1;
                  console.log(`충돌! 생명: ${prevLives} → ${newLives}`);
                  if (newLives <= 0) {
                    setGameState("GAME_OVER");
                  }
                  return newLives;
                });
              }

              // 충돌한 장애물은 통과한 것으로 표시 (중복 충돌 방지)
              return { ...obstacle, x: newX, passed: true };
            }

            // 통과 체크 (충돌하지 않고 지나간 경우)
            if (!obstacle.passed && newX + obstacle.width < playerX) {
              setObstaclesPassed((p) => p + 1);
              setScore((s) => s + 25);
              return { ...obstacle, x: newX, passed: true };
            }

            return { ...obstacle, x: newX };
          })
          .filter((obstacle) => obstacle.x > -obstacle.width);

        return updated;
      });

      // 거리 및 점수 업데이트
      setDistance((prev) => prev + 1);
      setScore((prev) => prev + 1); // 프레임당 1점

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    gameState,
    playerVelocity,
    playerY,
    obstacleSpeed,
    createObstacle,
    checkCollision,
  ]);

  // 키보드 입력
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
      if (e.code === "Escape") {
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump, togglePause]);

  const gameData: GameData = {
    score,
    distance,
    obstaclesPassed,
    lives,
  };

  return {
    gameState,
    playerY,
    obstacles,
    gameData,
    startGame,
    togglePause,
    restartGame,
    backToMenu,
    jump,
  };
}
