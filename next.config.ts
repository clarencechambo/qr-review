import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // exceljs is a Node library used only by the report export route; load it at
  // runtime instead of bundling it.
  serverExternalPackages: ["exceljs"],
};

export default nextConfig;
