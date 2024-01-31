/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '',
};

if (process.env.NODE_ENV === 'production') {
  nextConfig.basePath = '/projects/disk-on';
  nextConfig.images = {
    unoptimized: true,
  };
}

module.exports = nextConfig;
