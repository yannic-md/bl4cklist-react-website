import { render, screen, fireEvent } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import ContactHero from "@/components/sections/imprint/ContactHero";

// Mock dependencies
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('@/components/animations/ParticlesBackground', () => ({
    __esModule: true,
    ParticlesBackground: ({ className, particles }: { className: string; particles: number }) => (
        <div data-testid="particles-background" className={className} data-particles={particles} />
    ),
}));

jest.mock('@/components/animations/TextReveal', () => ({
    __esModule: true,
    AnimatedTextReveal: ({ text, className, shadowColor }: { text: string; className: string; shadowColor: string }) => (
        <div data-testid="animated-text-reveal" className={className} data-shadow-color={shadowColor}>
            {text}
        </div>
    ),
}));

jest.mock('@/components/elements/ButtonHover', () => ({
    __esModule: true,
    default: () => <div data-testid="button-hover" />,
}));

jest.mock('react-icons/fa6', () => ({
    FaHandcuffs: () => <span data-testid="icon-handcuffs">HandcuffsIcon</span>,
    FaPencil: () => <span data-testid="icon-pencil">PencilIcon</span>,
}));

describe('ContactHero', () => {
    const mockOnFormSelect = jest.fn();
    const mockTranslations: Record<string, string> = {
        infoTag: 'Contact Us',
        title: 'Get in Touch',
        description: 'We are here to help you',
        formUnbanTitle: 'Unban Request',
        formUnbanDescription: 'Request to lift your ban',
        formUnbanButton: 'Submit Unban',
        formGeneralTitle: 'General Inquiry',
        formGeneralDescription: 'Ask us anything',
        formGeneralButton: 'Submit Question',
    };

    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue((key: string) => mockTranslations[key] || key);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render all main elements correctly', () => {
        render(<ContactHero onFormSelect={mockOnFormSelect} />);

        expect(screen.getByTestId('particles-background')).toBeInTheDocument();
        expect(screen.getByTestId('animated-text-reveal')).toHaveTextContent('Contact Us');
        expect(screen.getByText(/📬/)).toBeInTheDocument();
        expect(screen.getByText(/Get in Touch/)).toBeInTheDocument();
        expect(screen.getByText('We are here to help you')).toBeInTheDocument();
    });

    it('should render both form boxes with correct content', () => {
        render(<ContactHero onFormSelect={mockOnFormSelect} />);

        expect(screen.getByText(/🛑 ~ Unban Request/)).toBeInTheDocument();
        expect(screen.getByText('Request to lift your ban')).toBeInTheDocument();
        expect(screen.getByText('Submit Unban')).toBeInTheDocument();

        expect(screen.getByText(/📡 ~ General Inquiry/)).toBeInTheDocument();
        expect(screen.getByText('Ask us anything')).toBeInTheDocument();
        expect(screen.getByText('Submit Question')).toBeInTheDocument();
    });

    it('should render correct icons for both buttons', () => {
        render(<ContactHero onFormSelect={mockOnFormSelect} />);

        expect(screen.getByTestId('icon-handcuffs')).toBeInTheDocument();
        expect(screen.getByTestId('icon-pencil')).toBeInTheDocument();
    });

    it('should render two ButtonHover components', () => {
        render(<ContactHero onFormSelect={mockOnFormSelect} />);

        const buttonHovers = screen.getAllByTestId('button-hover');
        expect(buttonHovers).toHaveLength(2);
    });

    it('should call onFormSelect with "unban" when first button is clicked', () => {
        render(<ContactHero onFormSelect={mockOnFormSelect} />);

        const unbanButton = screen.getByText('Submit Unban').closest('button');
        fireEvent.click(unbanButton!);

        expect(mockOnFormSelect).toHaveBeenCalledTimes(1);
        expect(mockOnFormSelect).toHaveBeenCalledWith('unban');
    });

    it('should call onFormSelect with "general" when second button is clicked', () => {
        render(<ContactHero onFormSelect={mockOnFormSelect} />);

        const generalButton = screen.getByText('Submit Question').closest('button');
        fireEvent.click(generalButton!);

        expect(mockOnFormSelect).toHaveBeenCalledTimes(1);
        expect(mockOnFormSelect).toHaveBeenCalledWith('general');
    });

    it('should pass correct props to ParticlesBackground', () => {
        render(<ContactHero onFormSelect={mockOnFormSelect} />);

        const particlesBackground = screen.getByTestId('particles-background');
        expect(particlesBackground).toHaveAttribute('data-particles', '60');
        expect(particlesBackground).toHaveClass('animate__animated', 'animate__fadeIn', 'animate__slower');
    });

    it('should pass correct props to AnimatedTextReveal', () => {
        render(<ContactHero onFormSelect={mockOnFormSelect} />);

        const animatedText = screen.getByTestId('animated-text-reveal');
        expect(animatedText).toHaveAttribute('data-shadow-color', 'rgba(255,127,80,0.35)');
    });

    it('should render section with correct id attribute', () => {
        const { container } = render(<ContactHero onFormSelect={mockOnFormSelect} />);

        const section = container.querySelector('section#start');
        expect(section).toBeInTheDocument();
    });
});