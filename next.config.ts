import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "7094",
        pathname: "/images/**",
      },
    ],
  },

  webpack: (config) => {
    config.infrastructureLogging = { level: "warn" };
    return config;
  },
};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,

//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },

//   images: {
//     domains: ["localhost"],
//   },

//   webpack: (config) => {
//     config.infrastructureLogging = { level: "warn" };
//     return config;
//   },
// };

// export default nextConfig;
