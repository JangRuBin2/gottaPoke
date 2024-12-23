"use client";
import { useEffect } from "react";

const GottaPokePage = () => {
  useEffect(() => {
    const getPoke = async () => {
      const url = "https://pokeapi.co/api/v2/pokemon?limit=10";
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
    };
    getPoke();
  }, []);
  return <div></div>;
};

export default GottaPokePage;
