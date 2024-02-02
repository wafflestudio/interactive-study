/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
};

if (process.env.NODE_ENV === 'production') {
  nextConfig.basePath = '/projects/paper';
  nextConfig.output = 'export';
  nextConfig.images = {
    unoptimized: true,
  };
}

module.exports = nextConfig;
