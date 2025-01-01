import { ReactNode } from "react";
import "./globals.css";
export const metadata = {
  title: "gotta Poke",
  description: "get your poketmon for free",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
