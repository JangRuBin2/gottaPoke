"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // 인증 페이지에서는 헤더 숨김
  if (pathname?.startsWith("/auth")) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("로그아웃되었습니다");
      router.push("/auth/login");
    } catch (error) {
      toast.error("로그아웃 중 오류가 발생했습니다");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-sky-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent hover:from-sky-600 hover:to-blue-600 transition-all"
          >
            Poke P!ck
          </Link>

          {/* 데스크톱 네비게이션 */}
          {session && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/gotta"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/gotta"
                    ? "text-sky-600"
                    : "text-gray-600 hover:text-sky-600"
                }`}
              >
                포켓몬 뽑기
              </Link>
              <Link
                href="/pokedex"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/pokedex"
                    ? "text-sky-600"
                    : "text-gray-600 hover:text-sky-600"
                }`}
              >
                포켓몬 도감
              </Link>

              {/* 사용자 메뉴 */}
              <div className="flex items-center gap-3 pl-3 border-l border-sky-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-blue-400 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm px-4 py-2 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors font-medium"
                >
                  로그아웃
                </button>
              </div>
            </nav>
          )}

          {/* 모바일 햄버거 메뉴 */}
          {session && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-sky-50 transition-colors"
              aria-label="메뉴"
            >
              <svg
                className="w-6 h-6 text-sky-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {session && menuOpen && (
        <div className="md:hidden bg-white border-t border-sky-200">
          <div className="px-4 py-3 space-y-3">
            {/* 사용자 정보 */}
            <div className="flex items-center gap-3 pb-3 border-b border-sky-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-400 to-blue-400 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {session.user?.name}
                </div>
                <div className="text-xs text-gray-500">
                  {session.user?.email}
                </div>
              </div>
            </div>

            {/* 네비게이션 링크 */}
            <Link
              href="/gotta"
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/gotta"
                  ? "bg-sky-50 text-sky-600"
                  : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
              }`}
            >
              포켓몬 뽑기
            </Link>
            <Link
              href="/pokedex"
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/pokedex"
                  ? "bg-sky-50 text-sky-600"
                  : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
              }`}
            >
              포켓몬 도감
            </Link>

            {/* 로그아웃 버튼 */}
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
