import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import TechCoding, {getStaticProps} from "@/pages/discord/tech-coding";

// Mock all dependencies
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('@/components/elements/MetaHead', () => ({
    __esModule: true,
    default: ({ title, description }: any) => (
        <div data-testid="meta-head">
            <span data-testid="meta-title">{title}</span>
            <span data-testid="meta-description">{description}</span>
        </div>
    ),
}));

jest.mock('@/components/elements/layout/Header', () => ({
    __esModule: true,
    default: () => <div data-testid="header">Header</div>,
}));

jest.mock('@/components/elements/layout/Footer', () => ({
    __esModule: true,
    default: () => <div data-testid="footer">Footer</div>,
}));

jest.mock('@/components/sections/coding-page/CodingHero', () => ({
    __esModule: true,
    default: ({ guildStats }: any) => (
        <div data-testid="coding-hero">
            CodingHero - {guildStats?.memberCount || 0}
        </div>
    ),
}));

jest.mock('@/components/sections/coding-page/CodingFeatures', () => ({
    __esModule: true,
    default: () => <div data-testid="coding-features">CodingFeatures</div>,
}));

jest.mock('@/components/sections/coding-page/CodingFAQ', () => ({
    __esModule: true,
    default: () => <div data-testid="coding-faq">CodingFAQ</div>,
}));

jest.mock('@/components/sections/TestimonialSection', () => ({
    __esModule: true,
    default: ({ position }: any) => (
        <div data-testid="testimonial-section">TestimonialSection - {position}</div>
    ),
}));

jest.mock('@/lib/api', () => ({
    fetchGuildStatistics: jest.fn(),
}));

describe('TechCoding Page', () => {
    const mockTranslations = jest.fn();
    const mockGuildStats = {
        memberCount: 1500,
        onlineCount: 300,
    } as any;

    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue(mockTranslations);
        mockTranslations.mockReturnValue('Test description');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render all main components correctly', () => {
        render(<TechCoding guildStats={mockGuildStats} />);

        expect(screen.getByTestId('meta-head')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('coding-hero')).toBeInTheDocument();
        expect(screen.getByTestId('coding-features')).toBeInTheDocument();
        expect(screen.getByTestId('coding-faq')).toBeInTheDocument();
        expect(screen.getByTestId('testimonial-section')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should pass correct title and description to MetaHead', () => {
        render(<TechCoding guildStats={mockGuildStats} />);

        expect(screen.getByTestId('meta-title')).toHaveTextContent('Hardware & Coding');
        expect(screen.getByTestId('meta-description')).toHaveTextContent('Test description');
    });

    it('should use CodingHero translation key', () => {
        render(<TechCoding guildStats={mockGuildStats} />);

        expect(useTranslations).toHaveBeenCalledWith('CodingHero');
        expect(mockTranslations).toHaveBeenCalledWith('description');
    });

    it('should pass guildStats to CodingHero component', () => {
        render(<TechCoding guildStats={mockGuildStats} />);

        const codingHero = screen.getByTestId('coding-hero');
        expect(codingHero).toHaveTextContent('1500');
    });

    it('should pass position prop to TestimonialSection', () => {
        render(<TechCoding guildStats={mockGuildStats} />);

        const testimonialSection = screen.getByTestId('testimonial-section');
        expect(testimonialSection).toHaveTextContent('right');
    });

    it('should render with undefined guildStats', () => {
        render(<TechCoding guildStats={undefined as any} />);

        expect(screen.getByTestId('coding-hero')).toBeInTheDocument();
        expect(screen.getByTestId('coding-hero')).toHaveTextContent('0');
    });

    it('should render sections in correct order within container', () => {
        const { container } = render(<TechCoding guildStats={mockGuildStats} />);

        const relativeDiv = container.querySelector('.relative');
        expect(relativeDiv).toBeInTheDocument();

        const children = Array.from(relativeDiv?.children || []);
        expect(children).toHaveLength(4);
    });

    describe('getStaticProps', () => {
        const { fetchGuildStatistics } = require('@/lib/api');

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return props with messages and guildStats for English locale', async () => {
            const mockGuildStats = { memberCount: 1500 };
            fetchGuildStatistics.mockResolvedValue(mockGuildStats);

            const result = await getStaticProps({ locale: 'en' } as any);

            expect(result.props).toHaveProperty('messages');
            expect(result.props.guildStats).toEqual(mockGuildStats);
            expect(result.revalidate).toBe(3600);
        });

        it('should return props with messages and guildStats for German locale', async () => {
            const mockGuildStats = { memberCount: 2000 };
            fetchGuildStatistics.mockResolvedValue(mockGuildStats);

            const result = await getStaticProps({ locale: 'de' } as any);

            expect(result.props).toHaveProperty('messages');
            expect(result.props.guildStats).toEqual(mockGuildStats);
            expect(result.revalidate).toBe(3600);
        });

        it('should call fetchGuildStatistics once', async () => {
            fetchGuildStatistics.mockResolvedValue({ memberCount: 1000 });

            await getStaticProps({ locale: 'en' } as any);

            expect(fetchGuildStatistics).toHaveBeenCalledTimes(1);
        });

        it('should set correct revalidate value', async () => {
            fetchGuildStatistics.mockResolvedValue({ memberCount: 100 });

            const result = await getStaticProps({ locale: 'en' } as any);

            expect(result.revalidate).toBe(3600);
        });
    });
});