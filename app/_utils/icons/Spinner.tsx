"use client";
import { BounceLoader } from "react-spinners";

const Spinner = ({ loading }: { loading: boolean }) => {
  return (
    <BounceLoader
      size={180}
      color={" rgba(159, 171, 192, 0.3)"}
      loading={loading}
    />
  );
};

export default Spinner;
