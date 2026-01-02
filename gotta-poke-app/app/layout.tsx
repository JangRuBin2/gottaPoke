import Header from "@/components/Header";
import SessionCheck from "@/components/SessionCheck";
import SessionProvider from "@/components/SessionProvider";
import { Roboto } from "next/font/google";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"], // 원하는 굵기 선택
});

export const metadata = {
  title: "Poke P!ck",
  description: "Pick your favorite Pokemon!",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <SessionProvider>
          <SessionCheck />
          <Header />
          <main className="min-h-screen">{children}</main>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </SessionProvider>
      </body>
    </html>
  );
}
