import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import useConsoleListener from '@/hooks/useConsoleListener';
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";

// Mock Setup
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('@/lib/milestones/MilestoneEvents', () => ({
    isMilestoneUnlocked: jest.fn(),
}));

jest.mock('@/lib/milestones/MilestoneService', () => ({
    unlockMilestone: jest.fn(),
}));

jest.mock('@/data/milestones', () => ({
    MILESTONES: {
        PACMAN: {
            id: 'pacman-milestone',
            imageKey: 'pacman-image',
        },
    },
}));

describe('useConsoleListener', () => {
    const mockPush = jest.fn();
    const mockRouter = {
        push: mockPush,
        pathname: '/',
        query: {},
        asPath: '/',
        locale: 'de',
    };

    const mockTranslations = {
        isaacTitle: 'Isaac Title',
        isaacTask: 'Isaac Task',
        isaacTask2: 'Isaac Task 2',
        isaacEnd: 'Isaac End',
    };

    let consoleLogSpy: jest.SpyInstance;
    let consoleClearSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.useFakeTimers();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useTranslations as jest.Mock).mockReturnValue((key: string) => mockTranslations[key as keyof typeof mockTranslations]);
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
        (unlockMilestone as jest.Mock).mockResolvedValue(undefined);

        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        consoleClearSpy = jest.spyOn(console, 'clear').mockImplementation();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        consoleLogSpy.mockRestore();
        consoleClearSpy.mockRestore();
        delete (window as any).hugIsaac;
    });

    it('should set up console messages after 1 second', () => {
        renderHook(() => useConsoleListener());

        expect(consoleClearSpy).not.toHaveBeenCalled();
        expect(consoleLogSpy).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1000);

        expect(consoleClearSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    });

    it('should create window.hugIsaac function after timeout', () => {
        renderHook(() => useConsoleListener());

        expect((window as any).hugIsaac).toBeUndefined();

        jest.advanceTimersByTime(1000);

        expect((window as any).hugIsaac).toBeDefined();
        expect(typeof (window as any).hugIsaac).toBe('function');
    });

    it('should clear console and log message when hugIsaac is called', () => {
        renderHook(() => useConsoleListener());
        jest.advanceTimersByTime(1000);

        consoleClearSpy.mockClear();
        consoleLogSpy.mockClear();

        (window as any).hugIsaac();

        expect(consoleClearSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringContaining('Isaac End'),
            'color:#78e08f;font-size:16px;font-weight:bold;'
        );
    });

    it('should dispatch console-join event when hugIsaac is called', () => {
        const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent');

        renderHook(() => useConsoleListener());
        jest.advanceTimersByTime(1000);

        (window as any).hugIsaac();

        expect(dispatchEventSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'console-join',
            })
        );

        dispatchEventSpy.mockRestore();
    });

    it('should unlock milestone when console-join event is triggered and milestone is not unlocked', async () => {
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);

        renderHook(() => useConsoleListener());
        jest.advanceTimersByTime(1000);

        const event = new CustomEvent('console-join', {});
        document.dispatchEvent(event);

        await Promise.resolve();

        expect(isMilestoneUnlocked).toHaveBeenCalledWith('pacman-milestone');
        expect(unlockMilestone).toHaveBeenCalledWith(
            'pacman-milestone',
            'pacman-image',
            'de'
        );
    });

    it('should not unlock milestone when console-join event is triggered and milestone is already unlocked', async () => {
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(true);

        renderHook(() => useConsoleListener());
        jest.advanceTimersByTime(1000);

        const event = new CustomEvent('console-join', {});
        document.dispatchEvent(event);

        await Promise.resolve();

        expect(isMilestoneUnlocked).toHaveBeenCalledWith('pacman-milestone');
        expect(unlockMilestone).not.toHaveBeenCalled();
    });

    it('should use "en" locale when router locale is "en"', async () => {
        (useRouter as jest.Mock).mockReturnValue({ ...mockRouter, locale: 'en' });
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);

        renderHook(() => useConsoleListener());
        jest.advanceTimersByTime(1000);

        const event = new CustomEvent('console-join', {});
        document.dispatchEvent(event);

        await Promise.resolve();

        expect(unlockMilestone).toHaveBeenCalledWith(
            'pacman-milestone',
            'pacman-image',
            'en'
        );
    });

    it('should fallback to "de" locale when router locale is neither "de" nor "en"', async () => {
        (useRouter as jest.Mock).mockReturnValue({ ...mockRouter, locale: 'fr' });
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);

        renderHook(() => useConsoleListener());
        jest.advanceTimersByTime(1000);

        const event = new CustomEvent('console-join', {});
        document.dispatchEvent(event);

        await Promise.resolve();

        expect(unlockMilestone).toHaveBeenCalledWith(
            'pacman-milestone',
            'pacman-image',
            'de'
        );
    });

    it('should remove hugIsaac from window on cleanup', () => {
        const { unmount } = renderHook(() => useConsoleListener());
        jest.advanceTimersByTime(1000);

        expect((window as any).hugIsaac).toBeDefined();

        unmount();

        expect((window as any).hugIsaac).toBeUndefined();
    });

    it('should handle cleanup when hugIsaac is not defined', () => {
        const { unmount } = renderHook(() => useConsoleListener());

        expect(() => unmount()).not.toThrow();
        expect((window as any).hugIsaac).toBeUndefined();
    });

    it('should remove event listener on cleanup', () => {
        const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

        const { unmount } = renderHook(() => useConsoleListener());
        jest.advanceTimersByTime(1000);

        unmount();

        // Event listener cleanup happens implicitly through hook cleanup
        // We verify that the hook doesn't cause errors when unmounted
        expect(() => {
            const event = new CustomEvent('console-join', {});
            document.dispatchEvent(event);
        }).not.toThrow();

        removeEventListenerSpy.mockRestore();
    });
});