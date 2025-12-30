import { renderHook, act } from '@testing-library/react';
import {useMediaQuery} from "@/hooks/useMediaQuery";

describe('useMediaQuery', () => {
    let mockMediaQueryList: any;

    beforeEach(() => {
        jest.useFakeTimers();

        mockMediaQueryList = {
            matches: false,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            addListener: jest.fn(), // Legacy API
            removeListener: jest.fn(), // Legacy API
        };

        // window.matchMedia Mock
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                ...mockMediaQueryList,
                media: query,
            })),
        });
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.resetAllMocks();
    });

    it('should initialize with default max_width (1536) and return false initially', () => {
        const { result } = renderHook(() => useMediaQuery());

        expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1536px)');
        expect(result.current).toBe(false);
    });

    it('should return true immediately if media query matches on mount', () => {
        mockMediaQueryList.matches = true;

        const { result } = renderHook(() => useMediaQuery(1024));

        expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
        expect(result.current).toBe(true);
    });

    it('should update state when media query change event is fired (Modern API)', () => {
        let changeHandler: (e: any) => void = () => {};

        mockMediaQueryList.addEventListener.mockImplementation((event: string, cb: any) => {
            if (event === 'change') changeHandler = cb;
        });

        const { result } = renderHook(() => useMediaQuery());

        act(() => {
            changeHandler({ matches: true });
        });
        expect(result.current).toBe(true);

        act(() => {
            changeHandler({ matches: false });
        });
        expect(result.current).toBe(false);
    });

    it('should call removeEventListener on unmount', () => {
        const { unmount } = renderHook(() => useMediaQuery());

        unmount();

        expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
            'change',
            expect.any(Function)
        );
    });

    it('should handle environments where addEventListener is not available (Branch Coverage)', () => {
        const { addEventListener, ...legacyMediaQueryList } = mockMediaQueryList;

        (window.matchMedia as jest.Mock).mockReturnValue(legacyMediaQueryList);

        const { result } = renderHook(() => useMediaQuery());

        expect(result.current).toBe(false);
        expect(addEventListener).not.toHaveBeenCalled();
    });

    it('should use the provided custom max_width', () => {
        renderHook(() => useMediaQuery(800));
        expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 800px)');
    });
});