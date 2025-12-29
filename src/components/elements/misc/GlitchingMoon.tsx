import {JSX, RefObject, useEffect, useRef, useState} from "react";
import animations from '@/styles/util/animations.module.css';
import {NextRouter, useRouter} from "next/router";
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {MILESTONES} from "@/data/milestones";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";
import Image from "next/image";

/**
 * Renders an interactive moon element that glitches periodically and can be triggered to "explode" by rapid clicks.
 *
 * This component displays a moon image that briefly performs a glitch animation at regular intervals while
 * visible and not exploding. Repeated clicks increase a local counter and apply progressively stronger shake animations;
 * when five rapid clicks are detected the moon runs an explosion sequence, becomes temporarily hidden, and
 * attempts to unlock a milestone via the milestone service.
 *
 * @returns {JSX.Element} - The rendered moon element with interactive glitch and explosion behaviors.
 */
export default function GlitchingMoon(): JSX.Element {
    const router: NextRouter = useRouter();
    const [isGlitching, setIsGlitching] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [isExploding, setIsExploding] = useState(false);
    const [exploded, setExploded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const clickTimerRef: RefObject<number | null> = useRef<number | null>(null);

    /**
     * Trigger periodic visual "glitch" on the moon element when visible and not exploding.
     *
     * This effect creates a repeating timer that briefly enables the `isGlitching` state
     * every 5000ms for a duration of 300ms, but only while the moon is visible and not
     * currently in an exploding state.
     */
    useEffect((): () => void => {
        const glitchInterval: NodeJS.Timeout = setInterval((): void => {
            if (isVisible && !isExploding && !exploded) {
                setIsGlitching(true);
                setTimeout((): void => setIsGlitching(false), 300);
            }
        }, 5000);

        return (): void => clearInterval(glitchInterval);
    }, [isVisible, isExploding]);

    /**
     * Incremental click handler that triggers a visual explosion after five rapid clicks.
     *
     * This handler increments an internal click counter each time the moon is clicked, resets the debounce timer
     * on every click, and if five clicks are reached it initiates an "explosion" sequence by updating the
     * `isExploding` and `isVisible` states. If fewer than five clicks occur, a timeout resets the counter.
     */
    const handleMoonClick: () => void = async (): Promise<void> => {
        if (isExploding || !isVisible) return;
        const newCount: number = clickCount + 1;

        setClickCount(newCount);
        if (clickTimerRef.current) { clearTimeout(clickTimerRef.current); } // reset timer on every click

        if (newCount >= 5) {
            setIsExploding(true);
            setClickCount(0);
            setIsVisible(false);
            setExploded(true);

            const alreadyUnlocked: boolean = await isMilestoneUnlocked(MILESTONES.KABOOM.id);
            if (!alreadyUnlocked) {
                await unlockMilestone(MILESTONES.KABOOM.id, MILESTONES.KABOOM.imageKey,
                    (router.locale === "de" || router.locale === "en") ? router.locale : "de");
            }

            // blend in again after 5s
            setTimeout((): void => { setIsExploding(false); }, 500);
            setTimeout((): void => { setIsVisible(true); }, 5000);
        } else {
            // reset after 2 seconds if not clicked again
            clickTimerRef.current = window.setTimeout((): void => { setClickCount(0); }, 2000);
        }
    };

    /**
     * Returns a CSS class representing the shake animation based on the current click count.
     *
     * Maps the internal click counter to a utility animation class that controls
     * how strongly the moon element should shake. If the click count is zero or out of the
     * defined range, an empty string is returned indicating no shake.
     *
     * @returns {string} - The animation class name or an empty string when no animation applies.
     */
    const getShakeIntensity: () => string = (): string => {
        if (clickCount === 1) return animations.animate_shake_light;
        else if (clickCount === 2) return animations.animate_shake_medium;
        else if (clickCount === 3) return animations.animate_shake_heavy;
        else if (clickCount === 4) return animations.animate_shake_extreme;
        else return '';
    };

    return (
        <div className={`absolute left-0 top-56 z-[3] transition-opacity duration-1000
                                 ${isVisible && !isExploding ? 'opacity-25' : 'opacity-0'}`}
             onClick={handleMoonClick}>
            <Image src="/images/bg/moon.svg" alt="Moon ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server"
                   className={`w-48 h-48 ml-10 !cursor-pointer
                                       ${isGlitching ? animations.animate_glitch : ''} 
                                       ${isExploding ? animations.animate_visual_explosion : getShakeIntensity()}
                                       ${isVisible && !isExploding ? '' : 'pointer-events-none'}`}
                   width={192} height={192} draggable={false} />
        </div>
    );
};