const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/master/sprites/pokemon/other/showdown/**",
      },
    ],
  },
  experimental: {},
};

export default nextConfig;
