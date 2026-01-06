"use client";
import { CN, getLegend, getRandomNumber } from "@/app/_utils";
import GottaIcon from "@/app/_utils/icons/GottaIcon";
import HomeIcon from "@/app/_utils/icons/HomeIcon";
import SaveIcon from "@/app/_utils/icons/SaveIcon";
import SoundHandleIcon from "@/app/_utils/icons/SoundHandleIcon";
import Spinner from "@/app/_utils/icons/Spinner";
import Modal from "@/components/Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "react-toastify";
import styles from "./GottaPokePage.module.css";
import PoketmonCard from "./PoketmonCard";

const GottaClientPokePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const isLove = params.get("love");
  const [cardInfo, setCardInfo] = useState<Poketmon[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(false);
  const [openedCards, setOpenedCards] = useState<Set<number>>(new Set());
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedCards, setHasUnsavedCards] = useState<boolean>(false);
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [showSaveEffect, setShowSaveEffect] = useState<boolean>(false);

  const getPoke = async ({ isLove }: { isLove?: string }) => {
    if (isLoading) {
      toast.warning("이미 요청을 수행중입니다.");
      return;
    }
    try {
      const legendMode = isLove === "forever";
      setIsLoading(true);
      setCardInfo([]);
      const result: Poketmon[] = [];
      for (let i = 0; i < 6; i++) {
        const pokemonId = legendMode ? getLegend() : getRandomNumber();
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;

        const [pokemonResponse, speciesResponse] = await Promise.all([
          fetch(pokemonUrl),
          fetch(speciesUrl),
        ]);

        const pokemonData = await pokemonResponse.json();
        const speciesData = await speciesResponse.json();

        if (!pokemonResponse.ok || !speciesResponse.ok)
          throw new Error("포켓몬 데이터를 가져오는데 실패했습니다.");
        if (!isGetPokeResponse(pokemonData))
          throw new Error("올바르지 않은 반환값입니다.");

        // 레어도 정보 추가
        pokemonData.is_legendary = speciesData.is_legendary || false;
        pokemonData.is_mythical = speciesData.is_mythical || false;

        result.push(pokemonData);
      }
      console.log("result:", result);
      toast.success("포켓몬이 왔습니다~");
      setCardInfo(result);
      setOpenedCards(new Set());
      setSelectedCards(new Set());
      setHasUnsavedCards(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "포켓몬 데이터를 가져오는데 실패했습니다."
      );
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSave = async () => {
    // 이미 저장 중이면 바로 리턴
    if (isSaving) {
      toast.warning("이미 저장 중입니다");
      return;
    }

    if (!cardInfo || !cardInfo.length) {
      toast.error("포켓몬 정보가 없습니다");
      return;
    }

    // 모든 카드가 개봉되었는지 확인
    if (openedCards.size !== cardInfo.length) {
      toast.warning("모든 카드를 개봉해야 저장할 수 있습니다");
      return;
    }

    try {
      // 저장 시작 - 버튼 비활성화 및 효과 표시
      setIsSaving(true);
      setShowSaveEffect(true);

      // 선택된 카드가 있으면 선택된 것만, 없으면 전체 저장
      const pokemonsToSave = selectedCards.size > 0
        ? cardInfo.filter((_, idx) => selectedCards.has(idx))
        : cardInfo;

      const allPokemons = pokemonsToSave.map((card) => ({
        pokemonId: card.id,
        thumbnailUrl: card.sprites.front_default,
      }));

      const response = await fetch("/api/pokemon/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pokemons: allPokemons }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "저장에 실패했습니다");
      }

      toast.success(`${allPokemons.length}개의 포켓몬이 저장되었습니다!`);
      setHasUnsavedCards(false);
      // 저장 완료 후 카드 초기화
      setCardInfo(undefined);
      setOpenedCards(new Set());
      setSelectedCards(new Set());

      // 효과 1.5초 후 자동 종료
      setTimeout(() => {
        setShowSaveEffect(false);
      }, 1500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "포켓몬 저장에 실패했습니다."
      );
      console.error(error);
      setShowSaveEffect(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAll = () => {
    if (!cardInfo) return;
    setOpenedCards(new Set(cardInfo.map((_, idx) => idx)));
  };

  const handleToggleSelect = (index: number) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (!cardInfo) return;
    if (selectedCards.size === cardInfo.length) {
      // 전체 선택 상태면 전체 해제
      setSelectedCards(new Set());
    } else {
      // 전체 선택
      setSelectedCards(new Set(cardInfo.map((_, idx) => idx)));
    }
  };

  const handleNavigation = (path: string) => {
    if (hasUnsavedCards && cardInfo && cardInfo.length > 0) {
      setPendingNavigation(path);
      setShowLeaveModal(true);
    } else {
      router.push(path);
    }
  };

  const handleConfirmLeave = () => {
    if (pendingNavigation) {
      setShowLeaveModal(false);
      router.push(pendingNavigation);
      setPendingNavigation(null);
      setHasUnsavedCards(false);
    }
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
    setPendingNavigation(null);
  };

  return (
    <Suspense fallback={<Spinner loading={true} />}>
      <div className={CN([styles.contents, isLoading ? styles.loading : ""])}>
        <div className={styles.title}>
          <h1>{"포켓몬 자판기"}</h1>
          {cardInfo && cardInfo.length > 0 && (
            <div className={styles.selectionInfo}>
              {selectedCards.size > 0 ? (
                <span className={styles.selectedCount}>
                  {selectedCards.size}개 선택됨
                </span>
              ) : (
                <span className={styles.noSelection}>
                  저장할 포켓몬을 선택하세요
                </span>
              )}
            </div>
          )}
        </div>
        <div className={styles.contentBox}>
          {isLoading ? (
            <Spinner loading={isLoading} />
          ) : (
            cardInfo?.map((card, idx) => (
              <div key={idx} className={styles.cardWrapper}>
                <div
                  className={selectedCards.has(idx) ? styles.selectedCardWrapper : ''}
                  onClick={() => handleToggleSelect(idx)}
                >
                  <PoketmonCard
                    soundOn={soundOn}
                    poketmonInfo={card}
                    cardIndex={idx}
                    openedCards={openedCards}
                    setOpenedCards={setOpenedCards}
                  />
                </div>
                <div className={styles.checkboxContainer}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedCards.has(idx)}
                      onChange={() => handleToggleSelect(idx)}
                      className={styles.cardCheckbox}
                    />
                    <span>{selectedCards.has(idx) ? '선택됨' : '선택'}</span>
                  </label>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={styles.handler}>
          <div className={styles.getCard}>
            <button
              className={CN([styles.gotta, !isLove ? styles.onlyGotta : ""])}
              onClick={() => getPoke({})}
            >
              {"뽑기"}
            </button>
            {isLove && (
              <button onClick={() => getPoke({ isLove })}>
                <GottaIcon />
              </button>
            )}
            {cardInfo && cardInfo.length > 0 && (
              <>
                <button className={styles.openAllBtn} onClick={handleOpenAll}>
                  전체 열기
                </button>
                <button className={styles.selectAllBtn} onClick={handleSelectAll}>
                  {selectedCards.size === cardInfo.length ? "선택 해제" : "전체 선택"}
                </button>
              </>
            )}
          </div>
          <div className={styles.save}>
            {cardInfo?.length ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving || openedCards.size !== cardInfo.length}
                  className={styles.saveBtn}
                  title={
                    openedCards.size !== cardInfo.length
                      ? "모든 카드를 개봉해야 저장할 수 있습니다"
                      : selectedCards.size > 0
                      ? `선택된 ${selectedCards.size}개 저장`
                      : `전체 ${cardInfo.length}개 저장`
                  }
                >
                  {isSaving ? (
                    <Spinner loading={true} />
                  ) : (
                    <>
                      <SaveIcon />
                      <span className={styles.saveBtnText}>
                        {selectedCards.size > 0
                          ? `${selectedCards.size}개 저장`
                          : `전체 저장`}
                      </span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <Spinner loading={!!cardInfo?.length} />
            )}
            <button onClick={() => handleNavigation("/")}>
              <HomeIcon />
            </button>
            <button>
              <SoundHandleIcon soundOn={soundOn} setSoundOn={setSoundOn} />
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showLeaveModal}
        onClose={handleCancelLeave}
        onConfirm={handleConfirmLeave}
        title="저장 확인"
        confirmText="나가기"
        cancelText="취소"
      >
        <p>저장하지 않은 포켓몬이 있습니다.</p>
        <p>저장하지 않고 나가시겠습니까?</p>
      </Modal>
      {showSaveEffect && (
        <div className={styles.saveEffectContainer}>
          <div className={styles.centerFlash} />
          {Array.from({ length: 30 }).map((_, i) => {
            const angle = (i / 30) * Math.PI * 2;
            const distance = 150 + Math.random() * 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const delay = Math.random() * 0.2;

            return (
              <div
                key={i}
                className={styles.particle}
                style={{
                  '--tx': `${tx}px`,
                  '--ty': `${ty}px`,
                  backgroundColor: color,
                  animationDelay: `${delay}s`,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}
    </Suspense>
  );
};

const isGetPokeResponse = (data: any): data is Poketmon => {
  return typeof data === "object" && typeof data.id === "number";
};

export default GottaClientPokePage;
