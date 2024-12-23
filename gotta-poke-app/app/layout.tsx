import { ReactNode } from "react";

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
