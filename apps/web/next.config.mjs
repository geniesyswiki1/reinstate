/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@reinstate/shared', '@reinstate/content'],
  outputFileTracingRoot: new URL('../../', import.meta.url).pathname,
  eslint: { ignoreDuringBuilds: false },
};

export default nextConfig;
