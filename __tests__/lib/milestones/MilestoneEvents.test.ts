// noinspection DuplicatedCode

import {getUnlockedMilestoneIds, getUnlockedMilestones, isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import { TextEncoder, TextDecoder } from 'util';
import { webcrypto } from 'crypto';

// Mocks
if (!global.TextEncoder) {
    (global as any).TextEncoder = TextEncoder;
    (global as any).TextDecoder = TextDecoder;
}

if (!global.crypto) {
    (global as any).crypto = webcrypto;
} else if (!global.crypto.subtle) {
    (global as any).crypto.subtle = webcrypto.subtle;
}

const mockHashId = jest.fn();
jest.mock('@/lib/milestones/MilestoneService', () => ({
    __esModule: true,
    hashId: (id: string) => mockHashId(id),
}));

(global as any).hashId = mockHashId;

describe('MilestoneEvents', () => {

    beforeEach(() => {
        jest.useFakeTimers();

        storage = {};
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => storage[key] || null);
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
            storage[key] = value.toString();
        });

        mockHashId.mockImplementation(async (id: string) => `hashed_${id}`);
    });

    let storage: Record<string, string> = {};

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    describe('getUnlockedMilestones', () => {
        it('should return an empty array if localStorage is empty (Branch: !stored)', () => {
            const result = getUnlockedMilestones();

            expect(result).toEqual([]);
            expect(localStorage.getItem).toHaveBeenCalledWith('milestones');
        });

        it('should return parsed array if localStorage contains data (Branch: stored)', () => {
            const mockData = ['hash1', 'hash2'];
            storage['milestones'] = JSON.stringify(mockData);

            const result = getUnlockedMilestones();

            expect(result).toEqual(mockData);
            expect(result).toHaveLength(2);
        });
    });

    describe('isMilestoneUnlocked', () => {
        it('should return true if hashed id is in localStorage', async () => {
            const id = 'milestone-1';
            const expectedHash = 'hashed_milestone-1';
            storage['milestones'] = JSON.stringify([expectedHash]);

            const result = await isMilestoneUnlocked(id);

            expect(mockHashId).toHaveBeenCalledWith(id);
            expect(result).toBe(true);
        });

        it('should return false if hashed id is not in localStorage', async () => {
            const id = 'milestone-1';
            storage['milestones'] = JSON.stringify(['other-hash']);

            const result = await isMilestoneUnlocked(id);

            expect(result).toBe(false);
        });

        it('should handle empty storage correctly', async () => {
            const result = await isMilestoneUnlocked('any-id');
            expect(result).toBe(false);
        });
    });

    describe('getUnlockedMilestoneIds', () => {
        const allMilestones = [
            { id: 'm1' },
            { id: 'm2' },
            { id: 'm3' }
        ];

        it('should return only the IDs of milestones that are unlocked (Filter logic)', async () => {
            storage['milestones'] = JSON.stringify(['hashed_m1', 'hashed_m3']);

            const result = await getUnlockedMilestoneIds(allMilestones);

            // m2 was hashed, but not in the storage -> m2 missing
            expect(result).toEqual(['m1', 'm3']);
            expect(mockHashId).toHaveBeenCalledTimes(3);
        });

        it('should return an empty array if no milestones match', async () => {
            storage['milestones'] = JSON.stringify(['non-existent-hash']);

            const result = await getUnlockedMilestoneIds(allMilestones);

            expect(result).toEqual([]);
        });

        it('should return an empty array if input list is empty', async () => {
            storage['milestones'] = JSON.stringify(['hashed_m1']);

            const result = await getUnlockedMilestoneIds([]);

            expect(result).toEqual([]);
            expect(mockHashId).not.toHaveBeenCalled();
        });

        it('should process each milestone sequentially in the loop', async () => {
            storage['milestones'] = JSON.stringify(['hashed_m1', 'hashed_m2']);

            const result = await getUnlockedMilestoneIds(allMilestones);

            expect(mockHashId).toHaveBeenNthCalledWith(1, 'm1');
            expect(mockHashId).toHaveBeenNthCalledWith(2, 'm2');
            expect(mockHashId).toHaveBeenNthCalledWith(3, 'm3');
            expect(result).toHaveLength(2);
        });
    });
});