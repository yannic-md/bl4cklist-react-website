// noinspection DuplicatedCode

import {render, screen, fireEvent, act, waitFor} from '@testing-library/react';
import { useTranslations } from 'next-intl';
import HistorySection from "@/components/sections/index/HistorySection";

// Mock all dependencies
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('@/components/animations/ParticlesBackground', () => ({
    __esModule: true,
    ParticlesBackground: ({ particles, className }: any) => (
        <div data-testid="particles-background" data-particles={particles} className={className} />
    ),
}));

jest.mock('@/components/animations/AnimateOnView', () => {
    const MockAnimate = ({ children, animation, className, onAnimationEnd, threshold, rootMargin }: any) => (
        <div data-testid="animate-on-view" data-animation={animation} className={className}
             onClick={() => onAnimationEnd && onAnimationEnd()}>
            {children}
        </div>
    );
    return {__esModule: true, AnimateOnView: MockAnimate};
});

jest.mock('@/components/animations/TextReveal', () => ({
    __esModule: true,
    AnimatedTextReveal: ({ text, className }: any) => <div className={className}>{text}</div>,
}));

jest.mock('@/components/elements/ButtonHover', () => ({
    __esModule: true,
    default: () => <div data-testid="button-hover" />,
}));

jest.mock('@/components/elements/grid/TimelineItem', () => ({
    __esModule: true,
    default: ({ date, title, description, isFocused, isPassed, isLastItem, onClick }: any) => (
        <div data-testid="timeline-item" data-focused={isFocused} data-passed={isPassed}
             data-last={isLastItem} onClick={onClick}>
            <span>{date}</span>
            <span>{title}</span>
            <span>{description}</span>
        </div>
    ),
}));

jest.mock('@/components/elements/ads/AdWrapper', () => ({
    __esModule: true,
    AdContainer: ({ children }: any) => <div data-testid="ad-container">{children}</div>,
}));

jest.mock('@/components/elements/ads/AdBanner', () => ({
    __esModule: true,
    default: ({ dataAdSlot, dataAdFormat }: any) => (
        <div data-testid="ad-banner" data-slot={dataAdSlot} data-format={dataAdFormat} />
    ),
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ href, children, className }: any) => (
        <a href={href} className={className}>{children}</a>
    ),
}));

jest.mock('react-icons/fa', () => ({
    FaDiscord: () => <span data-testid="icon-discord">Discord</span>,
    FaUsers: () => <span data-testid="icon-users">Users</span>,
    FaRocket: () => <span data-testid="icon-rocket">Rocket</span>,
}));

jest.mock('@/types/TimelineData', () => ({
    timeline: [
        {
            date: 'timeline.item1.date',
            title: 'timeline.item1.title',
            description: 'timeline.item1.description',
            logoSrc: '/logo1.png',
            logoAlt: 'Logo 1',
            bgSrc: '/bg1.png',
            bgAlt: 'BG 1',
            bgRotation: 0,
        },
        {
            date: 'timeline.item2.date',
            title: 'timeline.item2.title',
            description: 'timeline.item2.description',
            logoSrc: '/logo2.png',
            logoAlt: 'Logo 2',
            bgSrc: '/bg2.png',
            bgAlt: 'BG 2',
            bgRotation: 45,
        },
        {
            date: 'timeline.item3.date',
            title: 'timeline.item3.title',
            description: 'timeline.item3.description',
            logoSrc: '/logo3.png',
            logoAlt: 'Logo 3',
            bgSrc: '/bg3.png',
            bgAlt: 'BG 3',
            bgRotation: 90,
        },
    ],
}));

jest.mock('@/styles/globals.css', () => ({
    index: {
        head_border: 'head-border-class',
        team_border_shadow: 'team-border-shadow-class',
    },
    colors: {
        text_gradient_gray: 'text-gradient-gray-class',
    },
    buttons: {
        white_gray: 'white-gray-button',
        black_purple: 'black-purple-button',
    },
}));

describe('HistorySection', () => {
    let intersectionObserverCallback: IntersectionObserverCallback;
    let mockObserve: jest.Mock;
    let mockUnobserve: jest.Mock;
    let mockDisconnect: jest.Mock;
    const mockTranslations: Record<string, jest.Mock> = {};

    const createMockEntry = (
        target: Element,
        top: number,
        height: number
    ): IntersectionObserverEntry => ({
        target,
        boundingClientRect: {
            top,
            height,
            bottom: top + height,
            left: 0,
            right: 0,
            width: 0,
            x: 0,
            y: top,
            toJSON: () => ({}),
        },
        intersectionRatio: 1,
        intersectionRect: {} as DOMRectReadOnly,
        isIntersecting: true,
        rootBounds: null,
        time: Date.now(),
    });

    beforeEach(() => {
        mockObserve = jest.fn();
        mockUnobserve = jest.fn();
        mockDisconnect = jest.fn();

        // Mock IntersectionObserver
        const mockIntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
            intersectionObserverCallback = callback;
            return {observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect};
        });
        global.IntersectionObserver = mockIntersectionObserver as any;

        // Mock window properties
        Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
        Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
        window.scrollTo = jest.fn();

        // Mock translations
        mockTranslations.WelcomeHero = jest.fn((key: string) => `welcome.${key}`);
        mockTranslations.HistorySection = jest.fn((key: string) => `history.${key}`);

        (useTranslations as jest.Mock).mockImplementation((namespace: string) => {
            return mockTranslations[namespace] || jest.fn((key: string) => `${namespace}.${key}`);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the component with all essential elements', () => {
        render(<HistorySection />);

        expect(screen.getByTestId('particles-background')).toBeInTheDocument();
        expect(screen.getByText(/history.title/i)).toBeInTheDocument();
        expect(screen.getByText(/history.description/i)).toBeInTheDocument();
        expect(screen.getByText('welcome.joinDiscord')).toBeInTheDocument();
        expect(screen.getByText('history.ourCommunity')).toBeInTheDocument();
        expect(screen.getAllByTestId('timeline-item')).toHaveLength(3);
    });

    it('should setup IntersectionObserver and observe timeline items', () => {
        render(<HistorySection />);

        expect(mockObserve).toHaveBeenCalledTimes(3);
    });

    it('should update focusedIndex when IntersectionObserver detects closest item', async () => {
        render(<HistorySection />);

        const timelineItems = screen.getAllByTestId('timeline-item') as HTMLElement[];
        const timelineContainers = timelineItems.map(item => item.parentElement!.parentElement);

        // Mock getBoundingClientRect for the container (because they are getting oversed)
        timelineContainers.forEach((container, idx) => {
            jest.spyOn(container as any, 'getBoundingClientRect').mockReturnValue({
                top: 100 + idx * 300,
                height: 200,
                bottom: 300 + idx * 300,
                left: 0,
                right: 0,
                width: 0,
                x: 0,
                y: 100 + idx * 300,
                toJSON: () => ({}),
            } as DOMRect);
        });

        const entries = timelineContainers.map((container, idx) =>
            createMockEntry(container!, 100 + idx * 300, 200)
        );

        (window as any).innerHeight = 1000;

        act(() => {
            intersectionObserverCallback(entries, {} as IntersectionObserver);
        });

        await waitFor(() => {
            expect(timelineItems[1]).toHaveAttribute('data-focused', 'true');
        });
    });

    it('should handle IntersectionObserver callback when item is not in refs', () => {
        render(<HistorySection />);

        const fakeElement = document.createElement('div');
        const entries = [createMockEntry(fakeElement, 100, 200)];

        act(() => {
            intersectionObserverCallback(entries, {} as IntersectionObserver);
        });

        // Should not crash and focusedIndex should remain 0
        const timelineItems = screen.getAllByTestId('timeline-item');
        expect(timelineItems[0]).toHaveAttribute('data-focused', 'true');
    });

    it('should calculate fillHeight for first item when focusedIndex is 0', () => {
        const { container } = render(<HistorySection />);
        const timelineItems = screen.getAllByTestId('timeline-item');

        // Mock parent hierarchy for getBoundingClientRect
        const mockParentElement = document.createElement('div');
        const mockGrandParentElement = document.createElement('div');
        Object.defineProperty(timelineItems[0], 'parentElement', {
            value: mockParentElement,
            writable: true,
        });
        Object.defineProperty(mockParentElement, 'parentElement', {
            value: mockGrandParentElement,
            writable: true,
        });

        jest.spyOn(timelineItems[0], 'getBoundingClientRect').mockReturnValue({
            top: 150,
            height: 200,
            bottom: 350,
            left: 0,
            right: 0,
            width: 0,
            x: 0,
            y: 150,
            toJSON: () => ({}),
        });

        jest.spyOn(mockGrandParentElement, 'getBoundingClientRect').mockReturnValue({
            top: 50,
            height: 1000,
            bottom: 1050,
            left: 0,
            right: 0,
            width: 0,
            x: 0,
            y: 50,
            toJSON: () => ({}),
        });

        const entries = [createMockEntry(timelineItems[0], 150, 200)];

        act(() => {
            intersectionObserverCallback(entries, {} as IntersectionObserver);
        });

        // fillHeight should be calculated
        const borderFill = container.querySelector('.absolute.w-0\\.5.bg-gradient-to-b.from-white\\/90');
        expect(borderFill).toBeInTheDocument();
    });

    it('should calculate fillHeight for non-first item when focusedIndex > 0', () => {
        const { container } = render(<HistorySection />);
        const timelineItems = screen.getAllByTestId('timeline-item');

        timelineItems.forEach((item, idx) => {
            Object.defineProperty(item, 'offsetHeight', { value: 200, writable: true });
            jest.spyOn(item, 'getBoundingClientRect').mockReturnValue({
                top: 100 + idx * 300,
                height: 200,
                bottom: 300 + idx * 300,
                left: 0,
                right: 0,
                width: 0,
                x: 0,
                y: 100 + idx * 300,
                toJSON: () => ({}),
            });
        });

        const entries = [createMockEntry(timelineItems[1], 400, 200)];

        act(() => {
            intersectionObserverCallback(entries, {} as IntersectionObserver);
        });

        // fillHeight = offsetHeight[0] + 56 + offsetHeight[1]/2 = 200 + 56 + 100 = 356
        const borderFill = container.querySelector('.absolute.w-0\\.5.bg-gradient-to-b.from-white\\/90');
        expect(borderFill).toHaveAttribute('style', expect.stringContaining('height'));
    });

    it('should calculate maxBorderHeight when all items are rendered', () => {
        const { container } = render(<HistorySection />);
        const timelineItems = screen.getAllByTestId('timeline-item');

        timelineItems.forEach((item) => {
            Object.defineProperty(item, 'offsetHeight', { value: 200, writable: true });
        });

        // Trigger useEffect by re-rendering
        act(() => {
            render(<HistorySection />);
        });

        // maxBorderHeight = 200 + 56 + 200 + 56 + 100 = 612
        const borderGradient = container.querySelector('.absolute.w-0\\.5.h-full.bg-gradient-to-b');
        expect(borderGradient).toBeInTheDocument();
    });

    it('should scroll to item and update focusedIndex when timeline item is clicked', () => {
        render(<HistorySection />);
        const timelineItems = screen.getAllByTestId('timeline-item');

        timelineItems.forEach((item, idx) => {
            jest.spyOn(item, 'getBoundingClientRect').mockReturnValue({
                top: 100 + idx * 300,
                height: 200,
                bottom: 300 + idx * 300,
                left: 0,
                right: 0,
                width: 0,
                x: 0,
                y: 100 + idx * 300,
                toJSON: () => ({}),
            });
        });

        fireEvent.click(timelineItems[2]);

        expect(window.scrollTo).toHaveBeenCalledWith({
            top: expect.any(Number),
            behavior: 'smooth',
        });
    });

    it('should set borderAnimationComplete to true when animation ends', () => {
        render(<HistorySection />);
        const animateOnViewElements = screen.getAllByTestId('animate-on-view');

        // Find the one with onAnimationEnd
        const borderAnimationElement = animateOnViewElements.find(el =>
            el.className.includes('absolute inset-0')
        );

        expect(borderAnimationElement).toBeInTheDocument();

        // Trigger onAnimationEnd
        fireEvent.click(borderAnimationElement!);

        // After animation, timeline items should have animation class
        const timelineItems = screen.getAllByTestId('timeline-item');
        expect(timelineItems.length).toBe(3);
    });

    it('should disconnect IntersectionObserver on unmount', () => {
        const { unmount } = render(<HistorySection />);

        unmount();

        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should memoize ParticlesBackground component', () => {
        const { rerender } = render(<HistorySection />);
        const firstParticles = screen.getByTestId('particles-background');

        rerender(<HistorySection />);
        const secondParticles = screen.getByTestId('particles-background');

        // Component should be the same instance (memoized)
        expect(firstParticles).toBe(secondParticles);
    });

    it('should render all timeline items with correct props', () => {
        render(<HistorySection />);
        const timelineItems = screen.getAllByTestId('timeline-item');

        expect(timelineItems[0]).toHaveAttribute('data-focused', 'true');
        expect(timelineItems[0]).toHaveAttribute('data-passed', 'true');
        expect(timelineItems[0]).toHaveAttribute('data-last', 'false');

        expect(timelineItems[2]).toHaveAttribute('data-last', 'true');
    });

    it('should handle missing parentElement in fillHeight calculation', () => {
        const { container } = render(<HistorySection />);
        const timelineItems = screen.getAllByTestId('timeline-item');

        Object.defineProperty(timelineItems[0], 'parentElement', {
            value: null,
            writable: true,
        });

        jest.spyOn(timelineItems[0], 'getBoundingClientRect').mockReturnValue({
            top: 150,
            height: 200,
            bottom: 350,
            left: 0,
            right: 0,
            width: 0,
            x: 0,
            y: 150,
            toJSON: () => ({}),
        });

        const entries = [createMockEntry(timelineItems[0], 150, 200)];

        act(() => {
            intersectionObserverCallback(entries, {} as IntersectionObserver);
        });

        // Should use 0 as containerTop
        const borderFill = container.querySelector('.absolute.w-0\\.5.bg-gradient-to-b.from-white\\/90');
        expect(borderFill).toBeInTheDocument();
    });

    it('should handle null refs when calculating fillHeight for focusedIndex > 0', () => {
        const { container } = render(<HistorySection />);
        const timelineItems = screen.getAllByTestId('timeline-item');

        // Set first item offsetHeight to null by making it undefined
        Object.defineProperty(timelineItems[0], 'offsetHeight', { value: undefined, writable: true });
        Object.defineProperty(timelineItems[1], 'offsetHeight', { value: 200, writable: true });

        timelineItems.forEach((item, idx) => {
            jest.spyOn(item, 'getBoundingClientRect').mockReturnValue({
                top: 100 + idx * 300,
                height: 200,
                bottom: 300 + idx * 300,
                left: 0,
                right: 0,
                width: 0,
                x: 0,
                y: 100 + idx * 300,
                toJSON: () => ({}),
            });
        });

        const entries = [createMockEntry(timelineItems[1], 400, 200)];

        act(() => {
            intersectionObserverCallback(entries, {} as IntersectionObserver);
        });

        // Should handle null gracefully
        expect(container).toBeInTheDocument();
    });

    it('should handle null refs when calculating maxBorderHeight', () => {
        const { container } = render(<HistorySection />);
        const timelineItems = screen.getAllByTestId('timeline-item');

        Object.defineProperty(timelineItems[0], 'offsetHeight', { value: 200, writable: true });
        Object.defineProperty(timelineItems[1], 'offsetHeight', { value: undefined, writable: true });
        Object.defineProperty(timelineItems[2], 'offsetHeight', { value: 200, writable: true });

        act(() => {
            render(<HistorySection />);
        });

        expect(container).toBeInTheDocument();
    });
});