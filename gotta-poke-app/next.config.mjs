const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/master/sprites/pokemon/other/showdown/**",
      },
      {
        protocol: "https",
        hostname: "pokeapi.co",
      },
    ],
  },
};

export default nextConfig;
