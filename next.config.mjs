/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@ant-design/icons-svg', 'rc-util','rc-pagination','rc-picker'],
};

export default nextConfig;