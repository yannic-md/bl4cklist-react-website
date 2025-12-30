import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import {useMediaQuery} from '@/hooks/useMediaQuery';
import ClankHero from "@/components/sections/clank-page/ClankHero";

// Mock Setup
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('@/hooks/useMediaQuery', () => ({
    useMediaQuery: jest.fn(),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

jest.mock('@/components/animations/TextReveal', () => ({
    __esModule: true,
    AnimatedTextReveal: ({ text, className }: any) => <div className={className}>{text}</div>,
}));

jest.mock('@/components/elements/ButtonHover', () => ({
    __esModule: true,
    default: () => <div data-testid="button-hover" />,
}));

jest.mock('react-icons/fa', () => ({
    FaRobot: () => <div data-testid="fa-robot" />,
}));

describe('ClankHero', () => {
    const mockTranslations = {
        infoTag: 'Test Info Tag',
        title: 'Test Title',
        description: 'Test Description',
        inviteButton: 'Invite Bot',
    };

    const mockTClankBot = jest.fn((key: string) => mockTranslations[key as keyof typeof mockTranslations]);

    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue(mockTClankBot);
        (useMediaQuery as jest.Mock).mockReturnValue(false);
    });

    it('should render section with correct id', () => {
        render(<ClankHero />);
        const section = document.querySelector("section[id]");
        expect(section).toHaveAttribute('id', 'start');
    });

    it('should render animated info tag with correct text', () => {
        render(<ClankHero />);
        expect(screen.getByText('Test Info Tag')).toBeInTheDocument();
    });

    it('should render title with robot emoji and text', () => {
        render(<ClankHero />);
        const title = screen.getByRole('heading', { level: 2 });
        expect(title).toBeInTheDocument();
        expect(title.textContent).toContain('🤖');
        expect(title.textContent).toContain('Test Title');
    });

    it('should render description text', () => {
        render(<ClankHero />);
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('should render invite button with correct href and target', () => {
        render(<ClankHero />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', 'https://bl4cklist.de/invites/clank');
        expect(link).toHaveAttribute('target', '_blank');
    });

    it('should render invite button with FaRobot icon', () => {
        render(<ClankHero />);
        expect(screen.getByTestId('fa-robot')).toBeInTheDocument();
    });

    it('should render invite button text', () => {
        render(<ClankHero />);
        const button = screen.getByRole('button');
        expect(button.textContent).toContain('Invite Bot');
    });

    it('should render ButtonHover component', () => {
        render(<ClankHero />);
        expect(screen.getByTestId('button-hover')).toBeInTheDocument();
    });

    it('should render dashboard image with correct attributes', () => {
        render(<ClankHero />);
        const image = screen.getByAltText(
            'Clank Discord Bot Dashboard - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server'
        );
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', '/images/bg/clank-discord-bot-dashboard-1995w.avif');
        expect(image).toHaveAttribute('width', '1995');
        expect(image).toHaveAttribute('height', '814');
        expect(image).toHaveAttribute('loading', 'eager');
        expect(image).toHaveAttribute('fetchpriority', 'high');
        expect(image).toHaveAttribute('data-cursor-special');
    });

    it('should apply head_border class when is2XL is true', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);
        render(<ClankHero />);
        const title = screen.getByRole('heading', { level: 2 });
        expect(title.className).toContain('head_border');
        expect(title.className).not.toContain('head_border_center');
    });

    it('should apply head_border_center class when is2XL is false', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(false);
        render(<ClankHero />);
        const title = screen.getByRole('heading', { level: 2 });
        expect(title.className).toContain('head_border_center');
    });

    it('should call translation function for all required keys', () => {
        render(<ClankHero />);
        expect(mockTClankBot).toHaveBeenCalledWith('infoTag');
        expect(mockTClankBot).toHaveBeenCalledWith('title');
        expect(mockTClankBot).toHaveBeenCalledWith('description');
        expect(mockTClankBot).toHaveBeenCalledWith('inviteButton');
    });
});