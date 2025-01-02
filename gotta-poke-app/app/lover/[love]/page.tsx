import loverLogo from "@/app/_utils/images/loverLogo.png.png";
import Image from "next/image";
import { redirect } from "next/navigation";
import styles from "./LoverPage.module.css";
const LoverPage = async ({ params }: { params: { love: string } }) => {
  const love = params.love;
  if (!love) redirect("/");
  return (
    <div className={styles.container}>
      <span>
        <Image
          src={loverLogo}
          fill
          alt={"gottaPoke_loverImage"}
          style={{ objectFit: "contain" }}
        />
      </span>
    </div>
  );
};

export default LoverPage;
