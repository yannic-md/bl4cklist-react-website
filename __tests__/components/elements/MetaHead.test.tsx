import {render} from '@testing-library/react';
import { useRouter } from 'next/router';
import MetaHead from "@/components/elements/MetaHead";

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('next/head', () => {
    return {
        __esModule: true,
        default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

describe('MetaHead', () => {
    const baseUrl = 'https://bl4cklist.de';
    const mockRouterBase = {
        pathname: '/',
        route: '/',
        query: {},
        push: jest.fn(),
        replace: jest.fn(),
        reload: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        prefetch: jest.fn(),
        beforePopState: jest.fn(),
        events: {
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
        },
        isFallback: false,
        isLocaleDomain: false,
        isReady: true,
        isPreview: false,
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render meta tags with German locale and homepage path', () => {
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouterBase,
            locale: 'de',
            asPath: '/',
        });

        render(<MetaHead title="Test Title" description="Test Description" />);

        expect(document.title).toBe('Test Title | Bl4cklist.de ~ Gaming-& Coding Discord-Server');

        const descriptionMeta = document.querySelector('meta[name="description"]');
        const canonical = document.querySelector('link[rel="canonical"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');

        expect(descriptionMeta?.getAttribute('content')).toBe('Test Description');
        expect(canonical?.getAttribute('href')).toBe(`${baseUrl}`);
        expect(ogUrl?.getAttribute('content')).toBe(`${baseUrl}`);
    });

    it('should render meta tags with English locale and homepage path', () => {
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouterBase,
            locale: 'en',
            asPath: '/',
        });

        render(<MetaHead title="Test Title" description="Test Description" />);

        const canonical = document.querySelector('link[rel="canonical"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');

        expect(canonical?.getAttribute('href')).toBe(`${baseUrl}/en`);
        expect(ogUrl?.getAttribute('content')).toBe(`${baseUrl}/en`);
    });

    it('should render meta tags with German locale and nested path', () => {
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouterBase,
            locale: 'de',
            asPath: '/about/team',
        });

        render(<MetaHead title="Team" description="Our Team" />);

        const canonical = document.querySelector('link[rel="canonical"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');
        const hreflangDe = document.querySelector('link[rel="alternate"][hrefLang="de"]');
        const hreflangEn = document.querySelector('link[rel="alternate"][hrefLang="en"]');

        expect(canonical?.getAttribute('href')).toBe(`${baseUrl}/about/team`);
        expect(ogUrl?.getAttribute('content')).toBe(`${baseUrl}/about/team`);
        expect(hreflangDe?.getAttribute('href')).toBe(`${baseUrl}/about/team`);
        expect(hreflangEn?.getAttribute('href')).toBe(`${baseUrl}/en/about/team`);
    });

    it('should render meta tags with English locale and nested path', () => {
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouterBase,
            locale: 'en',
            asPath: '/about/team',
        });

        render(<MetaHead title="Team" description="Our Team" />);

        const canonical = document.querySelector('link[rel="canonical"]');
        const ogUrl = document.querySelector('meta[property="og:url"]');

        expect(canonical?.getAttribute('href')).toBe(`${baseUrl}/en/about/team`);
        expect(ogUrl?.getAttribute('content')).toBe(`${baseUrl}/en/about/team`);
    });

    it('should render all Open Graph meta tags correctly', () => {
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouterBase,
            locale: 'de',
            asPath: '/test',
        });

        render(<MetaHead title="OG Test" description="OG Description" />);

        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const ogSiteName = document.querySelector('meta[property="og:site_name"]');
        const ogType = document.querySelector('meta[property="og:type"]');
        const ogImage = document.querySelector('meta[property="og:image"]');
        const ogImageAlt = document.querySelector('meta[property="og:image:alt"]');

        expect(ogTitle?.getAttribute('content')).toBe('OG Test | Bl4cklist.de ~ Gaming-& Coding Discord-Server');
        expect(ogDescription?.getAttribute('content')).toBe('OG Description');
        expect(ogSiteName?.getAttribute('content')).toBe('Bl4cklist');
        expect(ogType?.getAttribute('content')).toBe('website');
        expect(ogImage?.getAttribute('content')).toBe(`${baseUrl}/images/brand/logo-96w.webp`);
        expect(ogImageAlt?.getAttribute('content')).toBe('Bl4cklist Logo - Gaming-& Coding Discord-Server');
    });

    it('should render all Twitter meta tags correctly', () => {
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouterBase,
            locale: 'de',
            asPath: '/test',
        });

        render(<MetaHead title="Twitter Test" description="Twitter Description" />);

        const twitterCard = document.querySelector('meta[name="twitter:card"]');
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        const twitterImage = document.querySelector('meta[name="twitter:image"]');

        expect(twitterCard?.getAttribute('content')).toBe('summary');
        expect(twitterTitle?.getAttribute('content')).toBe('Twitter Test | Bl4cklist.de ~ Gaming-& Coding Discord-Server');
        expect(twitterDescription?.getAttribute('content')).toBe('Twitter Description');
        expect(twitterImage?.getAttribute('content')).toBe(`${baseUrl}/images/brand/logo-96w.webp`);
    });

    it('should render all hreflang alternate links correctly', () => {
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouterBase,
            locale: 'de',
            asPath: '/contact',
        });

        render(<MetaHead title="Contact" description="Contact Us" />);

        const hreflangDe = document.querySelector('link[rel="alternate"][hrefLang="de"]');
        const hreflangEn = document.querySelector('link[rel="alternate"][hrefLang="en"]');
        const hreflangDefault = document.querySelector('link[rel="alternate"][hrefLang="x-default"]');

        expect(hreflangDe?.getAttribute('href')).toBe(`${baseUrl}/contact`);
        expect(hreflangEn?.getAttribute('href')).toBe(`${baseUrl}/en/contact`);
        expect(hreflangDefault?.getAttribute('href')).toBe(`${baseUrl}/contact`);
    });
});