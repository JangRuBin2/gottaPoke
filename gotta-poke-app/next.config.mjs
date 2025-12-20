const nextConfig = {
  output: "export",
  basePath: "/gottaPoke",
  images: {
    unoptimized: true,
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
