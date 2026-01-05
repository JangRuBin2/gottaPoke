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
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedCards, setHasUnsavedCards] = useState<boolean>(false);
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

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

    try {
      // 저장 시작 - 버튼 비활성화
      setIsSaving(true);
      const allPokemons = cardInfo.map((card) => ({
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
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "포켓몬 저장에 실패했습니다."
      );
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAll = () => {
    if (!cardInfo) return;
    setOpenedCards(new Set(cardInfo.map((_, idx) => idx)));
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
        </div>
        <div className={styles.contentBox}>
          {isLoading ? (
            <Spinner loading={isLoading} />
          ) : (
            cardInfo?.map((card, idx) => (
              <PoketmonCard
                key={idx}
                soundOn={soundOn}
                poketmonInfo={card}
                cardIndex={idx}
                openedCards={openedCards}
                setOpenedCards={setOpenedCards}
              />
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
              <button className={styles.openAllBtn} onClick={handleOpenAll}>
                전체 열기
              </button>
            )}
          </div>
          <div className={styles.save}>
            {cardInfo?.length ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    opacity: isSaving ? 0.5 : 1,
                    pointerEvents: isSaving ? 'none' : 'auto'
                  }}
                >
                  {isSaving ? <Spinner loading={true} /> : <SaveIcon />}
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
    </Suspense>
  );
};

const isGetPokeResponse = (data: any): data is Poketmon => {
  return typeof data === "object" && typeof data.id === "number";
};

export default GottaClientPokePage;
