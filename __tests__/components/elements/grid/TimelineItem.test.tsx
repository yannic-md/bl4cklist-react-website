import { render, screen, fireEvent } from '@testing-library/react';
import TimelineItem from "@/components/elements/grid/TimelineItem";

// Mock Next.js Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

// Mock CSS modules
jest.mock('@/styles/util/animations.module.css', () => ({
    animate_float: 'animate_float',
}));

describe('TimelineItem', () => {
    const defaultProps = {
        date: '2024-01-01',
        title: 'Test Title',
        description: 'Test Description',
        logoSrc: '',
        logoAlt: '',
        bgSrc: '',
        bgAlt: '',
        bgRotation: undefined as 'left' | 'right' | undefined,
        borderShadowClass: 'shadow-test',
        isFocused: false,
        isPassed: false,
        isLastItem: false,
        onClick: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should render with default props', () => {
        render(<TimelineItem {...defaultProps} />);

        expect(screen.getByText('2024-01-01')).toBeInTheDocument();
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('should apply cursor-special class when isFocused is true', () => {
        const { container } = render(<TimelineItem {...defaultProps} isFocused={true} />);

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('cursor-special');
    });

    it('should apply cursor-pointer class when isFocused is false', () => {
        const { container } = render(<TimelineItem {...defaultProps} isFocused={false} />);

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass('!cursor-pointer');
    });

    it('should apply scale-105 and opacity-100 when isFocused is true', () => {
        const { container } = render(<TimelineItem {...defaultProps} isFocused={true} />);

        const transitionDiv = container.querySelector('.transition-all.duration-500');
        expect(transitionDiv).toHaveClass('scale-105', 'opacity-100');
    });

    it('should apply scale-100 and opacity-40 when isFocused is false', () => {
        const { container } = render(<TimelineItem {...defaultProps} isFocused={false} />);

        const transitionDiv = container.querySelector('.transition-all.duration-500');
        expect(transitionDiv).toHaveClass('scale-100', 'opacity-40');
    });

    it('should call onClick when container is clicked', () => {
        const mockOnClick = jest.fn();
        render(<TimelineItem {...defaultProps} onClick={mockOnClick} />);

        const clickableDiv = screen.getByText('Test Title').closest('div.relative.flex.p-3') as HTMLElement;
        fireEvent.click(clickableDiv);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should render logo image when logoSrc is provided', () => {
        render(<TimelineItem {...defaultProps} logoSrc="/test-logo.png" logoAlt="Test Logo" />);

        const logo = screen.getByAltText('Test Logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', '/test-logo.png');
    });

    it('should use default alt text for logo when logoAlt is not provided', () => {
        render(<TimelineItem {...defaultProps} logoSrc="/test-logo.png" />);

        const logo = screen.getByAltText('Logo');
        expect(logo).toBeInTheDocument();
    });

    it('should not render logo when logoSrc is not provided', () => {
        render(<TimelineItem {...defaultProps} logoSrc="" />);

        expect(screen.queryByAltText('Logo')).not.toBeInTheDocument();
    });

    it('should render background image when bgSrc is provided', () => {
        render(<TimelineItem {...defaultProps} bgSrc="/test-bg.png" bgAlt="Test Background" />);

        const bgImage = screen.getByAltText('Test Background');
        expect(bgImage).toBeInTheDocument();
        expect(bgImage).toHaveAttribute('src', '/test-bg.png');
    });

    it('should use default alt text for background when bgAlt is not provided', () => {
        render(<TimelineItem {...defaultProps} bgSrc="/test-bg.png" />);

        const bgImage = screen.getByAltText('Background decoration');
        expect(bgImage).toBeInTheDocument();
    });

    it('should not render background image when bgSrc is not provided', () => {
        render(<TimelineItem {...defaultProps} bgSrc="" />);

        expect(screen.queryByAltText('Background decoration')).not.toBeInTheDocument();
    });

    it('should apply rotate-12 class when bgRotation is left', () => {
        const { container } = render(<TimelineItem {...defaultProps} bgSrc="/test-bg.png" bgRotation="left" />);

        const bgContainer = container.querySelector('.animate_float');
        expect(bgContainer).toHaveClass('rotate-12');
    });

    it('should apply rotate-20 class when bgRotation is right', () => {
        const { container } = render(<TimelineItem {...defaultProps} bgSrc="/test-bg.png" bgRotation="right" />);

        const bgContainer = container.querySelector('.animate_float');
        expect(bgContainer).toHaveClass('rotate-20');
    });

    it('should apply isPassed styling to decorative dot when isPassed is true', () => {
        const { container } = render(<TimelineItem {...defaultProps} isPassed={true} />);

        const dot = container.querySelector('.aspect-square.rounded-full');
        expect(dot).toHaveClass('bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#fff,#e5e5e5_54%,#a3a3a3)]');
    });

    it('should apply default styling to decorative dot when isPassed is false', () => {
        const { container } = render(<TimelineItem {...defaultProps} isPassed={false} />);

        const dot = container.querySelector('.aspect-square.rounded-full');
        expect(dot).toHaveClass('bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#6b7280,#4b5563_54%,#374151)]');
    });

    it('should render bottom connector line when isLastItem is false', () => {
        const { container } = render(<TimelineItem {...defaultProps} isLastItem={false} />);

        const connectors = container.querySelectorAll('.w-\\[2px\\].h-\\[40px\\]');
        expect(connectors.length).toBe(2); // top and bottom connectors
    });

    it('should not render bottom connector line when isLastItem is true', () => {
        const { container } = render(<TimelineItem {...defaultProps} isLastItem={true} />);

        const connectors = container.querySelectorAll('.w-\\[2px\\].h-\\[40px\\]');
        expect(connectors.length).toBe(1); // only top connector
    });

    it('should apply isPassed styling to horizontal connector when isPassed is true', () => {
        const { container } = render(<TimelineItem {...defaultProps} isPassed={true} />);

        const horizontalConnector = container.querySelector('.w-\\[40px\\].h-\\[2px\\]');
        expect(horizontalConnector).toHaveClass('bg-gradient-to-r', 'from-white/80');
    });

    it('should apply default styling to horizontal connector when isPassed is false', () => {
        const { container } = render(<TimelineItem {...defaultProps} isPassed={false} />);

        const horizontalConnector = container.querySelector('.w-\\[40px\\].h-\\[2px\\]');
        expect(horizontalConnector).toHaveClass('bg-gradient-to-r', 'from-gray-500/60');
    });

    it('should apply isPassed styling to top connector when isPassed is true', () => {
        const { container } = render(<TimelineItem {...defaultProps} isPassed={true} />);

        const connectors = container.querySelectorAll('.w-\\[2px\\].h-\\[40px\\]');
        const topConnector = Array.from(connectors).find(el =>
            el.classList.contains('-translate-y-full')
        );
        expect(topConnector).toHaveClass('bg-gradient-to-t', 'from-white/60');
    });

    it('should apply default styling to top connector when isPassed is false', () => {
        const { container } = render(<TimelineItem {...defaultProps} isPassed={false} />);

        const connectors = container.querySelectorAll('.w-\\[2px\\].h-\\[40px\\]');
        const topConnector = Array.from(connectors).find(el =>
            el.classList.contains('-translate-y-full')
        );
        expect(topConnector).toHaveClass('bg-gradient-to-t', 'from-gray-500/40');
    });

    it('should apply isPassed styling to bottom connector when isPassed is true and isLastItem is false', () => {
        const { container } = render(<TimelineItem {...defaultProps} isPassed={true} isLastItem={false} />);

        const connectors = container.querySelectorAll('.w-\\[2px\\].h-\\[40px\\]');
        const bottomConnector = Array.from(connectors).find(el =>
            el.classList.contains('translate-y-full')
        );
        expect(bottomConnector).toHaveClass('bg-gradient-to-b', 'from-white/60');
    });

    it('should apply default styling to bottom connector when isPassed is false and isLastItem is false', () => {
        const { container } = render(<TimelineItem {...defaultProps} isPassed={false} isLastItem={false} />);

        const connectors = container.querySelectorAll('.w-\\[2px\\].h-\\[40px\\]');
        const bottomConnector = Array.from(connectors).find(el =>
            el.classList.contains('translate-y-full')
        );
        expect(bottomConnector).toHaveClass('bg-gradient-to-b', 'from-gray-500/40');
    });
});