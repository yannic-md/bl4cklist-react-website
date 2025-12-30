// noinspection DuplicatedCode

import { renderHook, act } from '@testing-library/react';
import { useActiveSection } from '@/hooks/useActiveSection';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

describe('useActiveSection', () => {
    let mockIntersectionObserver: jest.Mock;
    let mockMutationObserver: jest.Mock;
    let intersectionObserverCallback: IntersectionObserverCallback;
    let mutationObserverCallback: MutationCallback;
    let mockObserve: jest.Mock;
    let mockUnobserve: jest.Mock;
    let mockDisconnect: jest.Mock;
    let mutationObserve: jest.Mock;
    let mutationDisconnect: jest.Mock;

    beforeEach(() => {
        jest.useFakeTimers();
        (usePathname as jest.Mock).mockReturnValue('/');

        // Mock IntersectionObserver
        mockObserve = jest.fn();
        mockUnobserve = jest.fn();
        mockDisconnect = jest.fn();

        mockIntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
            intersectionObserverCallback = callback;
            return {observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect};
        });
        global.IntersectionObserver = mockIntersectionObserver as any;

        // Mock MutationObserver
        mutationObserve = jest.fn();
        mutationDisconnect = jest.fn();

        mockMutationObserver = jest.fn((callback: MutationCallback) => {
            mutationObserverCallback = callback;
            return {observe: mutationObserve, disconnect: mutationDisconnect};
        });
        global.MutationObserver = mockMutationObserver as any;

        // Mock DOM methods
        document.querySelectorAll = jest.fn().mockReturnValue([]);
        document.getElementById = jest.fn().mockReturnValue(null);
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('should initialize with empty active section', () => {
        const { result } = renderHook(() => useActiveSection());
        expect(result.current).toBe('');
    });

    it('should observe all sections found in DOM after timeout', () => {
        const mockSection1 = { id: 'section-1' } as HTMLElement;
        const mockSection2 = { id: 'section-2' } as HTMLElement;

        (document.querySelectorAll as jest.Mock).mockReturnValue([mockSection1, mockSection2]);
        (document.getElementById as jest.Mock).mockImplementation((id: string) => {
            if (id === 'section-1') return mockSection1;
            if (id === 'section-2') return mockSection2;
            return null;
        });

        renderHook(() => useActiveSection());

        act(() => {
            jest.advanceTimersByTime(100);
        });

        expect(mockObserve).toHaveBeenCalledWith(mockSection1);
        expect(mockObserve).toHaveBeenCalledWith(mockSection2);
        expect(mockObserve).toHaveBeenCalledTimes(2);
    });

    it('should set active section to most visible section', () => {
        const mockSection1 = { id: 'section-1' } as HTMLElement;
        const mockSection2 = { id: 'section-2' } as HTMLElement;

        (document.querySelectorAll as jest.Mock).mockReturnValue([mockSection1, mockSection2]);
        (document.getElementById as jest.Mock).mockImplementation((id: string) => {
            if (id === 'section-1') return mockSection1;
            if (id === 'section-2') return mockSection2;
            return null;
        });

        const { result } = renderHook(() => useActiveSection());

        act(() => {
            jest.advanceTimersByTime(100);
        });

        act(() => {
            intersectionObserverCallback(
                [
                    {target: mockSection1, isIntersecting: true, intersectionRatio: 0.3} as unknown as IntersectionObserverEntry,
                    {target: mockSection2, isIntersecting: true, intersectionRatio: 0.7} as unknown as IntersectionObserverEntry,
                ],
                {} as IntersectionObserver
            );
        });

        expect(result.current).toBe('section-2');
    });

    it('should update active section when visibility changes', () => {
        const mockSection1 = { id: 'section-1' } as HTMLElement;

        (document.querySelectorAll as jest.Mock).mockReturnValue([mockSection1]);
        (document.getElementById as jest.Mock).mockReturnValue(mockSection1);

        const { result } = renderHook(() => useActiveSection());

        act(() => {
            jest.advanceTimersByTime(100);
        });

        act(() => {
            intersectionObserverCallback(
                [{target: mockSection1, isIntersecting: true, intersectionRatio: 0.5} as unknown as IntersectionObserverEntry],
                {} as IntersectionObserver
            );
        });

        expect(result.current).toBe('section-1');

        act(() => {
            intersectionObserverCallback(
                [{target: mockSection1, isIntersecting: false, intersectionRatio: 0} as unknown as IntersectionObserverEntry],
                {} as IntersectionObserver
            );
        });

        expect(result.current).toBe('');
    });

    it('should set active section to empty string when no section is visible', () => {
        const mockSection1 = { id: 'section-1' } as HTMLElement;

        (document.querySelectorAll as jest.Mock).mockReturnValue([mockSection1]);
        (document.getElementById as jest.Mock).mockReturnValue(mockSection1);

        const { result } = renderHook(() => useActiveSection());

        act(() => {
            jest.advanceTimersByTime(100);
        });

        act(() => {
            intersectionObserverCallback(
                [{target: mockSection1, isIntersecting: false, intersectionRatio: 0} as unknown as IntersectionObserverEntry],
                {} as IntersectionObserver
            );
        });

        expect(result.current).toBe('');
    });

    it('should handle sections without id attribute', () => {
        const mockSection = { id: 'section-1' } as HTMLElement;

        (document.querySelectorAll as jest.Mock).mockReturnValue([mockSection]);
        (document.getElementById as jest.Mock).mockReturnValue(null);

        renderHook(() => useActiveSection());

        act(() => {
            jest.advanceTimersByTime(100);
        });

        expect(mockObserve).not.toHaveBeenCalled();
    });

    it('should reinitialize observer when element contains section with id', () => {
        const mockDiv = document.createElement('div');
        const mockSection = { id: 'section-1' } as HTMLElement;
        mockDiv.querySelector = jest.fn().mockReturnValue(mockSection);

        (document.querySelectorAll as jest.Mock).mockReturnValueOnce([]);

        renderHook(() => useActiveSection());

        act(() => {
            jest.advanceTimersByTime(100);
        });

        (document.querySelectorAll as jest.Mock).mockReturnValue([mockSection]);
        (document.getElementById as jest.Mock).mockReturnValue(mockSection);

        act(() => {
            mutationObserverCallback(
                [
                    {
                        addedNodes: [mockDiv],
                    } as unknown as MutationRecord,
                ],
                {} as MutationObserver
            );
        });

        expect(mockDisconnect).toHaveBeenCalledTimes(2);
    });

    it('should not reinitialize observer when non-section elements are added', () => {
        const mockDiv = document.createElement('div');
        mockDiv.querySelector = jest.fn().mockReturnValue(null);

        (document.querySelectorAll as jest.Mock).mockReturnValue([]);

        renderHook(() => useActiveSection());

        act(() => {
            jest.advanceTimersByTime(100);
        });

        const disconnectCallsBefore = mockDisconnect.mock.calls.length;

        act(() => {
            mutationObserverCallback(
                [
                    {
                        addedNodes: [mockDiv],
                    } as unknown as MutationRecord,
                ],
                {} as MutationObserver
            );
        });

        expect(mockDisconnect).toHaveBeenCalledTimes(disconnectCallsBefore);
    });

    it('should cleanup observers on unmount', () => {
        const mockSection = { id: 'section-1' } as HTMLElement;

        (document.querySelectorAll as jest.Mock).mockReturnValue([mockSection]);
        (document.getElementById as jest.Mock).mockReturnValue(mockSection);

        const { unmount } = renderHook(() => useActiveSection());

        act(() => {
            jest.advanceTimersByTime(100);
        });

        unmount();

        expect(mockDisconnect).toHaveBeenCalled();
        expect(mutationDisconnect).toHaveBeenCalled();
    });

    it('should reinitialize when pathname changes', () => {
        const mockSection = { id: 'section-1' } as HTMLElement;

        (document.querySelectorAll as jest.Mock).mockReturnValue([mockSection]);
        (document.getElementById as jest.Mock).mockReturnValue(mockSection);
        (usePathname as jest.Mock).mockReturnValue('/page1');

        const { rerender } = renderHook(() => useActiveSection());

        act(() => {
            jest.advanceTimersByTime(100);
        });

        const disconnectCallsBefore = mockDisconnect.mock.calls.length;

        (usePathname as jest.Mock).mockReturnValue('/page2');

        rerender();

        act(() => {
            jest.advanceTimersByTime(100);
        });

        expect(mockDisconnect.mock.calls.length).toBeGreaterThan(disconnectCallsBefore);
    });

    it('should handle multiple sections with different visibility ratios', () => {
        const mockSection1 = { id: 'section-1' } as HTMLElement;
        const mockSection2 = { id: 'section-2' } as HTMLElement;
        const mockSection3 = { id: 'section-3' } as HTMLElement;

        (document.querySelectorAll as jest.Mock).mockReturnValue([mockSection1, mockSection2, mockSection3]);
        (document.getElementById as jest.Mock).mockImplementation((id: string) => {
            if (id === 'section-1') return mockSection1;
            if (id === 'section-2') return mockSection2;
            if (id === 'section-3') return mockSection3;
            return null;
        });

        const { result } = renderHook(() => useActiveSection());

        act(() => {
            jest.advanceTimersByTime(100);
        });

        act(() => {
            intersectionObserverCallback(
                [
                    {target: mockSection1, isIntersecting: true, intersectionRatio: 0.2} as unknown as IntersectionObserverEntry,
                    {target: mockSection2, isIntersecting: true, intersectionRatio: 0.5} as unknown as IntersectionObserverEntry,
                    {target: mockSection3, isIntersecting: true, intersectionRatio: 0.3} as unknown as IntersectionObserverEntry,
                ],
                {} as IntersectionObserver
            );
        });

        expect(result.current).toBe('section-2');
    });

    it('should handle intersection entries with zero ratio when not intersecting', () => {
        const mockSection1 = { id: 'section-1' } as HTMLElement;

        (document.querySelectorAll as jest.Mock).mockReturnValue([mockSection1]);
        (document.getElementById as jest.Mock).mockReturnValue(mockSection1);

        const { result } = renderHook(() => useActiveSection());

        act(() => {
            jest.advanceTimersByTime(100);
        });

        act(() => {
            intersectionObserverCallback(
                [{target: mockSection1, isIntersecting: false, intersectionRatio: 0.5} as unknown as IntersectionObserverEntry],
                {} as IntersectionObserver
            );
        });

        expect(result.current).toBe('');
    });

    it('should clear timeout on unmount before timeout executes', () => {
        const mockSection = { id: 'section-1' } as HTMLElement;

        (document.querySelectorAll as jest.Mock).mockReturnValue([mockSection]);
        (document.getElementById as jest.Mock).mockReturnValue(mockSection);

        const { unmount } = renderHook(() => useActiveSection());

        unmount();

        act(() => {
            jest.advanceTimersByTime(100);
        });

        expect(mockObserve).not.toHaveBeenCalled();
    });
});