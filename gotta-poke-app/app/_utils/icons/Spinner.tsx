import { BounceLoader } from "react-spinners";

const Spinner = ({ loading }: { loading: boolean }) => {
  return <BounceLoader size={180} color={"#a5e67a"} loading={loading} />;
};

export default Spinner;
