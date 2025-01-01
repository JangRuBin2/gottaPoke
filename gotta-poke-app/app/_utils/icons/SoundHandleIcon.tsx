"use client";
import { Dispatch, SetStateAction } from "react";
import SoundOff from "./SoundOff";
import SoundOn from "./SoundOn";

const SoundHandleIcon = ({
  soundOn,
  setSoundOn,
}: {
  soundOn: boolean;
  setSoundOn: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div onClick={() => setSoundOn((p) => !p)}>
      {soundOn ? <SoundOn /> : <SoundOff />}
    </div>
  );
};

export default SoundHandleIcon;
