/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://bl4cklist.de',
    generateRobotsTxt: true,
    sitemapSize: 7000,
    alternateRefs: [
        {
            href: 'https://bl4cklist.de/en',
            hreflang: 'en',
        },
        {
            href: 'https://bl4cklist.de',
            hreflang: 'de',
        },
    ],
    exclude: ['/404', '/en/404'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
            },
        ],
    },
}