import type { NextConfig } from "next";

const isDev: boolean = process.env.NODE_ENV === 'development';

const cspHeader: string = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://pagead2.googlesyndication.com https://ep2.adtrafficquality.google;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://cdn.discordapp.com https://i.imgur.com https://pagead2.googlesyndication.com https://ep1.adtrafficquality.google;
    font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src https://challenges.cloudflare.com https://pagead2.googlesyndication.com https://ep2.adtrafficquality.google https://f4f4a93ca9d0b19f388ece6c0641c694.safeframe.googlesyndication.com;
    connect-src 'self' https://api.clank.dev https://pagead2.googlesyndication.com https://ep1.adtrafficquality.google ${isDev ? 'http://localhost:8081' : ''};
    worker-src 'self' blob:;
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
    trailingSlash: true,
    i18n: {
        locales: ['de', 'en'],
        defaultLocale: 'de'
    },
    images: {
        remotePatterns: [{ hostname: 'cdn.discordapp.com' }, { hostname: 'i.imgur.com' }],
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
