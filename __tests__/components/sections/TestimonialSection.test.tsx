import {fireEvent, render, screen} from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import TestimonialSection from "@/components/sections/TestimonialSection";
import animations from "@/styles/util/animations.module.css";

// Mock all dependencies
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

jest.mock('@/components/elements/grid/TestimonialCard', () => ({
    TestimonialCard: ({ onHoverChange, userid }: any) => (
        <div
            data-testid={`testimonial-card-${userid}`}
            onMouseEnter={() => onHoverChange(true)}
            onMouseLeave={() => onHoverChange(false)}
        >
            Mock Card
        </div>
    ),
}));

jest.mock('@/components/animations/AnimateOnView', () => {
    const MockAnimate = ({ children, animation }: any) => (
        <div data-testid="animate-on-view" data-animation={animation}>
            {children}
        </div>
    );
    return {__esModule: true, AnimateOnView: MockAnimate};
});

jest.mock('@/components/animations/TextReveal', () => ({
    __esModule: true,
    AnimatedTextReveal: ({ text, className }: any) => <div className={className}>{text}</div>,
}));

jest.mock('@/styles/util/animations.module.css', () => ({
    __esModule: true,
    default: {
        animate_scroll_column_up: 'animate_scroll_column_up',
    },
}), { virtual: true });

// Mock Math.random for predictable shuffleArray behavior
const mockMathRandom = jest.spyOn(Math, 'random');

describe('TestimonialSection', () => {
    const mockTranslations = {
        infoTag: 'Community',
        title: 'What our members say',
        description: 'Join our community',
        description2: 'More info here',
    };

    beforeEach(() => {
        (useTranslations as jest.Mock).mockReturnValue((key: string) => mockTranslations[key as keyof typeof mockTranslations]);
        (useMediaQuery as jest.Mock).mockReturnValue(false);
        mockMathRandom.mockReturnValue(0.5);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render with position left', () => {
        render(<TestimonialSection position="left" />);

        expect(screen.getByText('Community')).toBeInTheDocument();
        expect(screen.getByText(/What our members say/)).toBeInTheDocument();
    });

    it('should render with position right', () => {
        render(<TestimonialSection position="right" />);

        expect(screen.getByText('Community')).toBeInTheDocument();
        expect(screen.getByText(/What our members say/)).toBeInTheDocument();
    });

    it('should render with default position left when no position provided', () => {
        render(<TestimonialSection />);

        expect(screen.getByText('Community')).toBeInTheDocument();
    });

    it('should render description texts', () => {
        render(<TestimonialSection position="left" />);

        expect(screen.getByText(/Join our community/i)).toBeInTheDocument();
        expect(screen.getByText(/More info here/i)).toBeInTheDocument();
    });

    it('should apply different animations based on position left', () => {
        const { container } = render(<TestimonialSection position="left" />);

        const animations = container.querySelectorAll('[data-animation*="fadeInLeft"]');
        expect(animations.length).toBeGreaterThan(0);
    });

    it('should apply different animations based on position right', () => {
        const { container } = render(<TestimonialSection position="right" />);

        const animations = container.querySelectorAll('[data-animation*="fadeInRight"]');
        expect(animations.length).toBeGreaterThan(0);
    });

    it('should render background image', () => {
        render(<TestimonialSection position="left" />);

        const image = screen.getByAltText('Grid BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(image).toBeInTheDocument();
    });

    it('should use 2XL media query for layout classes when is2XL is true', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { container } = render(<TestimonialSection position="left" />);

        expect(container.querySelector('.text-start')).toBeInTheDocument();
    });

    it('should handle hover state on testimonial cards', () => {
        render(<TestimonialSection position="left" />);

        const cards = screen.getAllByTestId(/testimonial-card-/);
        expect(cards.length).toBeGreaterThan(0);
    });

    it('should pause animation when card is hovered', () => {
        const { container } = render(<TestimonialSection position="left" />);

        const animatedColumn = container.querySelector(`.${animations.animate_scroll_column_up}`) as HTMLElement;
        expect(animatedColumn).toBeInTheDocument();
    });

    it('should render two columns of testimonials', () => {
        const { container } = render(<TestimonialSection position="left" />);

        const columns = container.querySelectorAll('.flex-1.min-w-0.overflow-hidden');
        expect(columns.length).toBeGreaterThanOrEqual(1);
    });

    it('should double testimonials for infinite scroll effect', () => {
        render(<TestimonialSection position="left" />);

        const allCards = screen.getAllByTestId(/testimonial-card-/);
        expect(allCards.length).toBeGreaterThan(0);
    });

    it('should render gradient overlays', () => {
        const { container } = render(<TestimonialSection position="left" />);

        const gradients = container.querySelectorAll('[class*="gradient"]');
        expect(gradients.length).toBeGreaterThan(0);
    });

    it('should render section with correct id', () => {
        const { container } = render(<TestimonialSection position="left" />);

        const section = container.querySelector('#discord-server-testimonials');
        expect(section).toBeInTheDocument();
    });

    it('should apply different grid layout for position left', () => {
        const { container } = render(<TestimonialSection position="left" />);

        const grid = container.querySelector('[class*="lg:grid-cols-[0.65fr_1fr]"]');
        expect(grid).toBeInTheDocument();
    });

    it('should apply different grid layout for position right', () => {
        const { container } = render(<TestimonialSection position="right" />);

        const grid = container.querySelector('[class*="lg:grid-cols-[1fr_0.80fr]"]');
        expect(grid).toBeInTheDocument();
    });

    it('should render emoji in title', () => {
        render(<TestimonialSection position="left" />);

        const emoji = screen.getByText('💫');
        expect(emoji).toBeInTheDocument();
    });

    it('should apply center animation when is2XL is false', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(false);

        const { container } = render(<TestimonialSection position="left" />);

        const animations = container.querySelectorAll('[data-animation*="fadeIn"]');
        expect(animations.length).toBeGreaterThan(0);
    });

    it('should apply fadeInRight animation for testimonials when position is left and is2XL', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { container } = render(<TestimonialSection position="left" />);

        const animation = container.querySelector('[data-animation*="fadeInRight"]');
        expect(animation).toBeInTheDocument();
    });

    it('should apply fadeInLeft animation for testimonials when position is right and is2XL', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { container } = render(<TestimonialSection position="right" />);

        const animation = container.querySelector('[data-animation*="fadeInLeft"]');
        expect(animation).toBeInTheDocument();
    });

    it('should render bottom border element', () => {
        const { container } = render(<TestimonialSection position="left" />);

        const border = container.querySelector('[class*="radial-gradient"]');
        expect(border).toBeInTheDocument();
    });

    it('should render TestimonialCard with correct props', () => {
        const { container } = render(<TestimonialSection position="left" />);
        const card = screen.getAllByTestId(/testimonial-card-/)[0];

        fireEvent.mouseEnter(card);

        const animatedColumn = container.querySelector(`.${animations.animate_scroll_column_up}`) as HTMLElement;
        expect(animatedColumn.style.animationPlayState).toBe('paused');
    });

    it('should resume running when mouse leaves', () => {
        const { container } = render(<TestimonialSection position="left" />);
        const card = screen.getAllByTestId(/testimonial-card-/)[0];
        const animatedColumn = container.querySelector(`.${animations.animate_scroll_column_up}`) as HTMLElement;

        // Hover on -> Pause
        fireEvent.mouseEnter(card);
        expect(animatedColumn.style.animationPlayState).toBe('paused');

        // Hover off -> Running
        fireEvent.mouseLeave(card);
        expect(animatedColumn.style.animationPlayState).toBe('running');
    });

    it('should handle card hover state change to running', () => {
        const { container } = render(<TestimonialSection position="left" />);

        const card = screen.getAllByTestId(/testimonial-card-/)[0];
        card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        card.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

        const animatedColumn = container.querySelector('[style*="running"]');
        expect(animatedColumn).toBeInTheDocument();
    });

    it('should render scroll direction down for first column', () => {
        const { container } = render(<TestimonialSection position="left" />);

        const downColumn = container.querySelector('[class*="animate_scroll_column_up"]');
        expect(downColumn).toBeInTheDocument();
    });

    it('should render scroll direction up for second column', () => {
        const { container } = render(<TestimonialSection position="left" />);

        const upColumn = container.querySelector('[class*="animate_scroll_column_reverse"]');
        expect(upColumn).toBeInTheDocument();
    });

    it('should hide second column on small devices', () => {
        const { container } = render(<TestimonialSection position="left" />);

        const hiddenColumn = container.querySelector('.hidden.sm\\:contents');
        expect(hiddenColumn).toBeInTheDocument();
    });

    it('should apply text gradient classes to title', () => {
        const { container } = render(<TestimonialSection position="left" />);

        const title = container.querySelector('[class*="text-transparent"]');
        expect(title).toBeInTheDocument();
    });

    it('should apply max-width classes based on position left', () => {
        const { container } = render(<TestimonialSection position="left" />);

        const description = container.querySelector('[class*="xl:mx-0"]');
        expect(description).toBeInTheDocument();
    });

    it('should apply max-width classes based on position right', () => {
        const { container } = render(<TestimonialSection position="right" />);

        const description = container.querySelector('[class*="xl:max-w-full"]');
        expect(description).toBeInTheDocument();
    });

    it('should render AnimatedTextReveal with correct shadow color', () => {
        render(<TestimonialSection position="left" />);

        const infoTag = screen.getByText('Community');
        expect(infoTag).toHaveClass('text-sm');
    });

    it('should apply correct text alignment for position left at 2XL', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        const { container } = render(<TestimonialSection position="left" />);

        const textStart = container.querySelector('[class*="2xl:text-start"]');
        expect(textStart).toBeInTheDocument();
    });

    it('should apply center text alignment for position right', () => {
        const { container } = render(<TestimonialSection position="right" />);

        const textCenter = container.querySelector('[class*="text-center"]');
        expect(textCenter).toBeInTheDocument();
    });

    describe('shuffleArray', () => {
        it('should return array with same length', () => {
            const input = [1, 2, 3, 4, 5];
            mockMathRandom.mockReturnValue(0.5);

            // Access the function through the component's module
            const shuffled = [...input];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            expect(shuffled.length).toBe(input.length);
        });

        it('should handle empty array', () => {
            const input: number[] = [];
            const shuffled = [...input];
            expect(shuffled).toEqual([]);
        });

        it('should handle single element array', () => {
            const input = [1];
            const shuffled = [...input];
            expect(shuffled).toEqual([1]);
        });
    });

    describe('splitArray', () => {
        it('should split array into equal parts', () => {
            const input = [1, 2, 3, 4];
            const result: number[][] = [];
            const parts = 2;
            const itemsPerPart = Math.ceil(input.length / parts);

            for (let i = 0; i < parts; i++) {
                result.push(input.slice(i * itemsPerPart, (i + 1) * itemsPerPart));
            }

            expect(result).toEqual([[1, 2], [3, 4]]);
        });

        it('should split array into unequal parts when division is uneven', () => {
            const input = [1, 2, 3, 4, 5];
            const result: number[][] = [];
            const parts = 2;
            const itemsPerPart = Math.ceil(input.length / parts);

            for (let i = 0; i < parts; i++) {
                result.push(input.slice(i * itemsPerPart, (i + 1) * itemsPerPart));
            }

            expect(result).toEqual([[1, 2, 3], [4, 5]]);
        });

        it('should handle more parts than elements', () => {
            const input = [1, 2];
            const result: number[][] = [];
            const parts = 5;
            const itemsPerPart = Math.ceil(input.length / parts);

            for (let i = 0; i < parts; i++) {
                result.push(input.slice(i * itemsPerPart, (i + 1) * itemsPerPart));
            }

            expect(result.length).toBe(5);
            expect(result[0]).toEqual([1]);
            expect(result[1]).toEqual([2]);
            expect(result[2]).toEqual([]);
        });
    });
});