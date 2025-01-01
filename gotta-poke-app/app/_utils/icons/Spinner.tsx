import { BounceLoader } from "react-spinners";

const Spinner = ({ loading }: { loading: boolean }) => {
  return <BounceLoader size={50} color={"#d2ab36"} loading={loading} />;
};

export default Spinner;
