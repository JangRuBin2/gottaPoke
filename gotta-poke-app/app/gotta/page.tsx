"use client";
import { useEffect } from "react";
import { getPoke } from "./actions";

const GottaPokePage = () => {
  useEffect(async () => {
    await getPoke();
  }, []);
  return <div></div>;
};

export default GottaPokePage;
