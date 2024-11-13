/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      // Fallback configurations for browser polyfills
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        buffer: 'buffer',
        fs: false,
        net: false,
        tls: false,
        path: false,
      };

      // Add plugins using the webpack instance passed as a parameter
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );

      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /node:crypto/,
          'crypto-browserify'
        )
      );
    }

    return config;
  },
  // Other Next.js config options
  images: {
    unoptimized: true,
  },
};

export default nextConfig;