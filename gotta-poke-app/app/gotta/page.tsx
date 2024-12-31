"use client";

type GetPokeResponse = {
  name: string;
  url: string;
};
const isGetPokeResponse = (data: any): data is GetPokeResponse => {
  return typeof data === "object" && Array.isArray(data.results);
};
const GottaPokePage = () => {
  const getPoke = async () => {
    try {
      const url = "https://pokeapi.co/api/v2/pokemon?limit=10";
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (!isGetPokeResponse(data))
        throw new Error("포켓몬 데이터를 가져오는데 실패했습니다.");
      console.log(data);
      alert("포켓몬이 왔습니다~");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "포켓몬 데이터를 가져오는데 실패했습니다."
      );
      console.log(error);
    }
  };
  return (
    <div>
      <h3>{"포켓몬 자판기"}</h3>
      <button onClick={getPoke}>{"뽑기"}</button>
    </div>
  );
};

export default GottaPokePage;
