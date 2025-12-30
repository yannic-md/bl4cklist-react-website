import { renderHook, act } from '@testing-library/react';
import {useKonamiCode} from "@/hooks/useKonamiCode";

describe('useKonamiCode', () => {
    const mockOnSuccess = jest.fn();
    const defaultSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown'];

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-01-01'));
        mockOnSuccess.mockClear();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('should call onSuccess when the correct sequence is entered', () => {
        renderHook(() => useKonamiCode({ onSuccess: mockOnSuccess }));

        act(() => {
            defaultSequence.forEach((key) => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key }));
            });
        });

        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onSuccess when an incorrect sequence is entered', () => {
        renderHook(() => useKonamiCode({ onSuccess: mockOnSuccess }));

        act(() => {
            ['ArrowUp', 'ArrowDown', 'ArrowUp', 'ArrowDown'].forEach((key) => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key }));
            });
        });

        expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should ignore non-arrow keys and not prevent default on them', () => {
        renderHook(() => useKonamiCode({ onSuccess: mockOnSuccess }));

        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

        act(() => {
            window.dispatchEvent(event);
        });

        expect(preventDefaultSpy).not.toHaveBeenCalled();
        expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should ignore keys without a key value (edge case for coverage)', () => {
        renderHook(() => useKonamiCode({ onSuccess: mockOnSuccess }));

        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: '' }));
        });

        expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should respect the cooldown period', () => {
        renderHook(() => useKonamiCode({ onSuccess: mockOnSuccess, cooldown: 5000 }));

        act(() => {
            defaultSequence.forEach((key) => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key }));
            });
        });
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);

        act(() => {
            defaultSequence.forEach((key) => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key }));
            });
        });
        expect(mockOnSuccess).toHaveBeenCalledTimes(1); // no second call

        act(() => {
            jest.advanceTimersByTime(5001);
        });

        act(() => {
            defaultSequence.forEach((key) => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key }));
            });
        });
        expect(mockOnSuccess).toHaveBeenCalledTimes(2);
    });

    it('should work with a custom sequence', () => {
        const customSeq = ['ArrowLeft', 'ArrowRight'];
        renderHook(() => useKonamiCode({ sequence: customSeq, onSuccess: mockOnSuccess }));

        act(() => {
            customSeq.forEach((key) => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key }));
            });
        });

        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    it('should prevent default behavior for arrow keys', () => {
        renderHook(() => useKonamiCode({ onSuccess: mockOnSuccess }));

        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

        act(() => {
            window.dispatchEvent(event);
        });

        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should remove event listener on unmount', () => {
        const removeSpy = jest.spyOn(window, 'removeEventListener');
        const { unmount } = renderHook(() => useKonamiCode({ onSuccess: mockOnSuccess }));

        unmount();

        expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        removeSpy.mockRestore();
    });

    it('should reset sequence after a successful trigger', () => {
        renderHook(() => useKonamiCode({ onSuccess: mockOnSuccess, cooldown: 0 }));

        // complete sequence
        act(() => {
            [...defaultSequence, 'ArrowUp'].forEach((key) => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key }));
            });
        });

        expect(mockOnSuccess).toHaveBeenCalledTimes(1);

        // if the reset worked, the last "Arrow Up" should not work as starting point for the new sequence.
        act(() => {
            ['ArrowUp', 'ArrowDown', 'ArrowDown'].forEach((key) => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key }));
            });
        });

        expect(mockOnSuccess).toHaveBeenCalledTimes(2);
    });
});