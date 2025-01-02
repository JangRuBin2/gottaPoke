import { Suspense } from "react";
import Spinner from "../_utils/icons/Spinner";
import GottaPokeClientPage from "./_components/GottaPokeClientPage";
const page = () => {
  return (
    <Suspense fallback={<Spinner loading={true} />}>
      <GottaPokeClientPage />
    </Suspense>
  );
};

export default page;
