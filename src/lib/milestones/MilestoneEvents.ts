import {hashId} from "@/lib/milestones/MilestoneService";

/**
 * Returns an array of unlocked milestone hashes from localStorage.
 *
 * Retrieves the stored milestone hashes from the browser's localStorage, parses them as a string array,
 * and returns the result. If no milestones are stored, an empty array is returned.
 *
 * @returns {string[]} - Array of unlocked milestone hashes.
 */
export function getUnlockedMilestones(): string[] {
    const stored: string | null = localStorage.getItem('milestones');
    return stored ? JSON.parse(stored) : [];
}

/**
 * Checks if a milestone with the given ID is already unlocked.
 *
 * This function hashes the provided milestone ID and checks if the resulting hash exists in the list of unlocked
 * milestones stored in localStorage. Returns a promise that resolves to true if the milestone is unlocked, otherwise false.
 *
 * @param {string} id - The milestone ID to check.
 * @returns {Promise<boolean>} - Promise resolving to true if the milestone is unlocked, otherwise false.
 */
export async function isMilestoneUnlocked(id: string): Promise<boolean> {
    const hash: string = await hashId(id);
    return getUnlockedMilestones().includes(hash);
}

/**
 * Returns the IDs of all unlocked milestones by comparing hashes.
 *
 * This function takes an array of all possible milestones, hashes each ID, and checks if the hash exists in localStorage.
 * Only milestones whose hashes are found in the unlocked list are returned as plain IDs.
 *
 * @param {Array<{ id: string }>} allMilestones - Array of all milestone objects with an `id` property.
 * @returns {Promise<string[]>} - Promise resolving to an array of unlocked milestone IDs.
 */
export async function getUnlockedMilestoneIds(allMilestones: Array<{ id: string }>): Promise<string[]> {
    const unlockedHashes: string[] = getUnlockedMilestones();
    const unlockedIds: string[] = [];

    for (const milestone of allMilestones) {
        const hash: string = await hashId(milestone.id);
        if (unlockedHashes.includes(hash)) {
            unlockedIds.push(milestone.id);
        }
    }

    return unlockedIds;
}