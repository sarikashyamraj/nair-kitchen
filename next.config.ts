import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nuflwpefgwelcshqsacb.supabase.co",
        pathname:
          "/storage/v1/object/public/profile-images/**",
      },
    ],
  },
};

export default nextConfig;