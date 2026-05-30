import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  sassOptions: {
    includePaths: ["./node_modules"],
    silenceDeprecations: ["legacy-js-api"],
  },
};

export default nextConfig;
