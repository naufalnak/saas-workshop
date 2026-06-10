// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: "BengkelHub — Workshop Management",
  description:
    "Platform SaaS manajemen bengkel kendaraan — kelola order servis, invoice digital, dan pembayaran dalam satu tempat. Dilengkapi portal booking untuk pelanggan.",
  openGraph: {
    title: "BengkelHub — Workshop Management",
    description:
      "Platform SaaS manajemen bengkel kendaraan — kelola order servis, invoice digital, dan pembayaran dalam satu tempat. Dilengkapi portal booking untuk pelanggan.",
    images: ["/img/preview.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
