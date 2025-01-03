import loverLogo from "@/app/_utils/images/loverLogo.png.png";
import Image from "next/image";
import Link from "next/link";
import styles from "./LoverPage.module.css";
const LoverPage = () => {
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
      <Link href={"/gotta?love=forever"}>{"사기 모드 시작하기"}</Link>
    </div>
  );
};
export const dynamic = "force-dynamic";
export default LoverPage;
