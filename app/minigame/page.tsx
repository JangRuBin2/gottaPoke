import { Suspense } from "react";
import Spinner from "@/app/_utils/icons/Spinner";
import MinigameClientPage from "./_components/MinigameClientPage";

export default function MinigamePage() {
  return (
    <Suspense fallback={<Spinner loading={true} />}>
      <MinigameClientPage />
    </Suspense>
  );
}
