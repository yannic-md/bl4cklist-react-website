import { renderHook, act } from '@testing-library/react';
import {getUnlockedMilestoneIds, getUnlockedMilestones} from "@/lib/milestones/MilestoneEvents";
import {useMilestones} from "@/hooks/useMilestones";
import { MILESTONES } from "@/data/milestones";

// mock external libs
jest.mock('@/lib/milestones/MilestoneEvents', () => ({
    getUnlockedMilestones: jest.fn(),
    getUnlockedMilestoneIds: jest.fn(),
}));

jest.mock('@/data/milestones', () => ({
    MILESTONES: {
        FIRST: { id: 'm1' },
        SECOND: { id: 'm2' },
    },
}));

describe('useMilestones', () => {
    const mockIds = ['m1', 'm2'];
    const mockMilestones = [{ id: 'm1' }, { id: 'm2' }];

    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();

        (getUnlockedMilestones as jest.Mock).mockReturnValue(mockMilestones);
        (getUnlockedMilestoneIds as jest.Mock).mockResolvedValue(mockIds);
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('should initialize with default values and fetch milestones on mount', async () => {
        let result: any;

        await act(async () => {
            const rendered = renderHook(() => useMilestones());
            result = rendered.result;
        });

        expect(getUnlockedMilestones).toHaveBeenCalled();
        expect(getUnlockedMilestoneIds).toHaveBeenCalledWith(Object.values(MILESTONES));

        expect(result.current.count).toBe(2);
        expect(result.current.unlockedIds).toEqual(mockIds);
    });

    it('should update state when "milestoneUnlocked" event is dispatched', async () => {
        const { result } = renderHook(() => useMilestones());

        const updatedIds = ['m1', 'm2', 'm3'];
        (getUnlockedMilestones as jest.Mock).mockReturnValue([...mockMilestones, { id: 'm3' }]);
        (getUnlockedMilestoneIds as jest.Mock).mockResolvedValue(updatedIds);

        await act(async () => {
            window.dispatchEvent(new CustomEvent('milestoneUnlocked'));
        });

        expect(result.current.count).toBe(3);
        expect(result.current.unlockedIds).toEqual(updatedIds);
    });

    it('should update state when "storage" event is dispatched (cross-tab sync)', async () => {
        const { result } = renderHook(() => useMilestones());

        const updatedIds = ['m1'];
        (getUnlockedMilestones as jest.Mock).mockReturnValue([{ id: 'm1' }]);
        (getUnlockedMilestoneIds as jest.Mock).mockResolvedValue(updatedIds);

        await act(async () => {
            window.dispatchEvent(new Event('storage'));
        });

        expect(result.current.count).toBe(1);
        expect(result.current.unlockedIds).toEqual(updatedIds);
    });

    it('should remove event listeners on unmount to prevent memory leaks', () => {
        const removeSpy = jest.spyOn(window, 'removeEventListener');
        const { unmount } = renderHook(() => useMilestones());

        unmount();

        expect(removeSpy).toHaveBeenCalledWith('milestoneUnlocked', expect.any(Function));
        expect(removeSpy).toHaveBeenCalledWith('storage', expect.any(Function));

        removeSpy.mockRestore();
    });

    it('should handle empty milestone states correctly', async () => {
        (getUnlockedMilestones as jest.Mock).mockReturnValue([]);
        (getUnlockedMilestoneIds as jest.Mock).mockResolvedValue([]);

        const { result } = renderHook(() => useMilestones());

        // wait for initial updateMilestones
        await act(async () => {});

        expect(result.current.count).toBe(0);
        expect(result.current.unlockedIds).toEqual([]);
    });
});