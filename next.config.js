require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Reference a variable that was defined in the .env file and make it available at Build Time
    API_ENDPOINT: process.env.API_ENDPOINT,
  },
  reactStrictMode: false,

  // ▼ この1行を追加：Next.jsをstandalone出力モードにする ▼
  output: 'standalone',
};

module.exports = nextConfig;
