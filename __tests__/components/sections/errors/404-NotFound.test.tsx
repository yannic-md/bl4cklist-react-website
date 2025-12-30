import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import NotFound from "@/components/sections/errors/404-NotFound";
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
    default: ({ children, href }: any) => {
        return <a href={href}>{children}</a>;
    },
}));

jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

// Mock CSS modules
jest.mock("@/styles/components/index.module.css", () => ({
    __esModule: true,
    default: {
        hero_corner_shadow: 'hero_corner_shadow',
        hero_grid_bg: 'hero_grid_bg',
        hero_text_bg: 'hero_text_bg',
    },
}), { virtual: true });

jest.mock('@/styles/util/animations.module.css', () => ({
    __esModule: true,
    default: {
        animate_float_less: 'animate_float_less',
    },
}), { virtual: true });

jest.mock('@/styles/util/responsive.module.css', () => ({
    __esModule: true,
    default: {
        hero_main_gap: 'hero_main_gap',
    },
}), { virtual: true });

jest.mock('@/styles/util/colors.module.css', () => ({
    __esModule: true,
    default: {
        text_gradient_gray: 'text_gradient_gray',
    },
}), { virtual: true });

jest.mock('@/styles/buttons.module.css', () => ({
    __esModule: true,
    default: {
        white_gray: 'white_gray',
        black_purple: 'black_purple',
    },
}), { virtual: true });

// Mock ButtonHover component
jest.mock('@/components/elements/ButtonHover', () => ({
    __esModule: true,
    default: () => <div data-testid="button-hover" />,
}));

// Mock React Icons
jest.mock('react-icons/fa', () => ({
    FaDiscord: () => <span data-testid="discord-icon" />,
    FaHouse: () => <span data-testid="house-icon" />,
}));

describe('NotFound', () => {
    const mockTWelcome = jest.fn();
    const mockTErrors = jest.fn();

    beforeEach(() => {
        (useTranslations as jest.Mock).mockImplementation((namespace: string) => {
            if (namespace === 'WelcomeHero') return mockTWelcome;
            if (namespace === 'Errors') return mockTErrors;
            return jest.fn();
        });

        mockTWelcome.mockImplementation((key: string) => {
            if (key === 'joinDiscord') return 'Join Discord';
            if (key === 'memberCount') return 'Members';
            return key;
        });

        mockTErrors.mockImplementation((key: string) => {
            if (key === '404_DESC') return 'Page not found';
            if (key === 'goBack') return 'Go Back';
            return key;
        });
    });

    it('should render with guildStats provided', () => {
        const guildStats = {
            member_count: 5000,
            online_count: 1200,
        } as APIStatistics;

        render(<NotFound guildStats={guildStats} />);

        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByText('Page not found')).toBeInTheDocument();
        expect(screen.getByText(/1.200 Online/)).toBeInTheDocument();
        expect(screen.getByText(/5.000 Members/)).toBeInTheDocument();
    });

    it('should render with fallback values when guildStats is undefined', () => {
        render(<NotFound guildStats={undefined as any} />);

        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByText('890 Online')).toBeInTheDocument();
        expect(screen.getByText(/3.533 Members/)).toBeInTheDocument();
    });

    it('should render all planet images with correct attributes', () => {
        render(<NotFound guildStats={undefined as any} />);

        const jupiter = screen.getByAltText(/Jupiter Deco/i);
        const moon = screen.getByAltText(/Moon Deco/i);
        const uranus = screen.getByAltText(/Uranus Deco/i);
        const earth = screen.getByAltText(/Earth Deco/i);

        expect(jupiter).toHaveAttribute('src', '/images/bg/jupiter-128w.webp');
        expect(moon).toHaveAttribute('src', '/images/bg/moon.svg');
        expect(uranus).toHaveAttribute('src', '/images/bg/uranus-128w.webp');
        expect(earth).toHaveAttribute('src', '/images/bg/earth-128w.webp');
    });

    it('should render Discord join button with correct link', () => {
        render(<NotFound guildStats={undefined as any} />);

        const discordLink = screen.getByRole('link', { name: /Join Discord/i });
        expect(discordLink).toHaveAttribute('href', 'https://discord.gg/bl4cklist');
        expect(discordLink).toHaveAttribute('target', '_blank');
        expect(screen.getByTestId('discord-icon')).toBeInTheDocument();
    });

    it('should render ButtonHover components', () => {
        render(<NotFound guildStats={undefined as any} />);

        const buttonHovers = screen.getAllByTestId('button-hover');
        expect(buttonHovers).toHaveLength(2);
    });

    it('should use translations correctly', () => {
        render(<NotFound guildStats={undefined as any} />);

        expect(mockTWelcome).toHaveBeenCalledWith('joinDiscord');
        expect(mockTWelcome).toHaveBeenCalledWith('memberCount');
        expect(mockTErrors).toHaveBeenCalledWith('404_DESC');
        expect(mockTErrors).toHaveBeenCalledWith('goBack');
    });

    it('should format numbers with locale string', () => {
        const guildStats = {
            member_count: 1234567,
            online_count: 98765,
        } as APIStatistics;

        render(<NotFound guildStats={guildStats} />);

        expect(screen.getByText(/98.765 Online/)).toBeInTheDocument();
        expect(screen.getByText(/1.234.567 Members/)).toBeInTheDocument();
    });

    it('should render section with correct id', () => {
        const { container } = render(<NotFound guildStats={undefined as any} />);

        const section = container.querySelector('#discord-error-page');
        expect(section).toBeInTheDocument();
        expect(section?.tagName).toBe('SECTION');
    });
});