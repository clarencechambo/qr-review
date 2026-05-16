import QRCode from "qrcode";
import path from "path";
import fs from "fs";

const url = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/review`
  : "http://localhost:3000/review";

const outputPath = path.join(process.cwd(), "public", "qr-code.png");

async function generate() {
  await QRCode.toFile(outputPath, url, {
    width: 400,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });
  console.log(`QR code generated → ${outputPath}`);
  console.log(`Points to: ${url}`);
}

generate().catch((err) => {
  console.error("Failed to generate QR code:", err);
  process.exit(1);
});
