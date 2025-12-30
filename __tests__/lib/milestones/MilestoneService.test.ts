// noinspection DuplicatedCode

import confetti from "canvas-confetti";
import { saveUserMilestones } from "@/lib/api";
import {hashId, unlockMilestone} from "@/lib/milestones/MilestoneService";
import { TextEncoder, TextDecoder } from 'util';
import { webcrypto } from 'crypto';
import {getUnlockedMilestones} from "@/lib/milestones/MilestoneEvents";

// Global-Mocks
if (!global.TextEncoder) {
    (global as any).TextEncoder = TextEncoder;
    (global as any).TextDecoder = TextDecoder;
}

if (!global.crypto) {
    (global as any).crypto = webcrypto;
} else if (!global.crypto.subtle) {
    (global as any).crypto.subtle = webcrypto.subtle;
}

// Mocks
jest.mock("canvas-confetti");
jest.mock("@/lib/api", () => ({saveUserMilestones: jest.fn()}));
jest.mock("@/lib/milestones/MilestoneEvents", () => ({
    __esModule: true,
    getUnlockedMilestones: jest.fn(),
}));

describe('MilestoneService', () => {
    const OLD_ENV = process.env;
    const mockHash = '010203';

    beforeEach(() => {
        jest.useFakeTimers();
        process.env = { ...OLD_ENV, NEXT_PUBLIC_EASTER_SALT: 'test-salt' };
        (getUnlockedMilestones as jest.Mock).mockReset();
        (getUnlockedMilestones as jest.Mock).mockReturnValue([]);
        (saveUserMilestones as jest.Mock).mockReset();

        // LocalStorage Mock
        const mockStorage: Record<string, string> = {};
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn((key) => mockStorage[key] || null),
                setItem: jest.fn((key, value) => { mockStorage[key] = value; }),
            },
            writable: true
        });

        // Crypto Mock for hashId
        Object.defineProperty(global, 'crypto', {
            value: {
                subtle: {
                    digest: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer),
                },
            },
        });

        // RequestAnimationFrame Mock
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
            cb(0);
            return 0;
        });
    });

    afterEach(() => {
        process.env = OLD_ENV;
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
        document.body.innerHTML = '';
    });

    describe('hashId', () => {
        it('should correctly hash the id with salt and return hex string', async () => {
            const result = await hashId('milestone1');

            expect(result).toBe('010203');
            expect(global.crypto.subtle.digest).toHaveBeenCalled();
        });
    });

    describe('unlockMilestone', () => {
        it('should return false if milestone is already unlocked', async () => {
            (getUnlockedMilestones as jest.Mock).mockReturnValue([mockHash]);

            const result = await unlockMilestone('milestone1', 'imageKey');

            expect(result).toBe(false);
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });

        it('should unlock a new milestone, dispatch event and trigger effects', async () => {
            const hash = '010203';
            (getUnlockedMilestones as jest.Mock).mockReturnValue([]);
            const dispatchSpy = jest.spyOn(window, 'dispatchEvent');

            const result = await unlockMilestone('id1', 'imageK', 'en');

            expect(result).toBe(true);
            expect(localStorage.setItem).toHaveBeenCalledWith('milestones', JSON.stringify([hash]));
            expect(dispatchSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
            expect(dispatchSpy.mock.calls[0][0].type).toBe('milestoneUnlocked');
            // @ts-ignore
            expect(dispatchSpy.mock.calls[0][0].detail).toEqual({
                hash, id: 'id1', imageKey: 'imageK', locale: 'en'
            });

            // Check Confetti
            expect(confetti).toHaveBeenCalledTimes(2);
        });

        it('should save progress if user_id is present in localStorage', async () => {
            (getUnlockedMilestones as jest.Mock).mockReturnValue(['new-hash']);
            (window.localStorage.getItem as jest.Mock).mockImplementation((key) => {
                if (key === 'user_id') return ' user123 '; // with whitespace to test .trim()
                return null;
            });

            await unlockMilestone('id1', 'key');

            expect(saveUserMilestones).toHaveBeenCalledWith('user123', ['new-hash', '010203']);
        });

        it('should not call saveUserMilestones if user_id is missing', async () => {
            (getUnlockedMilestones as jest.Mock).mockReturnValue(['hash']);
            (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

            await unlockMilestone('id1', 'key');

            expect(saveUserMilestones).not.toHaveBeenCalled();
        });

        it('should handle the full animation lifecycle (DOM insertion and removal)', async () => {
            (getUnlockedMilestones as jest.Mock).mockReturnValue([]);

            await unlockMilestone('id', 'key', 'de');

            const img = document.querySelector('img') as HTMLImageElement;
            expect(img).toBeInTheDocument();
            expect(img.src).toContain('/images/achievements/achievement-de-key.webp');

            expect(img.style.bottom).toBe('30px');

            jest.advanceTimersByTime(3000);
            expect(img.style.opacity).toBe('0');

            jest.advanceTimersByTime(800);
            expect(document.querySelector('img')).toBeNull();
        });

        it('should use default locale "de" if none is provided', async () => {
            (getUnlockedMilestones as jest.Mock).mockReturnValue([]);
            await unlockMilestone('id', 'key'); // locale missing

            const img = document.querySelector('img');
            expect(img?.getAttribute('src')).toContain('-de-key.webp');
        });
    });
});