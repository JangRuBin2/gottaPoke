"use client";

import { CN } from "@/app/_utils/CN";
import Image from "next/image";
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
      {isOpen ? (
        <>
          <div className={styles.title}>
            <span>{poke.name}</span>
          </div>
          <div className={styles.container}>
            <span>
              <Image
                src={poke.sprites.front_default}
                layout="intrinsic"
                alt={`gottaPoke_${poke.name}`}
              ></Image>
            </span>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default PoketmonCard;
