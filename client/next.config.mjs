import os from "node:os";

import isInsideContainer from "is-inside-container";

const isWindowsDevContainer = () =>
  os.release().toLowerCase().includes("microsoft") && isInsideContainer();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // Allow images from Django backend
      },
      {
        protocol: "https",
        hostname: "wajo.duck.ceo",
        port: "",
      },
      {
        protocol: "http",
        hostname: "wajo.duck.ceo",
        port: "",
      },
    ],
  },
  // dumb fix for windows docker
  webpack: isWindowsDevContainer()
    ? (config) => {
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
        };
        return config;
      }
    : undefined,
};

export default nextConfig;
