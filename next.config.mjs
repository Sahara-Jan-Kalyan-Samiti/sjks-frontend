/** @type {import('next').NextConfig} */

// In development, forward /api to the local sjks-backend so NEXT_PUBLIC_API_URL can stay empty.
const devApiTarget = process.env.API_DEV_PROXY || "http://localhost:8080";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // a self-contained server for Docker / Cloud Run (see Dockerfile)
  output: "standalone",
  // ESLint runs as its own step in CI (npm run lint)
  eslint: { ignoreDuringBuilds: true },

  async rewrites() {
    const useDevProxy = process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL;
    return [
      // photos moved from /images to /assets/images; addresses already saved in the database (awards, gallery) keep working
      { source: "/images/:path*", destination: "/assets/images/:path*" },
      ...(useDevProxy ? [{ source: "/api/:path*", destination: `${devApiTarget}/api/:path*` }] : [])
    ];
  },

  async headers() {
    const longCache = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/assets/:path*", headers: longCache },
      { source: "/documents/:path*", headers: longCache }
    ];
  }
};

export default nextConfig;
