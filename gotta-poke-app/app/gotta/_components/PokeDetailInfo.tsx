"use client";
import { Genera, Names, PokeDetail } from "@/app/types/pokeDetail/pokeDetail";
import { useState } from "react";
import styles from "./PokeDetailInfo.module.css";
const PokeDetailInfo = ({
  pokeDetailInfo: poke,
}: {
  pokeDetailInfo: PokeDetail;
}) => {
  const [showInfo, isShowInfo] = useState<boolean>(false);
  return (
    <div className={styles.wrapper} onClick={() => isShowInfo((p) => !p)}>
      <div className={styles.title}>
        <span>{getKoreanInfo(poke.genera)}</span>
        <h4>{getKoreanName(poke.names)}</h4>
        <span>{"X"}</span>
      </div>
      {showInfo && (
        <div className={styles.info}>
          {poke.flavor_text_entries.map((ent, idx) => (
            <span key={idx}>{ent.flavor_text}</span>
          ))}
        </div>
      )}
    </div>
  );
};
const getKoreanInfo = (genera: Genera[]) => {
  const result = genera.find((ge) => ge.language.name === "ko");
  if (!result) return "";
  return result.genus;
};
const getKoreanName = (names: Names[]) => {
  const result = names.find((na) => na.language.name === "ko");
  if (!result) return "";
  return result.name;
};
export default PokeDetailInfo;
