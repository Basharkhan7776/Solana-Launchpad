/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during builds (optional, but keeps build fast)
  typescript: {
    ignoreBuildErrors: false, // Keep type checking for safety
  },
  // Fix workspace root warning
  output: 'standalone',
  outputFileTracingRoot: process.cwd(),

  webpack: (config, { isServer }) => {
    // Add fallbacks for Node.js modules not available in the browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Required for Solana web3.js
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // Suppress bigint warning from @solana/web3.js
    if (!isServer) {
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        { module: /node_modules\/@solana\/web3\.js/ },
      ];
    }

    return config;
  },
  transpilePackages: ['@solana/wallet-adapter-react', '@solana/wallet-adapter-react-ui'],
};

export default nextConfig;
