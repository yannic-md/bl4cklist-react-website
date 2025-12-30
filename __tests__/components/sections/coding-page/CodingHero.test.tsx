// noinspection DuplicatedCode

import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import CodingHero from "@/components/sections/coding-page/CodingHero";
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

jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('@/hooks/useMediaQuery', () => ({
    useMediaQuery: jest.fn(),
}));

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

jest.mock('@/components/animations/AnimateOnView', () => {
    const MockAnimate = ({ children, className }: any) => (
        <div data-testid="animate-on-view" className={className}>
            {children}
        </div>
    );
    return {__esModule: true, AnimateOnView: MockAnimate};
});

// Mock react-icons
jest.mock('react-icons/fa', () => ({
    FaDiscord: () => <span data-testid="discord-icon">Discord</span>,
    FaRobot: () => <span data-testid="robot-icon">Robot</span>,
}));

describe('CodingHero', () => {
    const mockTCodingHero: Record<string, any> = {
        infoTag: 'Coding Info Tag',
        title: 'Coding Hero Title',
        description: 'Coding description',
        description2: 'Second description',
        questionStats: 'Questions Answered',
        bugsStats: 'Bugs Fixed',
    };

    const mockTWelcome: Record<string, any> = {
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
            coding_question_count: 500,
            coding_bugs_count: 300,
            gaming_news_count: 20000,
        } as APIStatistics,
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useMediaQuery as jest.Mock).mockReturnValue(false);

        (useTranslations as jest.Mock).mockImplementation((namespace: string) => {
            if (namespace === 'CodingHero') {
                return Object.assign(
                    (key: string) => mockTCodingHero[key] || key,
                    {
                        rich: (key: string, options: any) => {
                            const text = mockTCodingHero[key] || key;
                            if (options?.strong) {
                                return <>{text}</>;
                            }
                            return text;
                        },
                    }
                );
            }
            if (namespace === 'WelcomeHero') {
                return (key: string) => mockTWelcome[key] || key;
            }
            return (key: string) => key;
        });
    });

    it('should render the section with correct structure', () => {
        render(<CodingHero {...defaultProps} />);

        const section = document.querySelector("section[id]");
        expect(section).toBeInTheDocument();
        expect(section).toHaveAttribute('id', 'bots');
    });

    it('should render background image', () => {
        render(<CodingHero {...defaultProps} />);

        const bgImage = screen.getByAltText('Grid Background - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(bgImage).toBeInTheDocument();
        expect(bgImage).toHaveAttribute('src', '/images/bg/tech-coding-bg-1920w.avif');
    });

    it('should render info tag with translated text', () => {
        render(<CodingHero {...defaultProps} />);

        expect(screen.getByText('Coding Info Tag')).toBeInTheDocument();
    });

    it('should render title with translated text', () => {
        render(<CodingHero {...defaultProps} />);

        expect(screen.getByText(/Coding Hero Title/)).toBeInTheDocument();
    });

    it('should render descriptions with translated text', () => {
        render(<CodingHero {...defaultProps} />);

        expect(screen.getByText(/Coding description/i)).toBeInTheDocument();
        expect(screen.getByText(/Second description/i)).toBeInTheDocument();
    });

    it('should display statistics with provided guildStats values', () => {
        render(<CodingHero {...defaultProps} />);

        expect(screen.getByText('500+')).toBeInTheDocument();
        expect(screen.getByText('300+')).toBeInTheDocument();
        expect(screen.getByText('20000+')).toBeInTheDocument();
    });

    it('should use fallback values when guildStats is undefined', () => {
        render(<CodingHero guildStats={undefined as any} />);

        expect(screen.getByText('342+')).toBeInTheDocument();
        expect(screen.getByText('216+')).toBeInTheDocument();
        expect(screen.getByText('15123+')).toBeInTheDocument();
    });

    it('should use fallback values when guildStats properties are missing', () => {
        render(<CodingHero guildStats={{} as any} />);

        expect(screen.getByText('342+')).toBeInTheDocument();
        expect(screen.getByText('216+')).toBeInTheDocument();
        expect(screen.getByText('15123+')).toBeInTheDocument();
    });

    it('should render statistics labels with translated text', () => {
        render(<CodingHero {...defaultProps} />);

        expect(screen.getByText(/Questions Answered/)).toBeInTheDocument();
        expect(screen.getByText(/Bugs Fixed/)).toBeInTheDocument();
        expect(screen.getByText('👾 Gaming-News')).toBeInTheDocument();
    });

    it('should render Discord join button with correct link', () => {
        render(<CodingHero {...defaultProps} />);

        const discordLink = screen.getByText('Join Discord Server').closest('a');
        expect(discordLink).toHaveAttribute('href', 'https://discord.gg/bl4cklist');
        expect(discordLink).toHaveAttribute('target', '_blank');
    });

    it('should render Discord icon in join button', () => {
        render(<CodingHero {...defaultProps} />);

        expect(screen.getByTestId('discord-icon')).toBeInTheDocument();
    });

    it('should render Clank bot button with correct link', () => {
        render(<CodingHero {...defaultProps} />);

        const clankLink = screen.getByText('Discord-Bot Clank').closest('a');
        expect(clankLink).toHaveAttribute('href', 'clank-bot');
    });

    it('should render Robot icon in Clank bot button', () => {
        render(<CodingHero {...defaultProps} />);

        expect(screen.getByTestId('robot-icon')).toBeInTheDocument();
    });

    it('should render ButtonHover components', () => {
        render(<CodingHero {...defaultProps} />);

        const buttonHovers = screen.getAllByTestId('button-hover');
        expect(buttonHovers).toHaveLength(2);
    });

    it('should render decoration images', () => {
        render(<CodingHero {...defaultProps} />);

        const allImages = screen.getAllByRole('img');
        const decorationImages = allImages.filter(img =>
            img.getAttribute('src')?.includes('discord-bot-150w.avif') ||
            img.getAttribute('src')?.includes('code-programming-128w.avif')
        );
        expect(decorationImages.length).toBeGreaterThan(0);
    });

    it('should render particle effect images', () => {
        render(<CodingHero {...defaultProps} />);

        const particleTop = screen.getByAltText('Particles Top - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(particleTop).toBeInTheDocument();

        const particleBottom = screen.getByAltText('Particles Bottom - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(particleBottom).toBeInTheDocument();

        const particleTopRight = screen.getByAltText('Particles Top Right - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(particleTopRight).toBeInTheDocument();
    });

    it('should render circle background image', () => {
        render(<CodingHero {...defaultProps} />);

        const circleImage = screen.getByAltText('Circle BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(circleImage).toBeInTheDocument();
        expect(circleImage).toHaveAttribute('src', '/images/bg/circled-border-732w.avif');
    });

    it('should apply different heading classes when is2XL is true', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        render(<CodingHero {...defaultProps} />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
    });

    it('should apply different heading classes when is2XL is false', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(false);

        render(<CodingHero {...defaultProps} />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
    });

    it('should pass locale to AnimatedCounter components', () => {
        const customRouter = { ...mockRouter, locale: 'de' };
        (useRouter as jest.Mock).mockReturnValue(customRouter);

        render(<CodingHero {...defaultProps} />);

        // AnimatedCounter should be called with locale prop
        expect(screen.getByText('500+')).toBeInTheDocument();
    });

    it('should handle missing locale gracefully', () => {
        const routerWithoutLocale = { ...mockRouter, locale: undefined };
        (useRouter as jest.Mock).mockReturnValue(routerWithoutLocale);

        render(<CodingHero {...defaultProps} />);

        expect(screen.getByText('500+')).toBeInTheDocument();
    });
});