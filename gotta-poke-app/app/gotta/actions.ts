"use server";

export const getPoke = async () => {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=10";
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
};
