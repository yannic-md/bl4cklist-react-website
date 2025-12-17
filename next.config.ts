import type { NextConfig } from "next";

const isDev: boolean = process.env.NODE_ENV === 'development';

const cspHeader: string = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://pagead2.googlesyndication.com https://adservice.google.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://cdn.discordapp.com https://i.imgur.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src https://challenges.cloudflare.com;
    connect-src 'self' https://api.clank.dev ${isDev ? 'http://localhost:8081' : ''};
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
    trailingSlash: true,
    i18n: {
        locales: ['de', 'en'],
        defaultLocale: 'de'
    },
    images: {
        remotePatterns: [{ hostname: 'cdn.discordapp.com' }],
    },

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: cspHeader.replace(/\s{2,}/g, ' ').trim()
                    },
                ],
            },
        ];
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
