import {getUnlockedMilestones} from "@/lib/milestones/MilestoneEvents";
import confetti from "canvas-confetti";

/**
 * Generates a SHA-256 hash for a given milestone ID and salt.
 *
 * This function combines the provided ID with a salt from the environment variable, encodes the result,
 * and calculates its SHA-256 hash using the Web Crypto API. The hash is returned as a hexadecimal string.
 *
 * @param {string} id - The milestone ID to hash.
 * @returns {Promise<string>} - A promise that resolves to the hexadecimal SHA-256 hash string.
 */
export async function hashId(id: string): Promise<string> {
    const encoder: TextEncoder = new TextEncoder();
    const data: Uint8Array<ArrayBuffer> = encoder.encode(id + process.env.EASTER_SALT);
    const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray: number[] = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map((b: number): string => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Unlocks a milestone, triggers effects, and stores progress.
 *
 * This function hashes the given milestone ID, checks if it is already unlocked, and if not, adds it to localStorage.
 * It dispatches a custom event to notify other components in the same tab and triggers a visual effect.
 * Returns true if the milestone was newly unlocked, or false if it was already unlocked.
 *
 * @param {string} id - The milestone ID to unlock.
 * @param {string} imageKey - The key for the milestone image to display.
 * @param {'de' | 'en'} [locale='de'] - The locale for the milestone image.
 * @returns {Promise<boolean>} - Promise resolving to true if newly unlocked, otherwise false.
 */
export async function unlockMilestone(id: string, imageKey: string, locale: 'de' | 'en' = 'de'): Promise<boolean> {
    const hash: string = await hashId(id);
    const unlocked: string[] = getUnlockedMilestones();
    if (unlocked.includes(hash)) return false;

    unlocked.push(hash);
    localStorage.setItem('milestones', JSON.stringify(unlocked));

    // Dispatch custom event to notify components in the SAME tab
    window.dispatchEvent(new CustomEvent('milestoneUnlocked', {detail: { hash, id, imageKey, locale }}));

    triggerMilestoneEffect(imageKey, locale);
    return true;
}

/**
 * Triggers a confetti animation and displays a milestone image with slide-in and fade-out effects.
 *
 * This function creates a confetti burst from both sides of the screen and animates an achievement image
 * sliding in from the bottom. The image remains visible for a short duration before fading out and being removed.
 * Used to visually celebrate the unlocking of a milestone.
 *
 * @param {string} imageKey - The key identifying the milestone image to display.
 * @param {'de' | 'en'} locale - The locale for the milestone image.
 */
function triggerMilestoneEffect(imageKey: string, locale: 'de' | 'en'): void {
    const colors: string[] = ['#feff01', '#FF7F50'];

    confetti({particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors, zIndex: 9999});
    confetti({particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors, zIndex: 9999});

    // Create and animate image dynamically (to avoid pasting a component in many other files)
    const img: HTMLImageElement = document.createElement('img');
    img.src = `/images/achievements/achievement-${locale}-${imageKey}.png`;
    img.alt = 'Milestone Unlocked - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server';
    img.style.cssText = `position: fixed; bottom: -300px; left: 50%; transform: translateX(-50%); width: 400px; 
                         max-width: 90vw; z-index: 9998; pointer-events: none; 
                         transition: bottom 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);`;
    document.body.appendChild(img);
    requestAnimationFrame((): void => { img.style.bottom = '30px'; });

    setTimeout((): void => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.8s ease-out';
        setTimeout((): void => img.remove(), 800);
    }, 3000);
}
