import {renderHook, act} from '@testing-library/react';
import { useCountUp } from '@/hooks/useCountUp';

describe('useCountUp', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('should return the start value initially', () => {
        const start = 10;
        const end = 100;

        const { result } = renderHook(() => useCountUp(end, 2000, start));

        expect(result.current).toBe(start);
    });

    it('should reach the end value after the duration', () => {
        const start = 0;
        const end = 100;
        const duration = 1000;

        const { result } = renderHook(() => useCountUp(end, duration, start));

        act(() => {
            jest.advanceTimersByTime(duration);
        });

        expect(result.current).toBe(end - 1);
    });

    it('should handle default parameters correctly (start=0, duration=2000)', () => {
        const end = 200;
        const { result } = renderHook(() => useCountUp(end));

        expect(result.current).toBe(0);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current).toBeGreaterThan(0);
        expect(result.current).toBeLessThan(end - 1);

        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(result.current).toBe(end - 1);
    });

    it('should calculate intermediate values correctly using easeOutQuart', () => {
        const start = 0;
        const end = 100;
        const duration = 1000;

        const { result } = renderHook(() => useCountUp(end, duration, start));

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(result.current).toBe(93 - 1);
    });

    it('should update animation when props change', () => {
        const { result, rerender } = renderHook(
            ({ end, duration, start }) => useCountUp(end, duration, start),
            {
                initialProps: { end: 100, duration: 1000, start: 0 },
            }
        );

        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(result.current).toBe(100 - 1);

        rerender({ end: 200, duration: 1000, start: 100 });

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current).toBe(200 - 1);
    });

    it('should clamp value to end even if timers advance beyond duration', () => {
        const end = 50;
        const duration = 500;

        const { result } = renderHook(() => useCountUp(end, duration));

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(result.current).toBe(end);
    });

    it('should cleanup animation frame on unmount', () => {
        const cancelSpy = jest.spyOn(window, 'cancelAnimationFrame');

        const { unmount } = renderHook(() => useCountUp(100, 1000));

        act(() => {
            jest.advanceTimersByTime(100);
        });

        unmount();

        expect(cancelSpy).toHaveBeenCalled();
        cancelSpy.mockRestore();
    });
});