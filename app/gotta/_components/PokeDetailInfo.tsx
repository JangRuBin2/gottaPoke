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
  const [showInfo, setShowInfo] = useState<boolean>(false);
  return (
    <div className={styles.wrapper} onClick={() => setShowInfo((p) => !p)}>
      <div className={styles.container}>
        <div className={styles.title}>
          <div className={styles.name}>
            <span>{getKoreanInfo(poke.genera)}</span>
            <h4>{getKoreanName(poke.names)}</h4>
          </div>
          <ExitIcon onClick={() => setIsDetailOpen(false)} />
        </div>
        {showInfo && (
          <div className={styles.info}>
            <span>{getKoeanFlavor(poke.flavor_text_entries)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
const getKoreanInfo = (data: Genera[]) => {
  const result = data.find(
    (d) => d.language.name === "ko" || d.language.name === "en"
  );
  console.log(result);
  if (!result) return "";
  return result.genus;
};
const getKoreanName = (data: Names[]) => {
  const result = data.find(
    (d) => d.language.name === "ko" || d.language.name === "en"
  );
  if (!result) return "";
  return result.name;
};
const getKoeanFlavor = (data: FlavorText[]) => {
  const result = data.find(
    (d) => d.language.name === "ko" || d.language.name === "en"
  );
  if (!result) return "";
  return result.flavor_text;
};
export default PokeDetailInfo;
