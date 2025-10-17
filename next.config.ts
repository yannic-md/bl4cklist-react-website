import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    trailingSlash: true,
    i18n: {
        locales: ['de', 'en'],
        defaultLocale: 'de'
    },
    images: {
        remotePatterns: [{ hostname: 'cdn.discordapp.com' }],
    },

    async redirects() {
        return [
            {source: '/changelog', destination: '/discord/changelog', permanent: true},
            {source: '/clank-bot', destination: '/discord/clank-bot', permanent: true},
            {source: '/community', destination: '/discord/community', permanent: true},
            {source: '/leaderboard', destination: '/discord/leaderboard', permanent: true},
            {source: '/tech-coding', destination: '/discord/tech-coding', permanent: true},
        ]
    },
};

export default nextConfig;
