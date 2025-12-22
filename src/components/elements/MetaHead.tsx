import Head from 'next/head';
import { useRouter } from 'next/router';
import {JSX} from "react";

interface MetaHeadProps {
    title: string;
    description: string;
}

/**
 * Renders SEO and social meta tags for a page.
 *
 * This React component generates HTML head elements including the document title,
 * meta description, canonical URL, hreflang links for language support, Open Graph
 * tags and Twitter card tags. It constructs absolute URLs using the current router
 * locale and path, and falls back to default branding assets when optional Open Graph
 * props are not provided.
 *
 * @param {Object} props - Component props.
 * @param {string} props.title - Page title used for `<title>` and social meta tags.
 * @param {string} props.description - Page description used for the meta description and social meta tags.
 * @returns {JSX.Element} - A React element containing head metadata for SEO and social sharing.
 */
export default function MetaHead({title, description}: MetaHeadProps): JSX.Element {
    const { locale, asPath } = useRouter();
    const baseUrl = "https://bl4cklist.de";

    // remove double slashes for homepage
    const cleanPath: string = asPath === '/' ? '' : asPath;
    const currentUrl = `${baseUrl}${locale === 'de' ? '' : '/en'}${cleanPath}`;
    const fullTitle = `${title} | Bl4cklist.de ~ Gaming-& Coding Discord-Server`;

    return (
        <Head>
            {/* Standard SEO */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={currentUrl} />

            {/* Language Support (Hreflang) */}
            <link rel="alternate" hrefLang="de" href={`${baseUrl}${cleanPath}`} />
            <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${cleanPath}`} />
            <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${cleanPath}`} />

            {/* Open Graph / Facebook / Discord */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:site_name" content="Bl4cklist" />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={`${baseUrl}/images/brand/logo-96w.webp`} />
            <meta property="og:image:alt" content="Bl4cklist Logo - Gaming-& Coding Discord-Server" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={`${baseUrl}/images/brand/logo-96w.webp`} />
        </Head>
    );
};