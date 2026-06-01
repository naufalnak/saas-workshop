import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const securityHeaders = [
  // Cegah halaman di-embed di iframe (clickjacking)
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Cegah browser salah interpret tipe file (MIME sniffing)
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Batasi info referrer yang dikirim ke site lain
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Matikan fitur browser yang tidak dipakai
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Paksa HTTPS (aktif setelah deploy production)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content Security Policy
  // Sesuaikan jika kamu pakai CDN atau embed dari domain lain
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Script: izinkan inline (Next.js butuh ini) + Sentry CDN
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://browser.sentry-cdn.com",
      // Style: izinkan inline (Tailwind butuh ini)
      "style-src 'self' 'unsafe-inline'",
      // Gambar: izinkan dari Unsplash (sesuai remotePatterns) + data URI
      "img-src 'self' data: https://images.unsplash.com",
      // Font: hanya dari domain sendiri
      "font-src 'self'",
      // Connect: API sendiri + Sentry + Upstash
      "connect-src 'self' https://*.sentry.io https://*.upstash.io",
      // Frame: tidak izinkan embed apapun
      "frame-src 'none'",
      // Object: tidak izinkan plugin (Flash, dll)
      "object-src 'none'",
      // Base URI: hanya domain sendiri
      "base-uri 'self'",
      // Form action: hanya submit ke domain sendiri
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["bcryptjs", "@prisma/client"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Terapkan ke semua route
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "naufal-andresya-kholish",
  project: "workshop-saas",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
