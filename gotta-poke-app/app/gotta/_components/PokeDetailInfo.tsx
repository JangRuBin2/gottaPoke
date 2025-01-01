"use client";
import ExitIcon from "@/app/_utils/icons/ExitIcon";
import {
  FlavorText,
  Genera,
  Names,
  PokeDetail,
} from "@/app/types/pokeDetail/pokeDetail";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "./PokeDetailInfo.module.css";
const PokeDetailInfo = ({
  pokeDetailInfo: poke,
  setIsDetailOpen,
}: {
  pokeDetailInfo: PokeDetail;
  setIsDetailOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [showInfo, isShowInfo] = useState<boolean>(false);
  return (
    <div className={styles.wrapper} onClick={() => isShowInfo((p) => !p)}>
      <div className={styles.title}>
        <span>{getKoreanInfo(poke.genera)}</span>
        <h4>{getKoreanName(poke.names)}</h4>
        <ExitIcon onClick={() => setIsDetailOpen(false)} />
      </div>
      {showInfo && (
        <div className={styles.info}>
          <span>{getKoeanFlavor(poke.flavor_text_entries)}</span>
        </div>
      )}
    </div>
  );
};
const getKoreanInfo = (data: Genera[]) => {
  const result = data.find((d) => d.language.name === "ko");
  if (!result) return "";
  return result.genus;
};
const getKoreanName = (data: Names[]) => {
  const result = data.find((d) => d.language.name === "ko");
  if (!result) return "";
  return result.name;
};
const getKoeanFlavor = (data: FlavorText[]) => {
  const result = data.find((d) => d.language.name === "ko");
  if (!result) return "";
  return result.flavor_text;
};
export default PokeDetailInfo;
