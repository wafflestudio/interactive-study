/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
};

if (process.env.NODE_ENV === 'production') {
  nextConfig.basePath = '/projects/paper';
  nextConfig.images = {
    unoptimized: true,
  };
}

module.exports = nextConfig;
