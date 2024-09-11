/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: config => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding')
        return config
        },
        pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
};

export default nextConfig;
