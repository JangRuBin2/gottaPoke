import { Roboto } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"], // 원하는 굵기 선택
});
export const metadata = {
  title: "gotta Poke",
  description: "get your poketmon for free",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
