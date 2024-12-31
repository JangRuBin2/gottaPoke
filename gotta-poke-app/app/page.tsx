"use client";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  return (
    <>
      <div>
        <h1>{"하이"}</h1>
        <button onClick={() => router.push("/gotta")}>
          {"포켓몬 뽑으러 가기"}
        </button>
      </div>
    </>
  );
};

export default page;
