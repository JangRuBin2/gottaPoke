"use client";
import { useRouter } from "next/navigation";

const IntroPage = () => {
  const router = useRouter();

  return <div onClick={() => router.push("/gotta")}>하이</div>;
};

export default IntroPage;
