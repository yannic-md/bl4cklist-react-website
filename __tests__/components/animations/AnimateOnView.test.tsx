// noinspection DuplicatedCode

import { render, screen, act } from '@testing-library/react';
import {AnimateOnView} from "@/components/animations/AnimateOnView";

const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

describe('AnimateOnView', () => {
    let intersectionObserverCallback: IntersectionObserverCallback;

    beforeEach(() => {
        jest.useFakeTimers();

        mockIntersectionObserver.mockImplementation((callback: IntersectionObserverCallback) => {
            intersectionObserverCallback = callback;
            return {observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect};
        });

        global.IntersectionObserver = mockIntersectionObserver as any;
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('should render children without animation initially', () => {
        render(
            <AnimateOnView animation="animate__fadeIn">
                <div>Test Content</div>
            </AnimateOnView>
        );

        expect(screen.getByText('Test Content')).toBeInTheDocument();
        const container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveClass('opacity-0');
        expect(container).not.toHaveClass('animate__animated');
    });

    it('should set up IntersectionObserver with default options', () => {
        render(
            <AnimateOnView animation="animate__fadeIn">
                <div>Test Content</div>
            </AnimateOnView>
        );

        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );
        expect(mockObserve).toHaveBeenCalled();
    });

    it('should set up IntersectionObserver with custom threshold and rootMargin', () => {
        render(
            <AnimateOnView
                animation="animate__fadeIn"
                threshold={0.5}
                rootMargin="50px"
            >
                <div>Test Content</div>
            </AnimateOnView>
        );

        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            { threshold: 0.5, rootMargin: '50px' }
        );
    });

    it('should trigger animation when element intersects without delay', () => {
        render(
            <AnimateOnView animation="animate__fadeIn">
                <div>Test Content</div>
            </AnimateOnView>
        );

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        const container = screen.getByText('Test Content').parentElement;
        expect(container).not.toHaveClass('opacity-0');
        expect(container).toHaveClass('animate__animated');
        expect(container).toHaveClass('animate__fadeIn');
        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should trigger animation with delay', () => {
        render(
            <AnimateOnView animation="animate__fadeIn" delay={500}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        // Before delay
        let container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveClass('opacity-0');
        expect(container).not.toHaveClass('animate__animated');

        // After delay
        act(() => {
            jest.advanceTimersByTime(500);
        });

        container = screen.getByText('Test Content').parentElement;
        expect(container).not.toHaveClass('opacity-0');
        expect(container).toHaveClass('animate__animated');
        expect(container).toHaveClass('animate__fadeIn');
    });

    it('should apply custom duration to animation', () => {
        render(
            <AnimateOnView animation="animate__fadeIn" duration={2000}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        const container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveStyle({ animationDuration: '2000ms' });
    });

    it('should apply default duration when not provided', () => {
        render(
            <AnimateOnView animation="animate__fadeIn">
                <div>Test Content</div>
            </AnimateOnView>
        );

        const container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveStyle({ animationDuration: '1000ms' });
    });

    it('should apply custom className', () => {
        render(
            <AnimateOnView animation="animate__fadeIn" className="custom-class">
                <div>Test Content</div>
            </AnimateOnView>
        );

        const container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveClass('custom-class');
    });

    it('should trigger animation only once when triggerOnce is true', () => {
        const { rerender } = render(
            <AnimateOnView animation="animate__fadeIn" triggerOnce={true}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        // First intersection
        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        let container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveClass('animate__animated');
        expect(mockDisconnect).toHaveBeenCalledTimes(1);

        // Reset mocks to track new calls
        mockDisconnect.mockClear();

        // Simulate re-render and second intersection attempt
        rerender(
            <AnimateOnView animation="animate__fadeIn" triggerOnce={true}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        const mockEntry2 = {
            isIntersecting: true,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([mockEntry2], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        // Should not disconnect again since hasTriggered is true
        expect(mockDisconnect).not.toHaveBeenCalled();
    });

    it('should trigger animation multiple times when triggerOnce is false', () => {
        render(
            <AnimateOnView animation="animate__fadeIn" triggerOnce={false}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        // First intersection
        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        let container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveClass('animate__animated');
        expect(mockDisconnect).toHaveBeenCalled();

        // Element leaves viewport
        const mockEntry2 = {
            isIntersecting: false,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([mockEntry2], {} as IntersectionObserver);
        });

        container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveClass('opacity-0');
        expect(container).not.toHaveClass('animate__animated');

        // Reset disconnect mock
        mockDisconnect.mockClear();

        // Second intersection
        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveClass('animate__animated');
        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should not trigger animation when not intersecting initially', () => {
        render(
            <AnimateOnView animation="animate__fadeIn">
                <div>Test Content</div>
            </AnimateOnView>
        );

        const mockEntry = {
            isIntersecting: false,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
            jest.advanceTimersByTime(1000);
        });

        const container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveClass('opacity-0');
        expect(container).not.toHaveClass('animate__animated');
        expect(mockDisconnect).not.toHaveBeenCalled();
    });

    it('should call onAnimationEnd callback when animation ends', () => {
        const mockOnAnimationEnd = jest.fn();

        render(
            <AnimateOnView animation="animate__fadeIn" onAnimationEnd={mockOnAnimationEnd}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        const container = screen.getByText('Test Content').parentElement;

        // Trigger animationend event
        act(() => {
            const animationEndEvent = new Event('animationend', { bubbles: true });
            container?.dispatchEvent(animationEndEvent);
        });

        expect(mockOnAnimationEnd).toHaveBeenCalledTimes(1);
    });

    it('should not call onAnimationEnd when callback is not provided', () => {
        render(
            <AnimateOnView animation="animate__fadeIn">
                <div>Test Content</div>
            </AnimateOnView>
        );

        const container = screen.getByText('Test Content').parentElement;

        // Should not throw error when triggering animationend
        act(() => {
            const animationEndEvent = new Event('animationend', { bubbles: true });
            expect(() => container?.dispatchEvent(animationEndEvent)).not.toThrow();
        });
    });

    it('should unobserve element on unmount', () => {
        const { unmount } = render(
            <AnimateOnView animation="animate__fadeIn">
                <div>Test Content</div>
            </AnimateOnView>
        );

        const element = screen.getByText('Test Content').parentElement;

        unmount();

        expect(mockUnobserve).toHaveBeenCalledWith(element);
    });

    it('should handle elementRef being null', () => {
        const { unmount } = render(
            <AnimateOnView animation="animate__fadeIn">
                <div>Test Content</div>
            </AnimateOnView>
        );

        // Should not throw when ref is null during cleanup
        expect(() => unmount()).not.toThrow();
    });

    it('should render without animation class when animation prop is not provided', () => {
        render(
            <AnimateOnView animation="">
                <div>Test Content</div>
            </AnimateOnView>
        );

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        const container = screen.getByText('Test Content').parentElement;
        expect(container).not.toHaveClass('opacity-0');
        expect(container).not.toHaveClass('animate__animated');
    });

    it('should handle edge case with zero delay', () => {
        render(
            <AnimateOnView animation="animate__fadeIn" delay={0}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        const container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveClass('animate__animated');
    });

    it('should handle edge case with threshold of 0', () => {
        render(
            <AnimateOnView animation="animate__fadeIn" threshold={0}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            { threshold: 0, rootMargin: '0px 0px -100px 0px' }
        );
    });

    it('should handle edge case with threshold of 1', () => {
        render(
            <AnimateOnView animation="animate__fadeIn" threshold={1}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            { threshold: 1, rootMargin: '0px 0px -100px 0px' }
        );
    });

    it('should not set hasTriggered when triggerOnce is false', () => {
        render(
            <AnimateOnView animation="animate__fadeIn" triggerOnce={false}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        // Should disconnect observer even when triggerOnce is false
        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should handle multiple children elements', () => {
        render(
            <AnimateOnView animation="animate__fadeIn">
                <div>Child 1</div>
                <div>Child 2</div>
                <span>Child 3</span>
            </AnimateOnView>
        );

        expect(screen.getByText('Child 1')).toBeInTheDocument();
        expect(screen.getByText('Child 2')).toBeInTheDocument();
        expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('should handle empty className', () => {
        render(
            <AnimateOnView animation="animate__fadeIn" className="">
                <div>Test Content</div>
            </AnimateOnView>
        );

        const container = screen.getByText('Test Content').parentElement;
        expect(container?.className).toContain('opacity-0');
    });

    it('should disconnect observer after triggering when triggerOnce is true', () => {
        render(
            <AnimateOnView animation="animate__fadeIn" triggerOnce={true}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        expect(mockDisconnect).not.toHaveBeenCalled();

        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should preserve animation state when element stays visible with triggerOnce false', () => {
        render(
            <AnimateOnView animation="animate__fadeIn" triggerOnce={false}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        let container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveClass('animate__animated');

        // Reset disconnect mock
        mockDisconnect.mockClear();

        // Element stays visible - callback triggered again
        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveClass('animate__animated');
        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should handle partial delay advancement', () => {
        render(
            <AnimateOnView animation="animate__fadeIn" delay={1000}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
        });

        // Advance only part of the delay
        act(() => {
            jest.advanceTimersByTime(500);
        });

        let container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveClass('opacity-0');

        // Complete the delay
        act(() => {
            jest.advanceTimersByTime(500);
        });

        container = screen.getByText('Test Content').parentElement;
        expect(container).toHaveClass('animate__animated');
    });

    it('should not trigger when intersecting with triggerOnce true and hasTriggered true', () => {
        render(
            <AnimateOnView animation="animate__fadeIn" triggerOnce={true}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        const mockEntry = {
            isIntersecting: true,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        // First trigger
        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        expect(mockDisconnect).toHaveBeenCalledTimes(1);
        mockDisconnect.mockClear();

        // Try to trigger again with same conditions
        act(() => {
            intersectionObserverCallback([mockEntry], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        // Should not disconnect again
        expect(mockDisconnect).not.toHaveBeenCalled();
    });

    it('should handle visibility toggle with triggerOnce false and multiple transitions', () => {
        render(
            <AnimateOnView animation="animate__fadeIn" triggerOnce={false}>
                <div>Test Content</div>
            </AnimateOnView>
        );

        const mockEntryVisible = {
            isIntersecting: true,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        const mockEntryHidden = {
            isIntersecting: false,
            target: screen.getByText('Test Content').parentElement,
        } as unknown as IntersectionObserverEntry;

        // First appearance
        act(() => {
            intersectionObserverCallback([mockEntryVisible], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        expect(screen.getByText('Test Content').parentElement).toHaveClass('animate__animated');

        // Hide
        act(() => {
            intersectionObserverCallback([mockEntryHidden], {} as IntersectionObserver);
        });

        expect(screen.getByText('Test Content').parentElement).toHaveClass('opacity-0');

        // Show again
        act(() => {
            intersectionObserverCallback([mockEntryVisible], {} as IntersectionObserver);
            jest.advanceTimersByTime(0);
        });

        expect(screen.getByText('Test Content').parentElement).toHaveClass('animate__animated');

        // Hide again
        act(() => {
            intersectionObserverCallback([mockEntryHidden], {} as IntersectionObserver);
        });

        expect(screen.getByText('Test Content').parentElement).toHaveClass('opacity-0');
    });
});