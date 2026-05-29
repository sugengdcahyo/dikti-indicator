import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ["./node_modules"],
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default nextConfig;
