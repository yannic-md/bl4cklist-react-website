// noinspection DuplicatedCode

import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import { useRouter } from 'next/router';
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";
import GlitchingMoon from "@/components/elements/misc/GlitchingMoon";

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

jest.mock('@/lib/milestones/MilestoneEvents', () => ({
    isMilestoneUnlocked: jest.fn(),
}));

jest.mock('@/lib/milestones/MilestoneService', () => ({
    unlockMilestone: jest.fn(),
}));

jest.mock('@/data/milestones', () => ({
    MILESTONES: {
        KABOOM: {
            id: 'kaboom-milestone',
            imageKey: 'kaboom-image',
        },
    },
}));

jest.mock('@/styles/animations.module.css', () => ({
    animate_glitch: 'animate-glitch',
    animate_shake_light: 'animate-shake-light',
    animate_shake_medium: 'animate-shake-medium',
    animate_shake_heavy: 'animate-shake-heavy',
    animate_shake_extreme: 'animate-shake-extreme',
    animate_visual_explosion: 'animate-visual-explosion',
}));

describe('GlitchingMoon', () => {
    const mockPush = jest.fn();
    const mockRouter = {
        push: mockPush,
        pathname: '/',
        query: {},
        asPath: '/',
        locale: 'de',
    };

    beforeEach(() => {
        jest.useFakeTimers();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(false);
        (unlockMilestone as jest.Mock).mockResolvedValue(undefined);
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    it('should render moon with initial visible state', () => {
        render(<GlitchingMoon />);
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);
        expect(moon).toBeInTheDocument();
        expect(moon.parentElement).toHaveClass('opacity-25');
    });

    it('should trigger glitch effect after 5000ms when visible', () => {
        render(<GlitchingMoon />);
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);

        expect(moon).not.toHaveClass('animate-glitch');

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(moon).toHaveClass('animate-glitch');

        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(moon).not.toHaveClass('animate-glitch');
    });

    it('should not trigger glitch when exploding', () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;

        // Trigger explosion
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);

        jest.advanceTimersByTime(5000);
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);
        expect(moon).not.toHaveClass('animate-glitch');
    });

    it('should increment click count and apply shake_light on first click', () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);

        fireEvent.click(container);
        expect(moon).toHaveClass('animate-shake-light');
    });

    it('should apply shake_medium on second click', () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);

        fireEvent.click(container);
        fireEvent.click(container);
        expect(moon).toHaveClass('animate-shake-medium');
    });

    it('should apply shake_heavy on third click', () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);

        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        expect(moon).toHaveClass('animate-shake-heavy');
    });

    it('should apply shake_extreme on fourth click', () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);

        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        expect(moon).toHaveClass('animate-shake-extreme');
    });

    it('should reset click count after 2000ms of inactivity', () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);

        fireEvent.click(container);
        expect(moon).toHaveClass('animate-shake-light');

        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(moon).not.toHaveClass('animate-shake-light');
    });

    it('should reset timer on consecutive clicks', () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);

        fireEvent.click(container);
        act(() => {
            jest.advanceTimersByTime(1500);
        });

        fireEvent.click(container);
        act(() => {
            jest.advanceTimersByTime(1500);
        });

        // Should still have shake because timer was reset
        expect(moon).toHaveClass('animate-shake-medium');

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(moon).not.toHaveClass('animate-shake-medium');
    });

    it('should trigger explosion on fifth click and unlock milestone when locale is de', async () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;

        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);

        await waitFor(() => {
            expect(isMilestoneUnlocked).toHaveBeenCalledWith('kaboom-milestone');
        });

        expect(unlockMilestone).toHaveBeenCalledWith('kaboom-milestone', 'kaboom-image', 'de');
    });

    it('should trigger explosion and use en locale when router.locale is en', async () => {
        (useRouter as jest.Mock).mockReturnValue({ ...mockRouter, locale: 'en' });

        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;

        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith('kaboom-milestone', 'kaboom-image', 'en');
        });
    });

    it('should default to de locale when router.locale is neither de nor en', async () => {
        (useRouter as jest.Mock).mockReturnValue({ ...mockRouter, locale: 'fr' });

        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;

        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);

        await waitFor(() => {
            expect(unlockMilestone).toHaveBeenCalledWith('kaboom-milestone', 'kaboom-image', 'de');
        });
    });

    it('should not unlock milestone if already unlocked', async () => {
        (isMilestoneUnlocked as jest.Mock).mockResolvedValue(true);

        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;

        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);

        await waitFor(() => {
            expect(isMilestoneUnlocked).toHaveBeenCalledWith('kaboom-milestone');
        });

        expect(unlockMilestone).not.toHaveBeenCalled();
    });

    it('should set moon to invisible during explosion and visible again after 5000ms', async () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;

        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);

        await act(async () => {
            await Promise.resolve();
        });

        expect(container).toHaveClass('opacity-0');

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        await waitFor(() => {
            expect(container).toHaveClass('opacity-25');
        })
    });

    it('should stop exploding state after 500ms', async () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);

        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);

        await act(async () => {
            await Promise.resolve();
        });

        expect(moon).toHaveClass('animate-visual-explosion');

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(moon).not.toHaveClass('animate-visual-explosion');
    });

    it('should ignore clicks when exploding', async () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);

        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);

        await act(async () => {
            await Promise.resolve();
        });

        // Try clicking during explosion
        fireEvent.click(container);
        fireEvent.click(container);

        expect(moon).not.toHaveClass('animate-shake-light');
    });

    it('should ignore clicks when not visible', () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);

        // Trigger explosion to make invisible
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);

        // Try clicking while invisible
        fireEvent.click(container);
        expect(moon).not.toHaveClass('animate-shake-light');
    });

    it('should reset click count to 0 after explosion', async () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);

        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);

        await waitFor(() => {
            expect(isMilestoneUnlocked).toHaveBeenCalled();
        });

        // Wait for visibility to return
        act(() => {
            jest.advanceTimersByTime(5000);
        });

        // Click once - should show light shake (click count was reset)
        fireEvent.click(container);
        expect(moon).toHaveClass('animate-shake-light');
    });

    it('should not trigger glitch when exploded is true', () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);

        // Trigger explosion
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);

        // Advance past explosion animation
        jest.advanceTimersByTime(500);

        // Try to trigger glitch
        jest.advanceTimersByTime(5000);

        // Should not glitch because exploded is true
        expect(moon).not.toHaveClass('animate-glitch');
    });

    it('should have pointer-events-none when not visible or exploding', () => {
        render(<GlitchingMoon />);
        const container = screen.getByAltText(/Moon ~ Bl4cklist/i).parentElement!;
        const moon = screen.getByAltText(/Moon ~ Bl4cklist/i);

        expect(moon).not.toHaveClass('pointer-events-none');

        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);
        fireEvent.click(container);

        expect(moon).toHaveClass('pointer-events-none');
    });
});