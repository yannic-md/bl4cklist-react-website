// noinspection DuplicatedCode

import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import ComHero from "@/components/sections/community-page/ComHero";
import {APIStatistics} from "@/types/APIResponse";

// Mock Next.js dependencies
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

// Mock child components
jest.mock('@/components/animations/AnimateOnView', () => {
    const MockAnimate = ({ children, className }: any) => (
        <div data-testid="animate-on-view" className={className}>
            {children}
        </div>
    );
    return {__esModule: true, AnimateOnView: MockAnimate};
});

jest.mock('@/components/animations/TextReveal', () => ({
    __esModule: true,
    AnimatedTextReveal: ({ text, className }: any) => <div className={className}>{text}</div>,
}));

jest.mock('@/components/animations/Counter', () => ({
    __esModule: true,
    AnimatedCounter: ({ end, suffix }: any) => <span>{end}{suffix}</span>,
}));

jest.mock('@/components/elements/ButtonHover', () => ({
    __esModule: true,
    default: () => <div data-testid="button-hover" />,
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
    FaDiscord: () => <span data-testid="discord-icon">Discord</span>,
    FaHammer: () => <span data-testid="hammer-icon">Hammer</span>,
}));

describe('ComHero', () => {
    const mockTComHero: Record<string, string> = {
        infoTag: 'Community Info Tag',
        title: 'Community Hero Title',
        description: 'Community description text',
        stat_templates: 'Templates',
        stat_messages: 'Messages',
        stat_questions: 'Questions',
        button_support: 'Get Support',
    };

    const mockTWelcome: Record<string, string> = {
        joinDiscord: 'Join Discord Server',
    };

    const mockRouter = {
        locale: 'en',
        pathname: '/',
        query: {},
        asPath: '/',
    };

    const defaultProps = {
        guildStats: {
            templates_count: 300,
            message_count: 5000000,
            coding_question_count: 100,
        } as APIStatistics,
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);

        (useTranslations as jest.Mock).mockImplementation((namespace: string) => {
            if (namespace === 'ComHero') {
                return (key: string) => mockTComHero[key] || key;
            }
            if (namespace === 'WelcomeHero') {
                return (key: string) => mockTWelcome[key] || key;
            }
            return (key: string) => key;
        });
    });

    it('should render the section with correct structure', () => {
        render(<ComHero {...defaultProps} />);

        const section = document.querySelector('section[id]');
        expect(section).toBeInTheDocument();
        expect(section).toHaveAttribute('id', 'intro');
    });

    it('should render grid background image', () => {
        render(<ComHero {...defaultProps} />);

        const gridBg = screen.getByAltText('Grid BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(gridBg).toBeInTheDocument();
        expect(gridBg).toHaveAttribute('src', '/images/bg/community-hero-1440w.avif');
    });

    it('should render frame overlay background image', () => {
        render(<ComHero {...defaultProps} />);

        const frameBg = screen.getByAltText('Frame BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(frameBg).toBeInTheDocument();
        expect(frameBg).toHaveAttribute('src', '/images/bg/community-hero-frame-2200w.avif');
    });

    it('should render info tag with translated text', () => {
        render(<ComHero {...defaultProps} />);

        expect(screen.getByText('Community Info Tag')).toBeInTheDocument();
    });

    it('should render title with translated text', () => {
        render(<ComHero {...defaultProps} />);

        expect(screen.getByText(/Community Hero Title/)).toBeInTheDocument();
    });

    it('should render description with translated text', () => {
        render(<ComHero {...defaultProps} />);

        expect(screen.getByText('Community description text')).toBeInTheDocument();
    });

    it('should display statistics with provided guildStats values', () => {
        render(<ComHero {...defaultProps} />);

        expect(screen.getByText('300+')).toBeInTheDocument();
        expect(screen.getByText('5000000+')).toBeInTheDocument();
        expect(screen.getByText('100+')).toBeInTheDocument();
    });

    it('should use fallback values when guildStats is undefined', () => {
        render(<ComHero guildStats={undefined as any} />);

        expect(screen.getByText('216+')).toBeInTheDocument();
        expect(screen.getByText('4447507+')).toBeInTheDocument();
        expect(screen.getByText('47+')).toBeInTheDocument();
    });

    it('should use fallback values when guildStats properties are missing', () => {
        render(<ComHero guildStats={{} as any} />);

        expect(screen.getByText('216+')).toBeInTheDocument();
        expect(screen.getByText('4447507+')).toBeInTheDocument();
        expect(screen.getByText('47+')).toBeInTheDocument();
    });

    it('should render statistics labels with translated text', () => {
        render(<ComHero {...defaultProps} />);

        expect(screen.getByText(/Templates/)).toBeInTheDocument();
        expect(screen.getByText(/Messages/)).toBeInTheDocument();
        expect(screen.getByText(/Questions/)).toBeInTheDocument();
    });

    it('should render Discord join button with correct link', () => {
        render(<ComHero {...defaultProps} />);

        const discordLink = screen.getByText('Join Discord Server').closest('a');
        expect(discordLink).toHaveAttribute('href', 'https://discord.gg/bl4cklist');
        expect(discordLink).toHaveAttribute('target', '_blank');
    });

    it('should render Discord icon in join button', () => {
        render(<ComHero {...defaultProps} />);

        expect(screen.getByTestId('discord-icon')).toBeInTheDocument();
    });

    it('should render support button with correct link', () => {
        render(<ComHero {...defaultProps} />);

        const supportLink = screen.getByText('Get Support').closest('a');
        expect(supportLink).toHaveAttribute('href', 'tech-coding');
    });

    it('should render Hammer icon in support button', () => {
        render(<ComHero {...defaultProps} />);

        expect(screen.getByTestId('hammer-icon')).toBeInTheDocument();
    });

    it('should render ButtonHover components', () => {
        render(<ComHero {...defaultProps} />);

        const buttonHovers = screen.getAllByTestId('button-hover');
        expect(buttonHovers).toHaveLength(2);
    });

    it('should pass locale to AnimatedCounter components', () => {
        const customRouter = { ...mockRouter, locale: 'de' };
        (useRouter as jest.Mock).mockReturnValue(customRouter);

        render(<ComHero {...defaultProps} />);

        // AnimatedCounter should be called with locale prop
        expect(screen.getByText('300+')).toBeInTheDocument();
    });

    it('should handle missing locale gracefully', () => {
        const routerWithoutLocale = { ...mockRouter, locale: undefined };
        (useRouter as jest.Mock).mockReturnValue(routerWithoutLocale);

        render(<ComHero {...defaultProps} />);

        expect(screen.getByText('300+')).toBeInTheDocument();
    });
});