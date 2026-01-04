"use client";

import { $ERR } from "@/app/_utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 이메일 검증
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("올바른 이메일 형식이 아닙니다");
      setLoading(false);
      return;
    }

    // 비밀번호 검증
    if (formData.password.length < 8) {
      toast.error("비밀번호는 최소 8자 이상이어야 합니다");
      setLoading(false);
      return;
    }

    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(
      formData.password
    );

    const conditions = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar];
    const metConditions = conditions.filter(Boolean).length;

    if (metConditions < 3) {
      toast.error(
        "비밀번호는 영문 대소문자, 숫자, 특수문자 중 3가지 이상을 포함해야 합니다"
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "회원가입에 실패했습니다");
      }

      // 로그인 페이지에서 toast를 띄우므로 여기서는 제거
      router.push("/auth/login?registered=true");
    } catch (error) {
      toast.error($ERR(error || "회원가입 중 오류가 발생했습니다"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-sky-200 to-blue-200 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-sky-200">
          <div className="bg-gradient-to-r from-sky-400 to-blue-400 p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">Poke P!ck</h1>
            <p className="text-sky-50">새로운 트레이너 등록</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  트레이너 이름
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-sky-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none transition-all text-gray-900 bg-sky-50/50"
                  placeholder="포켓몬 마스터"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl border-2 border-sky-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none transition-all text-gray-900 bg-sky-50/50"
                  placeholder="trainer@pokemon.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-sky-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none transition-all text-gray-900 bg-sky-50/50"
                    placeholder="최소 8자 이상"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-500 hover:text-sky-700 transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  8자 이상, 영문 대소문자/숫자/특수문자 중 3가지 이상 포함
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-3 px-4 rounded-xl hover:from-sky-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    가입 중...
                  </span>
                ) : (
                  "트레이너 등록하기"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                이미 계정이 있으신가요?{" "}
                <Link
                  href="/auth/login"
                  className="text-sky-600 font-semibold hover:text-sky-700 transition-colors"
                >
                  로그인
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sky-700 font-medium text-sm mt-6 drop-shadow-sm">
          지금 가입하고 포켓몬 여정을 시작하세요!
        </p>
      </div>
    </div>
  );
}
