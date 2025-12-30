import { render, screen } from '@testing-library/react';
import Imprint, { getStaticProps } from '@/pages/imprint';
import { useTranslations } from 'next-intl';

// Mock all external dependencies
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('@/components/elements/MetaHead', () => ({
    __esModule: true,
    default: ({ title, description }: any) => (
        <div data-testid="meta-head">
            <div data-testid="meta-title">{title}</div>
            <div data-testid="meta-description">{description}</div>
        </div>
    ),
}));

jest.mock('@/components/elements/layout/Header', () => ({
    __esModule: true,
    default: () => <header data-testid="header">Header</header>,
}));

jest.mock('@/components/elements/layout/Footer', () => ({
    __esModule: true,
    default: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock('@/components/animations/ParticlesBackground', () => ({
    __esModule: true,
    ParticlesBackground: ({ className, particles }: { className: string; particles: number }) => (
        <div data-testid="particles-background" className={className} data-particles={particles} />
    ),
}));

jest.mock('@/components/sections/imprint/ImprintSection', () => ({
    __esModule: true,
    default: () => <section data-testid="imprint-section">Imprint Section</section>,
}));

describe('Imprint Page', () => {
    const mockTSEO = jest.fn();

    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue(mockTSEO);
        mockTSEO.mockReturnValue('Mocked SEO Title');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render all main components', () => {
        render(<Imprint />);

        expect(screen.getByTestId('meta-head')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('particles-background')).toBeInTheDocument();
        expect(screen.getByTestId('imprint-section')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should call useTranslations with correct namespace', () => {
        render(<Imprint />);

        expect(useTranslations).toHaveBeenCalledWith('SEO');
    });

    it('should pass translated title to MetaHead', () => {
        mockTSEO.mockReturnValue('Impressum Titel');

        render(<Imprint />);

        expect(mockTSEO).toHaveBeenCalledWith('imprintTitle');
        expect(screen.getByTestId('meta-title')).toHaveTextContent('Impressum Titel');
    });

    it('should pass correct description to MetaHead', () => {
        render(<Imprint />);

        const description = screen.getByTestId('meta-description');
        expect(description).toHaveTextContent(
            'Auf dieser Seite findest du alle gesetzlich vorgeschriebenen Angaben'
        );
    });

    it('should render ParticlesBackground with correct className', () => {
        render(<Imprint />);

        const particles = screen.getByTestId('particles-background');
        expect(particles).toHaveClass('z-0');
        expect(particles).toHaveClass('animate__animated');
        expect(particles).toHaveClass('animate__fadeIn');
        expect(particles).toHaveClass('animate__slower');
        expect(particles).toHaveClass('hidden');
        expect(particles).toHaveClass('xl:block');
    });

    it('should render container with relative positioning', () => {
        const { container } = render(<Imprint />);

        const relativeDiv = container.querySelector('.relative');
        expect(relativeDiv).toBeInTheDocument();
    });

    describe('getStaticProps', () => {
        it('should return messages for locale en', async () => {
            const mockMessages = { test: 'English messages' };

            // Mock dynamic import
            jest.mock('../../../messages/en.json', () => mockMessages, {
                virtual: true,
            });

            const result = await getStaticProps({ locale: 'en' });

            expect(result).toHaveProperty('props');
            expect(result.props).toHaveProperty('messages');
        });

        it('should return messages for locale de', async () => {
            const result = await getStaticProps({ locale: 'de' });

            expect(result).toHaveProperty('props');
            expect(result.props).toHaveProperty('messages');
        });
    });
});