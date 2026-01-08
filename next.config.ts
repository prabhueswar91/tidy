import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  //  images: {
  //   // remotePatterns: [
  //   //   {
  //   //     protocol: "https",
  //   //     hostname: "api.telegram.org",
  //   //     port: "",
  //   //     pathname: "/file/**", // allow Telegram bot files
  //   //   },
  //   // ],
  //   domains: ['localhost', 'tidyzen.tidyonchain.com'],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.telegram.org",
        pathname: "/file/**", // allow all Telegram file URLs
      },
      {
        protocol: "https",
        hostname: "tidyzen.tidyonchain.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },

  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
