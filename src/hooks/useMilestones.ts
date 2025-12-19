import { useState, useEffect } from 'react';
import {MILESTONES} from "@/data/milestones";
import {getUnlockedMilestoneIds, getUnlockedMilestones} from "@/lib/milestones/MilestoneEvents";

/**
 * Custom React hook to manage and synchronize unlocked milestones state across browser tabs.
 *
 * This hook initializes and tracks the number and IDs of unlocked milestones, updating the state
 * when milestones are unlocked either in the current tab (via custom events) or in other tabs (via storage events).
 * It ensures milestone progress is always up-to-date and consistent across multiple browser contexts.
 *
 * @returns {{ count: number, unlockedIds: string[] }} - An object containing the count of unlocked milestones and their IDs.
 */
export function useMilestones(): { count: number; unlockedIds: string[]; } {
    const [count, setCount] = useState(0);
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

    /**
     * Updates the milestone state by fetching the current count and unlocked milestone IDs.
     *
     * This function retrieves the number of unlocked milestones and their IDs asynchronously,
     * ensuring the state reflects the latest milestone progress. It is used to synchronize
     * milestone data across browser tabs and custom events.
     *
     * @returns {Promise<void>} - Resolves when the milestone state has been updated.
     */
    const updateMilestones: () => Promise<void> = async (): Promise<void> => {
        setCount(getUnlockedMilestones().length);
        const ids: string[] = await getUnlockedMilestoneIds(Object.values(MILESTONES));
        setUnlockedIds(ids);
    };

    /**
     * React hook to manage and track unlocked milestones across browser tabs.
     *
     * Initializes milestone state on mount and sets up event listeners for both custom milestone unlock events
     * (within the same tab) and storage events (across tabs). Ensures the milestone state stays synchronized when
     * milestones are unlocked or when changes occur in other tabs.
     */
    useEffect((): () => void => {
        void updateMilestones();  // Initial load

        // Listen for milestone unlocks in the SAME (custom event) & OTHER (storage event) tab
        const handleMilestoneUnlock: () => void = (): void => { void updateMilestones(); };
        const handleStorageChange: () => void = (): void => { void updateMilestones(); };

        window.addEventListener('milestoneUnlocked', handleMilestoneUnlock);
        window.addEventListener('storage', handleStorageChange);

        return (): void => {
            window.removeEventListener('milestoneUnlocked', handleMilestoneUnlock);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return { count, unlockedIds };
}