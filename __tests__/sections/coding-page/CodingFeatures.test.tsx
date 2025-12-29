import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import CodingFeatures from "@/components/sections/coding-page/CodingFeatures";

// Mock Next.js Image
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('@/hooks/useMediaQuery', () => ({
    useMediaQuery: jest.fn(),
}));

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

jest.mock('@/components/elements/grid/BentoBoxItem', () => ({
    __esModule: true,
    default: ({ title, description, hasBug }: any) => (
        <div data-testid="bento-box-item">
            <span>{title}</span>
            <span>{description}</span>
            {hasBug && <span data-testid="bug-indicator">🐛</span>}
        </div>
    ),
}));

describe('CodingFeatures', () => {
    const mockTranslations: Record<string, string> = {
        infoTag: 'Info Tag Text',
        title: 'Coding Features Title',
        description: 'Coding Features Description',
        BENTO_1_TITLE: 'Bento 1 Title',
        BENTO_1_DESC: 'Bento 1 Description',
        BENTO_2_TITLE: 'Bento 2 Title',
        BENTO_2_DESC: 'Bento 2 Description',
        BENTO_3_TITLE: 'Bento 3 Title',
        BENTO_3_DESC: 'Bento 3 Description',
        BENTO_4_TITLE: 'Bento 4 Title',
        BENTO_4_DESC: 'Bento 4 Description',
        BENTO_5_TITLE: 'Bento 5 Title',
        BENTO_5_DESC: 'Bento 5 Description',
    };

    const mockTFunction = (key: string) => mockTranslations[key] || key;

    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue(mockTFunction);
        (useMediaQuery as jest.Mock).mockReturnValue(false);

        // Mock Math.random to return predictable values
        jest.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render the section with correct structure', () => {
        render(<CodingFeatures />);

        const section = document.querySelector('section[id]');
        expect(section).toBeInTheDocument();
        expect(section).toHaveAttribute('id', 'features');
    });

    it('should render background image', () => {
        render(<CodingFeatures />);

        const bgImage = screen.getByAltText('Grid BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(bgImage).toBeInTheDocument();
        expect(bgImage).toHaveAttribute('src', '/images/bg/grid-bg-1920w.avif');
    });

    it('should render info tag with translated text', () => {
        render(<CodingFeatures />);

        expect(screen.getByText('Info Tag Text')).toBeInTheDocument();
    });

    it('should render title with translated text', () => {
        render(<CodingFeatures />);

        expect(screen.getByText(/Coding Features Title/)).toBeInTheDocument();
    });

    it('should render description with translated text', () => {
        render(<CodingFeatures />);

        expect(screen.getByText('Coding Features Description')).toBeInTheDocument();
    });

    it('should render all 5 BentoBoxItems', () => {
        render(<CodingFeatures />);

        const bentoBoxes = screen.getAllByTestId('bento-box-item');
        expect(bentoBoxes).toHaveLength(5);
    });

    it('should render BentoBoxItem 1 with correct props', () => {
        render(<CodingFeatures />);

        expect(screen.getByText('Bento 1 Title')).toBeInTheDocument();
        expect(screen.getByText('Bento 1 Description')).toBeInTheDocument();
    });

    it('should render BentoBoxItem 2 with correct props', () => {
        render(<CodingFeatures />);

        expect(screen.getByText('Bento 2 Title')).toBeInTheDocument();
        expect(screen.getByText('Bento 2 Description')).toBeInTheDocument();
    });

    it('should render BentoBoxItem 3 with correct props', () => {
        render(<CodingFeatures />);

        expect(screen.getByText('Bento 3 Title')).toBeInTheDocument();
        expect(screen.getByText('Bento 3 Description')).toBeInTheDocument();
    });

    it('should render BentoBoxItem 4 with correct props', () => {
        render(<CodingFeatures />);

        expect(screen.getByText('Bento 4 Title')).toBeInTheDocument();
        expect(screen.getByText('Bento 4 Description')).toBeInTheDocument();
    });

    it('should render BentoBoxItem 5 with correct props', () => {
        render(<CodingFeatures />);

        expect(screen.getByText('Bento 5 Title')).toBeInTheDocument();
        expect(screen.getByText('Bento 5 Description')).toBeInTheDocument();
    });

    it('should assign bug to random BentoBoxItem based on Math.random', () => {
        // Math.random returns 0.5, so floor(0.5 * 5) = 2 (third item, index 2)
        render(<CodingFeatures />);

        const bugIndicators = screen.getAllByTestId('bug-indicator');
        expect(bugIndicators).toHaveLength(1);
    });

    it('should assign bug to first item when Math.random returns 0', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0);

        render(<CodingFeatures />);

        const bugIndicators = screen.getAllByTestId('bug-indicator');
        expect(bugIndicators).toHaveLength(1);
    });

    it('should assign bug to last item when Math.random returns 0.99', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.99);

        render(<CodingFeatures />);

        const bugIndicators = screen.getAllByTestId('bug-indicator');
        expect(bugIndicators).toHaveLength(1);
    });

    it('should use different animation for BentoBoxItem 3 when is2XL is true', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        render(<CodingFeatures />);

        // Component should render without errors with different animation
        expect(screen.getByText('Bento 3 Title')).toBeInTheDocument();
    });

    it('should use different animation for BentoBoxItem 3 when is2XL is false', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(false);

        render(<CodingFeatures />);

        // Component should render without errors with different animation
        expect(screen.getByText('Bento 3 Title')).toBeInTheDocument();
    });

    it('should use different animation for BentoBoxItem 5 when is2XL is true', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        render(<CodingFeatures />);

        // Component should render without errors with different animation
        expect(screen.getByText('Bento 5 Title')).toBeInTheDocument();
    });

    it('should use different animation for BentoBoxItem 5 when is2XL is false', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(false);

        render(<CodingFeatures />);

        // Component should render without errors with different animation
        expect(screen.getByText('Bento 5 Title')).toBeInTheDocument();
    });

    it('should apply different heading classes when is2XL is true', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        render(<CodingFeatures />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
    });

    it('should apply different heading classes when is2XL is false', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(false);

        render(<CodingFeatures />);

        const heading = screen.getByRole('heading', { level: 2 });
        expect(heading).toBeInTheDocument();
    });
});