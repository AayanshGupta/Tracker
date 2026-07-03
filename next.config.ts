import type { NextConfig } from "next";
import path from "node:path";

const securityHeaders = [
  // Prevents the page from being embedded in an iframe (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },
  // Prevents browsers from MIME-sniffing the content type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Controls how much referrer info is sent with requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disables browser features that the app doesn't need
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  },
  // Basic Content Security Policy
  // Adjust 'connect-src' if you add external API calls
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-* required for Next.js dev & RSC
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; ")
  },
  // Force HTTPS (1 year, includes subdomains)
  // Only active once deployed — browsers ignore on localhost
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload"
  },
];

const nextConfig: NextConfig = {
  // Enable fully typed route links (Next.js experimental typed routes)
  experimental: {
    typedRoutes: true,
  },

  // Required for correct output-file tracing during Docker/serverless deploys
  outputFileTracingRoot: path.join(process.cwd()),

  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
