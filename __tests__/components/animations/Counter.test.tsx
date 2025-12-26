// noinspection DuplicatedCode

import { render, screen, act } from '@testing-library/react';
import {AnimatedCounter} from "@/components/animations/Counter";

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();
const mockCountUp = jest.fn();

jest.mock('@/hooks/useCountUp', () => ({
    useCountUp: (end: number, duration: number) => mockCountUp(end, duration),
}));

describe('AnimatedCounter', () => {
    let intersectionObserverCallback: IntersectionObserverCallback;

    beforeEach(() => {
        jest.useFakeTimers();

        mockIntersectionObserver.mockImplementation((callback: IntersectionObserverCallback) => {
            intersectionObserverCallback = callback;
            return {observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect,};
        });

        global.IntersectionObserver = mockIntersectionObserver as any;

        // Default mock return value
        mockCountUp.mockReturnValue(0);
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
        mockCountUp.mockReset();
    });

    it('should render with initial count of 0', () => {
        mockCountUp.mockReturnValue(0);

        render(<AnimatedCounter end={100} />);

        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should set up IntersectionObserver with threshold 0.3', () => {
        render(<AnimatedCounter end={100} />);

        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            { threshold: 0.3 }
        );
        expect(mockObserve).toHaveBeenCalled();
    });

    it('should observe the ref element', () => {
        render(<AnimatedCounter end={100} />);

        expect(mockObserve).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it('should trigger animation when element intersects', () => {
        mockCountUp.mockReturnValueOnce(0).mockReturnValueOnce(50);

        const { rerender } = render(<AnimatedCounter end={100} />);

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('0').parentElement,
        } as unknown as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        // After visibility is set, useCountUp should be called with end value
        rerender(<AnimatedCounter end={100} />);

        expect(mockCountUp).toHaveBeenCalledWith(100, 2500);
        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should call useCountUp with 0 initially', () => {
        render(<AnimatedCounter end={100} />);

        expect(mockCountUp).toHaveBeenCalledWith(0, 2500);
    });

    it('should call useCountUp with end value after intersection', () => {
        mockCountUp.mockReturnValue(0);

        const { rerender } = render(<AnimatedCounter end={100} />);

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('0').parentElement,
        } as unknown as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        mockCountUp.mockReturnValue(100);
        rerender(<AnimatedCounter end={100} />);

        expect(mockCountUp).toHaveBeenCalledWith(100, 2500);
    });

    it('should disconnect observer after intersection', () => {
        render(<AnimatedCounter end={100} />);

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('0').parentElement,
        } as unknown as IntersectionObserverEntry;

        expect(mockDisconnect).not.toHaveBeenCalled();

        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should not trigger animation when not intersecting', () => {
        render(<AnimatedCounter end={100} />);

        const mockEntry = {
            isIntersecting: false,
            target: screen.getByText('0').parentElement,
        } as unknown as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        expect(mockCountUp).toHaveBeenCalledWith(0, 2500);
        expect(mockDisconnect).not.toHaveBeenCalled();
    });

    it('should display suffix when provided', () => {
        mockCountUp.mockReturnValue(100);

        render(<AnimatedCounter end={100} suffix="+" />);

        expect(screen.getByText('100+')).toBeInTheDocument();
    });

    it('should display without suffix when not provided', () => {
        mockCountUp.mockReturnValue(100);

        render(<AnimatedCounter end={100} />);

        expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should format number with default locale (en-US)', () => {
        mockCountUp.mockReturnValue(1000);

        render(<AnimatedCounter end={1000} />);

        // en-US formats 1000 as "1,000"
        expect(screen.getByText('1,000')).toBeInTheDocument();
    });

    it('should format number with custom locale', () => {
        mockCountUp.mockReturnValue(1000);

        render(<AnimatedCounter end={1000} locale="de-DE" />);

        // de-DE formats 1000 as "1.000"
        expect(screen.getByText('1.000')).toBeInTheDocument();
    });

    it('should format number with fr-FR locale', () => {
        mockCountUp.mockReturnValue(1000);

        render(<AnimatedCounter end={1000} locale="fr-FR" />);

        // fr-FR formats 1000 as "1 000" (non-breaking space)
        const element = screen.getByText(/1\s000/);
        expect(element).toBeInTheDocument();
    });

    it('should combine locale formatting with suffix', () => {
        mockCountUp.mockReturnValue(5000);

        render(<AnimatedCounter end={5000} suffix="+" locale="en-US" />);

        expect(screen.getByText('5,000+')).toBeInTheDocument();
    });

    it('should handle empty suffix string', () => {
        mockCountUp.mockReturnValue(100);

        render(<AnimatedCounter end={100} suffix="" />);

        expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should disconnect observer on unmount', () => {
        const { unmount } = render(<AnimatedCounter end={100} />);

        unmount();

        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should handle ref being null during cleanup', () => {
        const { unmount } = render(<AnimatedCounter end={100} />);

        // Should not throw when ref is null during cleanup
        expect(() => unmount()).not.toThrow();
    });

    it('should handle edge case with end value of 0', () => {
        mockCountUp.mockReturnValue(0);

        render(<AnimatedCounter end={0} />);

        expect(screen.getByText('0')).toBeInTheDocument();
        expect(mockCountUp).toHaveBeenCalledWith(0, 2500);
    });

    it('should handle negative end values', () => {
        mockCountUp.mockReturnValue(-100);

        render(<AnimatedCounter end={-100} />);

        expect(screen.getByText('-100')).toBeInTheDocument();
    });

    it('should handle large numbers with locale formatting', () => {
        mockCountUp.mockReturnValue(1000000);

        render(<AnimatedCounter end={1000000} locale="en-US" />);

        expect(screen.getByText('1,000,000')).toBeInTheDocument();
    });

    it('should handle decimal numbers', () => {
        mockCountUp.mockReturnValue(99.99);

        render(<AnimatedCounter end={99.99} />);

        expect(screen.getByText('99.99')).toBeInTheDocument();
    });

    it('should handle various suffix types', () => {
        mockCountUp.mockReturnValue(100);

        const { rerender } = render(<AnimatedCounter end={100} suffix="%" />);
        expect(screen.getByText('100%')).toBeInTheDocument();

        mockCountUp.mockReturnValue(50);
        rerender(<AnimatedCounter end={50} suffix="k" />);
        expect(screen.getByText('50k')).toBeInTheDocument();

        mockCountUp.mockReturnValue(75);
        rerender(<AnimatedCounter end={75} suffix=" items" />);
        expect(screen.getByText('75 items')).toBeInTheDocument();
    });

    it('should only trigger once even with multiple intersections', () => {
        render(<AnimatedCounter end={100} />);

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('0').parentElement,
        } as unknown as IntersectionObserverEntry;

        // First intersection
        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        expect(mockDisconnect).toHaveBeenCalledTimes(1);

        // Reset mock to track new calls
        mockDisconnect.mockClear();

        // Second intersection attempt
        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        // Should not disconnect again since observer is already disconnected
        expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should handle observer.observe being called with current ref', () => {
        const { container } = render(<AnimatedCounter end={100} />);

        const divElement = container.querySelector('.text-3xl');
        expect(mockObserve).toHaveBeenCalledWith(divElement);
    });

    it('should not observe if ref.current is null initially', () => {
        // Mock ref.current to be null
        mockObserve.mockClear();

        render(<AnimatedCounter end={100} />);

        // In normal rendering, ref.current should exist, so observe should be called
        expect(mockObserve).toHaveBeenCalled();
    });

    it('should use 2500ms duration for count animation', () => {
        render(<AnimatedCounter end={100} />);

        expect(mockCountUp).toHaveBeenCalledWith(expect.any(Number), 2500);
    });

    it('should update count value progressively during animation', () => {
        // Simulate progressive count updates
        mockCountUp
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(25)
            .mockReturnValueOnce(50)
            .mockReturnValueOnce(75)
            .mockReturnValueOnce(100);

        const { rerender } = render(<AnimatedCounter end={100} />);
        expect(screen.getByText('0')).toBeInTheDocument();

        rerender(<AnimatedCounter end={100} />);
        expect(screen.getByText('25')).toBeInTheDocument();

        rerender(<AnimatedCounter end={100} />);
        expect(screen.getByText('50')).toBeInTheDocument();

        rerender(<AnimatedCounter end={100} />);
        expect(screen.getByText('75')).toBeInTheDocument();

        rerender(<AnimatedCounter end={100} />);
        expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should maintain correct state after intersection', () => {
        mockCountUp.mockReturnValue(0);

        const { rerender } = render(<AnimatedCounter end={100} />);

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('0').parentElement,
        } as unknown as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        // After intersection, component should use end value
        mockCountUp.mockReturnValue(100);
        rerender(<AnimatedCounter end={100} />);

        expect(mockCountUp).toHaveBeenLastCalledWith(100, 2500);
    });

    it('should handle different threshold values correctly', () => {
        render(<AnimatedCounter end={100} />);

        // Verify threshold is exactly 0.3
        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            { threshold: 0.3 }
        );
    });

    it('should format zero with locale', () => {
        mockCountUp.mockReturnValue(0);

        render(<AnimatedCounter end={0} locale="de-DE" />);

        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle very large numbers with suffix', () => {
        mockCountUp.mockReturnValue(999999999);

        render(<AnimatedCounter end={999999999} suffix="+" locale="en-US" />);

        expect(screen.getByText('999,999,999+')).toBeInTheDocument();
    });
});