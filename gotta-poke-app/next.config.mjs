const nextConfig = {
  // 개발 환경 설정 (API Routes 사용 가능)
  // 배포시에는 Vercel 등 서버리스 플랫폼 사용 필요
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/master/sprites/pokemon/other/showdown/**",
      },
    ],
  },
};

export default nextConfig;
