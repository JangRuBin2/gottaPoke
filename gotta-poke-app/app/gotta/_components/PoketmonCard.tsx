"use client";

import { CN } from "@/app/_utils/CN";
import { useState } from "react";
import styles from "./PoketmonCard.module.css";
const PoketmonCard = ({
  poketmonInfo: poke,
}: {
  poketmonInfo: PoketmonInfo;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOpen = () => {
    setIsOpen(true);
  };
  return (
    <div
      className={CN([styles.cardContainer, !isOpen ? styles.disabled : ""])}
      onClick={handleOpen}
    >
      {isOpen ? <div>{poke.name}</div> : <div></div>}
    </div>
  );
};

export default PoketmonCard;
