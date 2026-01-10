"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RunnerGame from "./RunnerGame/RunnerGame";
import styles from "./MinigamePage.module.css";

export default function MinigameClientPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  // 인증되지 않은 사용자 처리
  if (!session) {
    router.push("/auth/login");
    return null;
  }

  // 게임 선택 화면
  if (!selectedGame) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.gradientText}>미니게임</span>
          </h1>
          <p className={styles.subtitle}>재미있는 포켓몬 게임을 즐겨보세요!</p>

          <div className={styles.gamesGrid}>
            {/* 러너 게임 카드 */}
            <div
              className={styles.gameCard}
              onClick={() => setSelectedGame("runner")}
            >
              <div className={styles.gameIcon}>🏃</div>
              <h2 className={styles.gameTitle}>포켓몬 러너</h2>
              <p className={styles.gameDescription}>
                포켓몬과 함께 장애물을 피하며 달려보세요!
              </p>
              <button className={styles.playButton}>게임 시작</button>
            </div>

            {/* 향후 추가될 게임들 */}
            <div className={`${styles.gameCard} ${styles.comingSoon}`}>
              <div className={styles.gameIcon}>🎴</div>
              <h2 className={styles.gameTitle}>메모리 카드</h2>
              <p className={styles.gameDescription}>곧 출시 예정입니다</p>
              <div className={styles.comingSoonBadge}>Coming Soon</div>
            </div>

            <div className={`${styles.gameCard} ${styles.comingSoon}`}>
              <div className={styles.gameIcon}>❓</div>
              <h2 className={styles.gameTitle}>포켓몬 퀴즈</h2>
              <p className={styles.gameDescription}>곧 출시 예정입니다</p>
              <div className={styles.comingSoonBadge}>Coming Soon</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 선택된 게임 렌더링
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <button
          className={styles.backButton}
          onClick={() => setSelectedGame(null)}
        >
          ← 게임 목록으로
        </button>

        {selectedGame === "runner" && <RunnerGame />}
      </div>
    </div>
  );
}
