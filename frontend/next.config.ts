import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      port: "dashboard-WVd1lFp4IL2g2ulSuox74aJ0Bka0DV.png",
      pathname: "**",
    },
    {
      protocol: "https",
      hostname: "avatars.githubusercontent.com",
      port: "",
      pathname: "**",
    },
  ],
};

export default nextConfig;
