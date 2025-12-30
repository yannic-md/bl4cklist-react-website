// noinspection DuplicatedCode

import {act, render, screen, waitFor} from '@testing-library/react';
import {useRouter} from 'next/router';
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";
import WelcomeHero from "@/components/sections/index/WelcomeHero";
import {APIStatistics} from "@/types/APIResponse";
import React from "react";

// Mock Setup
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => {
        const translations: Record<string, string> = {
            welcomeTag: 'Welcome Tag',
            description: 'Test Description',
            joinDiscord: 'Join Discord',
            learnMore: 'Learn More',
            memberCount: 'Members',
        };
        return translations[key] || key;
    },
}));

jest.mock('@/lib/milestones/MilestoneEvents', () => ({
    isMilestoneUnlocked: jest.fn(),
}));

jest.mock('@/lib/milestones/MilestoneService', () => ({
    unlockMilestone: jest.fn(),
}));

jest.mock('@/data/milestones', () => ({
    MILESTONES: {
        CREEPER: {
            id: 'creeper-milestone',
            imageKey: 'creeper-image',
        },
    },
}));

jest.mock('@/components/elements/ButtonHover', () => ({
    __esModule: true,
    default: () => <div data-testid="button-hover" />,
}));

describe('WelcomeHero', () => {
    const mockRouter = {
        push: jest.fn(),
        replace: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
        locale: 'de',
    };

    let intersectionObserverCallback: IntersectionObserverCallback;
    let mockObserve: jest.Mock;
    let mockUnobserve: jest.Mock;
    let mockDisconnect: jest.Mock;
    let mockIntersectionObserver: jest.Mock;

    beforeEach(() => {
        jest.useFakeTimers();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
        (unlockMilestone as jest.Mock).mockResolvedValue(undefined);

        mockObserve = jest.fn();
        mockUnobserve = jest.fn();
        mockDisconnect = jest.fn();

        mockIntersectionObserver = jest.fn().mockImplementation((callback: IntersectionObserverCallback) => {
            intersectionObserverCallback = callback;
            return {observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect};
        });

        global.IntersectionObserver = mockIntersectionObserver as any;

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });

        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });

        Object.defineProperty(document, 'readyState', {
            writable: true,
            configurable: true,
            value: 'complete',
        });

        window.HTMLMediaElement.prototype.play = jest.fn().mockImplementation(() => {
            return Promise.resolve();
        });
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('should render with provided guildStats', () => {
        const guildStats = { member_count: 5000, online_count: 1200 } as APIStatistics;
        render(<WelcomeHero guildStats={guildStats} />);

        expect(screen.getByText('5.000 Members')).toBeInTheDocument();
        expect(screen.getByText('1.200 Online')).toBeInTheDocument();
    });

    it('should render with fallback values when guildStats is undefined', () => {
        render(<WelcomeHero guildStats={undefined as any} />);

        expect(screen.getByText('3.533 Members')).toBeInTheDocument();
        expect(screen.getByText('890 Online')).toBeInTheDocument();
    });

    it('should setup IntersectionObserver on mount', () => {
        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as APIStatistics} />);

        expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            { threshold: 0.8 }
        );
        expect(mockObserve).toHaveBeenCalled();
    });

    it('should update isInViewport when intersection ratio >= 0.8', () => {
        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as APIStatistics} />);

        const entry = {
            intersectionRatio: 0.85,
            isIntersecting: true,
        } as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([entry], {} as IntersectionObserver);
        });

        // State updated, creeper logic can now proceed
        expect(mockObserve).toHaveBeenCalled();
    });

    it('should not update isInViewport when intersection ratio < 0.8', () => {
        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as APIStatistics} />);

        const entry = {
            intersectionRatio: 0.5,
            isIntersecting: false,
        } as IntersectionObserverEntry;

        act(() => {
            intersectionObserverCallback([entry], {} as IntersectionObserver);
        });

        expect(mockObserve).toHaveBeenCalled();
    });

    it('should attach event listeners on mount and cleanup on unmount', () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

        const { unmount } = render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as APIStatistics} />);

        expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function), undefined);
        expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), { passive: true });
        expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), undefined);
        expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), undefined);

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
    });

    it('should set isLoadedRef when document.readyState is complete', () => {
        Object.defineProperty(document, 'readyState', {
            writable: true,
            value: 'complete',
        });

        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as APIStatistics} />);

        // isLoadedRef.current should be true immediately
        expect(document.readyState).toBe('complete');
    });

    it('should set isLoadedRef on window load event when readyState is not complete', () => {
        Object.defineProperty(document, 'readyState', {
            writable: true,
            value: 'loading',
        });

        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as APIStatistics} />);

        const loadHandler = addEventListenerSpy.mock.calls.find(
            (call) => call[0] === 'load'
        )?.[1] as EventListener;

        expect(loadHandler).toBeDefined();

        act(() => {
            loadHandler(new Event('load'));
        });

        // isLoadedRef.current is now true
    });

    it('should start creeper timer when user interacts and conditions are met', async () => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: query === '(min-width: 1024px)',
                media: query,
            })),
        });

        // set readyState to "loading", so isLoadedRef stays initial false
        Object.defineProperty(document, 'readyState', {
            get() { return 'loading'; },
            configurable: true
        });

        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as any} />);

        act(() => {
            intersectionObserverCallback([{
                intersectionRatio: 0.9,
                isIntersecting: true
            } as any], {} as any);
        });

        // set userInteracted to true
        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150); // Debounce
        });

        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150);
        });

        act(() => {
            Object.defineProperty(document, 'readyState', {
                get() { return 'complete'; },
                configurable: true
            });
            window.dispatchEvent(new Event('load'));
        });

        act(() => {
            jest.advanceTimersByTime(60000);
        });

        await waitFor(() => {
            const video = document.querySelector('video[aria-hidden="true"]');
            expect(video).toBeInTheDocument();
        });
    });

    it('should not start timer if hasTriggered is true', () => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: query === '(min-width: 1024px)',
                media: query,
            })),
        });

        // set readyState to "loading", so isLoadedRef stays initial false
        Object.defineProperty(document, 'readyState', {
            get() { return 'loading'; },
            configurable: true
        });

        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as any} />);

        act(() => {
            intersectionObserverCallback([{
                intersectionRatio: 0.9,
                isIntersecting: true
            } as any], {} as any);
        });

        // set userInteracted to true
        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150); // Debounce
        });

        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150);
        });

        act(() => {
            Object.defineProperty(document, 'readyState', {
                get() { return 'complete'; },
                configurable: true
            });
            window.dispatchEvent(new Event('load'));
        });

        act(() => {
            jest.advanceTimersByTime(60000);
        });

        // First trigger
        const video = document.querySelector('video[aria-hidden="true"]') as HTMLVideoElement;
        expect(video).toBeInTheDocument();

        act(() => {
            video.dispatchEvent(new Event('ended'));
        });

        expect(document.querySelector('video[aria-hidden="true"]')).toBeNull();

        // Try triggering again
        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150); // Debounce
        });

        act(() => {
            jest.advanceTimersByTime(60000); // 60s Timer
        });

        // Should not trigger again
        expect(video).not.toBeInTheDocument();
    });

    it('should not start timer on mobile portrait when width >= 768', () => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => {
                if (query === '(orientation: portrait)') return { matches: true };
                return { matches: false };
            }),
        });

        // set readyState to "loading", so isLoadedRef stays initial false
        Object.defineProperty(document, 'readyState', {
            get() { return 'loading'; },
            configurable: true
        });

        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as any} />);

        act(() => {
            intersectionObserverCallback([{
                intersectionRatio: 0.9,
                isIntersecting: true
            } as any], {} as any);
        });

        // set userInteracted to true
        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150); // Debounce
        });

        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150);
        });

        act(() => {
            Object.defineProperty(document, 'readyState', {
                get() { return 'complete'; },
                configurable: true
            });
            window.dispatchEvent(new Event('load'));
        });

        act(() => {
            jest.advanceTimersByTime(60000);
        });

        // Should not show creeper
        const video = document.querySelector('video[aria-hidden="true"]') as HTMLVideoElement;
        expect(video).not.toBeInTheDocument();
    });

    it('should show creeper on mobile portrait when width < 768', () => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 375,
        });

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => {
                if (query === '(orientation: portrait)') return { matches: true };
                return { matches: false };
            }),
        });

        // set readyState to "loading", so isLoadedRef stays initial false
        Object.defineProperty(document, 'readyState', {
            get() { return 'loading'; },
            configurable: true
        });

        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as any} />);

        act(() => {
            intersectionObserverCallback([{
                intersectionRatio: 0.85,
                isIntersecting: true
            } as any], {} as any);
        });

        // set userInteracted to true
        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150); // Debounce
        });

        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150);
        });

        act(() => {
            Object.defineProperty(document, 'readyState', {
                get() { return 'complete'; },
                configurable: true
            });
            window.dispatchEvent(new Event('load'));
        });

        act(() => {
            jest.advanceTimersByTime(60000);
        });

        const video = document.querySelector('video[aria-hidden="true"]') as HTMLVideoElement;
        expect(video).toBeInTheDocument();
    });

    it('should play video and unlock milestone when creeper shows', async () => {
        const mockPlay = jest.fn().mockResolvedValue(undefined);
        HTMLVideoElement.prototype.play = mockPlay;

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: query === '(min-width: 1024px)',
                media: query,
            })),
        });

        // set readyState to "loading", so isLoadedRef stays initial false
        Object.defineProperty(document, 'readyState', {
            get() { return 'loading'; },
            configurable: true
        });

        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as any} />);

        act(() => {
            intersectionObserverCallback([{
                intersectionRatio: 0.85,
                isIntersecting: true
            } as any], {} as any);
        });

        // set userInteracted to true
        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150); // Debounce
        });

        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150);
        });

        act(() => {
            Object.defineProperty(document, 'readyState', {
                get() { return 'complete'; },
                configurable: true
            });
            window.dispatchEvent(new Event('load'));
        });

        act(() => {
            jest.advanceTimersByTime(60000);
        });

        await waitFor(() => {
            expect(mockPlay).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(isMilestoneUnlocked).toHaveBeenCalledWith('creeper-milestone');
        });

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith(
                'creeper-milestone',
                'creeper-image',
                'de'
            );
        });
    });

    it('should handle video play error gracefully', async () => {
        const mockPlay = jest.fn().mockRejectedValue(new Error('Play failed'));
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        HTMLVideoElement.prototype.play = mockPlay;

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => {
                if (query === '(min-width: 1024px)') return { matches: true };
                return { matches: false };
            }),
        });

        // set readyState to "loading", so isLoadedRef stays initial false
        Object.defineProperty(document, 'readyState', {
            get() { return 'loading'; },
            configurable: true
        });

        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as any} />);

        act(() => {
            intersectionObserverCallback([{
                intersectionRatio: 0.85,
                isIntersecting: true
            } as any], {} as any);
        });

        // set userInteracted to true
        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150); // Debounce
        });

        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150);
        });

        act(() => {
            Object.defineProperty(document, 'readyState', {
                get() { return 'complete'; },
                configurable: true
            });
            window.dispatchEvent(new Event('load'));
        });

        act(() => {
            jest.advanceTimersByTime(60000);
        });

        await waitFor(() => {
            expect(consoleLogSpy).toHaveBeenCalledWith('Could not start milestone.');
        });

        consoleLogSpy.mockRestore();
    });

    it('should not unlock milestone if already unlocked', async () => {
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(true);

        HTMLVideoElement.prototype.play = jest.fn().mockResolvedValue(undefined);

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => {
                if (query === '(min-width: 1024px)') return { matches: true };
                return { matches: false };
            }),
        });

        // set readyState to "loading", so isLoadedRef stays initial false
        Object.defineProperty(document, 'readyState', {
            get() { return 'loading'; },
            configurable: true
        });

        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as any} />);

        act(() => {
            intersectionObserverCallback([{
                intersectionRatio: 0.85,
                isIntersecting: true
            } as any], {} as any);
        });

        // set userInteracted to true
        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150); // Debounce
        });

        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150);
        });

        act(() => {
            Object.defineProperty(document, 'readyState', {
                get() { return 'complete'; },
                configurable: true
            });
            window.dispatchEvent(new Event('load'));
        });

        act(() => {
            jest.advanceTimersByTime(60000);
        });

        await waitFor(() => {
            expect(isMilestoneUnlocked).toHaveBeenCalledWith('creeper-milestone');
        });

        await waitFor(() => {
            expect(unlockMilestone).not.toHaveBeenCalled();
        });
    });

    it('should use locale fallback when router.locale is not de or en', async () => {
        mockRouter.locale = 'fr';
        (useRouter as jest.Mock).mockReturnValue(mockRouter);

        HTMLVideoElement.prototype.play = jest.fn().mockResolvedValue(undefined);

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => {
                if (query === '(min-width: 1024px)') return { matches: true };
                return { matches: false };
            }),
        });

        // set readyState to "loading", so isLoadedRef stays initial false
        Object.defineProperty(document, 'readyState', {
            get() { return 'loading'; },
            configurable: true
        });

        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as any} />);

        act(() => {
            intersectionObserverCallback([{
                intersectionRatio: 0.85,
                isIntersecting: true
            } as any], {} as any);
        });

        // set userInteracted to true
        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150); // Debounce
        });

        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150);
        });

        act(() => {
            Object.defineProperty(document, 'readyState', {
                get() { return 'complete'; },
                configurable: true
            });
            window.dispatchEvent(new Event('load'));
        });

        act(() => {
            jest.advanceTimersByTime(60000);
        });

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith(
                'creeper-milestone',
                'creeper-image',
                'de'
            );
        });
    });

    it('should use en locale when router.locale is en', async () => {
        mockRouter.locale = 'en';
        (useRouter as jest.Mock).mockReturnValue(mockRouter);

        HTMLVideoElement.prototype.play = jest.fn().mockResolvedValue(undefined);

        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => {
                if (query === '(min-width: 1024px)') return { matches: true };
                return { matches: false };
            }),
        });

        // set readyState to "loading", so isLoadedRef stays initial false
        Object.defineProperty(document, 'readyState', {
            get() { return 'loading'; },
            configurable: true
        });

        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as any} />);

        act(() => {
            intersectionObserverCallback([{
                intersectionRatio: 0.85,
                isIntersecting: true
            } as any], {} as any);
        });

        // set userInteracted to true
        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150); // Debounce
        });

        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150);
        });

        act(() => {
            Object.defineProperty(document, 'readyState', {
                get() { return 'complete'; },
                configurable: true
            });
            window.dispatchEvent(new Event('load'));
        });

        act(() => {
            jest.advanceTimersByTime(60000);
        });

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith(
                'creeper-milestone',
                'creeper-image',
                'en'
            );
        });
    });

    it('should hide creeper video when onEnded is triggered', () => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => {
                if (query === '(min-width: 1024px)') return { matches: true };
                return { matches: false };
            }),
        });

        // set readyState to "loading", so isLoadedRef stays initial false
        Object.defineProperty(document, 'readyState', {
            get() { return 'loading'; },
            configurable: true
        });

        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as any} />);

        act(() => {
            intersectionObserverCallback([{
                intersectionRatio: 0.85,
                isIntersecting: true
            } as any], {} as any);
        });

        // set userInteracted to true
        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150); // Debounce
        });

        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150);
        });

        act(() => {
            Object.defineProperty(document, 'readyState', {
                get() { return 'complete'; },
                configurable: true
            });
            window.dispatchEvent(new Event('load'));
        });

        act(() => {
            jest.advanceTimersByTime(60000);
        });

        const video = document.querySelector('video[aria-hidden="true"]') as HTMLVideoElement;
        expect(video).toBeInTheDocument();

        act(() => {
            video.dispatchEvent(new Event('ended'));
        });

        expect(video).not.toBeInTheDocument();
    });

    it('should debounce resetTimer calls', () => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => {
                if (query === '(min-width: 1024px)') return { matches: true };
                return { matches: false };
            }),
        });

        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as APIStatistics} />);

        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            window.dispatchEvent(new Event('mousemove'));
            window.dispatchEvent(new Event('mousemove'));
        });

        act(() => {
            jest.advanceTimersByTime(100);
        });

        // Only last call should be processed after debounce
        act(() => {
            jest.advanceTimersByTime(150);
        });
    });

    it('should not show creeper when not in viewport', () => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => {
                if (query === '(min-width: 1024px)') return { matches: true };
                return { matches: false };
            }),
        });

        // set readyState to "loading", so isLoadedRef stays initial false
        Object.defineProperty(document, 'readyState', {
            get() { return 'loading'; },
            configurable: true
        });

        render(<WelcomeHero guildStats={{ member_count: 100, online_count: 50 } as any} />);

        act(() => {
            intersectionObserverCallback([{
                intersectionRatio: 0.5,
                isIntersecting: true
            } as any], {} as any);
        });

        // set userInteracted to true
        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150); // Debounce
        });

        act(() => {
            window.dispatchEvent(new Event('mousemove'));
            jest.advanceTimersByTime(150);
        });

        act(() => {
            Object.defineProperty(document, 'readyState', {
                get() { return 'complete'; },
                configurable: true
            });
            window.dispatchEvent(new Event('load'));
        });

        act(() => {
            jest.advanceTimersByTime(60000);
        });

        const video = document.querySelector('video[aria-hidden="true"]') as HTMLVideoElement;
        expect(video).not.toBeInTheDocument();
    });

    it('should trigger the early return in useEffect when sectionRef.current is null', () => {
        const mockRef = {
            get current() { return null; },
            set current(_value) {}
        };

        const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValue(mockRef);

        render(<WelcomeHero guildStats={null} />);
        expect(mockObserve).not.toHaveBeenCalled();

        useRefSpy.mockRestore();
    });
});