import {render, screen, fireEvent, act} from '@testing-library/react';
import ScrollToTopButton from "@/components/elements/misc/ScrollToTop";

// Mock FaChevronUp icon
jest.mock('react-icons/fa', () => ({
    FaChevronUp: () => <span data-testid="chevron-icon">ChevronUp</span>,
}));

describe('ScrollToTopButton', () => {
    let scrollToMock: jest.Mock;

    beforeEach(() => {
        jest.useFakeTimers();
        scrollToMock = jest.fn();
        window.scrollTo = scrollToMock;
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
        Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true, configurable: true });
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('should not render button initially when scrollY is 0', () => {
        const { container } = render(<ScrollToTopButton />);
        expect(container.firstChild).toBeNull();
    });

    it('should render button when scrolling down past half viewport', () => {
        render(<ScrollToTopButton />);

        // Scroll down past half viewport (> 500px)
        Object.defineProperty(window, 'scrollY', { value: 600, writable: true, configurable: true });
        fireEvent.scroll(window);

        // Fast forward the 10ms delay for visibility
        act(() => {
            jest.advanceTimersByTime(10);
        });

        expect(screen.getByRole('button', { name: /scroll to top/i })).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveClass('animate__fadeInUp');
    });

    it('should not trigger state change when scrolling down and button already visible', () => {
        render(<ScrollToTopButton />);

        // First scroll to make button visible
        Object.defineProperty(window, 'scrollY', { value: 600, writable: true, configurable: true });
        fireEvent.scroll(window);
        act(() => {
            jest.advanceTimersByTime(10);
        });

        const button = screen.getByRole('button');
        expect(button).toHaveClass('animate__fadeInUp');

        // Second scroll while button is still visible
        Object.defineProperty(window, 'scrollY', { value: 700, writable: true, configurable: true });
        fireEvent.scroll(window);
        act(() => {
            jest.advanceTimersByTime(10);
        });

        // Button should still be visible with same class
        expect(button).toHaveClass('animate__fadeInUp');
    });

    it('should hide button when scrolling back to top', () => {
        render(<ScrollToTopButton />);

        // Scroll down to show button
        Object.defineProperty(window, 'scrollY', { value: 600, writable: true, configurable: true });
        fireEvent.scroll(window);
        act(() => {
            jest.advanceTimersByTime(10);
        });

        const button = screen.getByRole('button');
        expect(button).toHaveClass('animate__fadeInUp');

        // Scroll back up
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });
        fireEvent.scroll(window);

        expect(button).toHaveClass('animate__fadeOutDown');
    });

    it('should remove button from DOM after 400ms fade-out animation', () => {
        render(<ScrollToTopButton />);

        // Show button
        Object.defineProperty(window, 'scrollY', { value: 600, writable: true, configurable: true });
        fireEvent.scroll(window);
        act(() => {
            jest.advanceTimersByTime(10);
        });

        expect(screen.getByRole('button')).toBeInTheDocument();

        // Hide button
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });
        fireEvent.scroll(window);

        // Button should still exist during animation
        expect(screen.getByRole('button')).toBeInTheDocument();

        // Fast forward 400ms for unmount
        act(() => {
            jest.advanceTimersByTime(400);
        });

        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should scroll to top when button is clicked', () => {
        render(<ScrollToTopButton />);

        // Show button
        Object.defineProperty(window, 'scrollY', { value: 600, writable: true, configurable: true });
        fireEvent.scroll(window);
        act(() => {
            jest.advanceTimersByTime(10);
        });

        const button = screen.getByRole('button', { name: /scroll to top/i });
        fireEvent.click(button);

        expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('should cleanup scroll event listener on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
        const { unmount } = render(<ScrollToTopButton />);

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        removeEventListenerSpy.mockRestore();
    });

    it('should cleanup timeout on unmount during fade-out', () => {
        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
        const { unmount } = render(<ScrollToTopButton />);

        // Show button
        Object.defineProperty(window, 'scrollY', { value: 600, writable: true, configurable: true });
        fireEvent.scroll(window);
        act(() => {
            jest.advanceTimersByTime(10);
        });

        // Start hide animation
        Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });
        fireEvent.scroll(window);

        // Unmount before timeout completes
        unmount();

        expect(clearTimeoutSpy).toHaveBeenCalled();
        clearTimeoutSpy.mockRestore();
    });

    it('should not set timeout when button is not rendered', () => {
        const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
        render(<ScrollToTopButton />);

        // No scroll event, button never rendered
        const timeoutCalls = setTimeoutSpy.mock.calls.length;

        // Trigger effect without visible state change
        act(() => {
            jest.advanceTimersByTime(400);
        });

        // Should not create additional timeouts
        expect(setTimeoutSpy).toHaveBeenCalledTimes(timeoutCalls);
        setTimeoutSpy.mockRestore();
    });

    it('should render chevron icon inside button', () => {
        render(<ScrollToTopButton />);

        // Show button
        Object.defineProperty(window, 'scrollY', { value: 600, writable: true, configurable: true });
        fireEvent.scroll(window);
        act(() => {
            jest.advanceTimersByTime(10);
        });

        expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
    });

    it('should have correct aria-label for accessibility', () => {
        render(<ScrollToTopButton />);

        // Show button
        Object.defineProperty(window, 'scrollY', { value: 600, writable: true, configurable: true });
        fireEvent.scroll(window);
        act(() => {
            jest.advanceTimersByTime(10);
        });

        const button = screen.getByRole('button', { name: /scroll to top/i });
        expect(button).toHaveAttribute('aria-label', 'Scroll to top');
    });
});