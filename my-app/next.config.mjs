/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add empty turbopack config to silence the warning
    turbopack: {},
    webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          use: ["@svgr/webpack"],
        });
        return config;
      },
};

export default nextConfig;
