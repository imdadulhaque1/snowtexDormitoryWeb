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
        protocol: "http",
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

  async headers() {
    return [
      {
        // Apply CORS headers to all API routes
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Allow all origins
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS, PUT, DELETE",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Custom-Header, Content-Type",
          },
        ],
      },
    ];
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
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "localhost",
//         port: "7094",
//         pathname: "/images/**",
//       },
//     ],
//   },

//   webpack: (config) => {
//     config.infrastructureLogging = { level: "warn" };
//     return config;
//   },
// };

// export default nextConfig;
