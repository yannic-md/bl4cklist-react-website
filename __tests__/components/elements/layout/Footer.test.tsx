import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import Footer from "@/components/elements/layout/Footer";

// Mock Setup
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ href, children, className, target, 'aria-label': ariaLabel }: any) => (
        <a href={href} className={className} target={target} aria-label={ariaLabel}>
            {children}
        </a>
    ),
}));

jest.mock('@/components/animations/AnimateOnView', () => {
    const MockAnimate = ({ children, className }: any) => (
        <div data-testid="animate-on-view" className={className}>
            {children}
        </div>
    );
    return {__esModule: true, AnimateOnView: MockAnimate};
});

jest.mock('react-icons/fa', () => ({
    FaTiktok: () => <span>TikTok Icon</span>,
    FaInstagram: () => <span>Instagram Icon</span>,
    FaYoutube: () => <span>YouTube Icon</span>,
    FaGithub: () => <span>Github Icon</span>,
    FaDiscord: () => <span>Discord Icon</span>,
}));

describe('Footer', () => {
    const mockTranslations = {
        description: 'Test description for footer',
        copyright: 'All rights reserved.',
        imprint: 'Imprint',
        contact: 'Contact',
    };

    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue((key: string) => mockTranslations[key as keyof typeof mockTranslations]);
    });

    it('should render footer with logo and description', () => {
        render(<Footer />);

        const logo = screen.getByAltText(/Logo Footer/i);
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', '/images/brand/logo-64w.avif');
        expect(logo).toHaveAttribute('width', '64');
        expect(logo).toHaveAttribute('height', '64');

        expect(screen.getByText('Test description for footer')).toBeInTheDocument();
    });

    it('should render all social media links with correct hrefs', () => {
        render(<Footer />);

        const tiktokLink = screen.getByLabelText('TikTok');
        expect(tiktokLink).toHaveAttribute('href', 'https://www.tiktok.com/@discord.bl4cklist');
        expect(tiktokLink).toHaveAttribute('target', '_blank');

        const instagramLink = screen.getByLabelText('Instagram');
        expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/discord.bl4cklist/');
        expect(instagramLink).toHaveAttribute('target', '_blank');

        const youtubeLink = screen.getByLabelText('YouTube');
        expect(youtubeLink).toHaveAttribute('href', 'https://www.youtube.com/@razzerde');
        expect(youtubeLink).toHaveAttribute('target', '_blank');

        const githubLink = screen.getByLabelText('Github');
        expect(githubLink).toHaveAttribute('href', 'https://github.com/yannic-md?tab=repositories');
        expect(githubLink).toHaveAttribute('target', '_blank');

        const discordLink = screen.getByLabelText('Discord');
        expect(discordLink).toHaveAttribute('href', 'https://discord.gg/bl4cklist');
        expect(discordLink).toHaveAttribute('target', '_blank');
    });

    it('should render copyright notice with current year', () => {
        render(<Footer />);

        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
        expect(screen.getByText(/All rights reserved./i)).toBeInTheDocument();
    });

    it('should render Bl4cklist.de link in copyright section', () => {
        render(<Footer />);

        const bl4cklistLink = screen.getByRole('link', { name: /Bl4cklist\.de/i });
        expect(bl4cklistLink).toHaveAttribute('href', '/');
    });

    it('should render imprint and contact links', () => {
        render(<Footer />);

        const imprintLink = screen.getByRole('link', { name: 'Imprint' });
        expect(imprintLink).toHaveAttribute('href', '/imprint');

        const contactLink = screen.getByRole('link', { name: 'Contact' });
        expect(contactLink).toHaveAttribute('href', '/contact');
    });

    it('should render decorational moon image', () => {
        render(<Footer />);

        const moonImage = screen.getByAltText(/Moon ~ Bl4cklist/i);
        expect(moonImage).toBeInTheDocument();
        expect(moonImage).toHaveAttribute('src', '/images/bg/moon.svg');
        expect(moonImage).toHaveAttribute('width', '192');
        expect(moonImage).toHaveAttribute('height', '192');
    });

    it('should call useTranslations with correct namespace', () => {
        render(<Footer />);

        expect(useTranslations).toHaveBeenCalledWith('Footer');
    });
});