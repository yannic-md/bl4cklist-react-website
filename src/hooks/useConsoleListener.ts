import { useEffect } from 'react';
import {sadFace} from "@/types/APIResponse";
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {MILESTONES} from "@/data/milestones";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";
import {NextRouter, useRouter} from "next/router";
import {useTranslations} from "next-intl";

declare global {
    interface Window {
        hugIsaac?: () => void;
    }
}

/**
 * React hook that listens for console interactions and unlocks a milestone when a specific user-action is performed.
 *
 * This hook displays a playful message in the browser console, inviting users to call a custom function (`hugIsaac`)
 * to interact with a character.
 *
 * When the user executes this function in the console, a custom event is dispatched, which triggers the unlocking of
 * a milestone if it has not already been unlocked. The hook ensures proper cleanup by removing the custom function
 * from the global window object when the component is unmounted.
 */
export default function useConsoleListener(): void {
    const router: NextRouter = useRouter();
    const tGenericMenu = useTranslations('GenericMenu');

    /**
     * React hook that listens for console opening and unlocks a milestone when a specific action is triggered.
     *
     * This hook sets a playful message in the browser console when the user opens it, encouraging them to call a
     * custom function (`hugIsaac`) to "cheer up" a character. When the user does so, a custom event is dispatched,
     * which triggers the unlocking of a milestone if it hasn't been unlocked yet. The hook also ensures cleanup
     * by removing the custom function from the window object when the component unmounts.
     */
    useEffect((): () => void => {
        setTimeout((): void => {
            console.clear();
            console.log('%c' + sadFace, 'color:#FF7F50;font-weight:bold;');
            console.log(
                '%c' + tGenericMenu('isaacTitle') + '\n' + tGenericMenu('isaacTask') + '%chugIsaac() %c' +
                tGenericMenu('isaacTask2') + '\n%c⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻', 'font-weight:bold;',
                'color:#FF7F50;font-weight:bold;', 'font-weight:bold;', 'color:#596275;font-weight:bold;');

            window.hugIsaac = (): void => {
                console.clear();
                console.log(
                    `%c💗 ` + tGenericMenu('isaacEnd'),
                    'color:#78e08f;font-size:16px;font-weight:bold;'
                );

                document.dispatchEvent( new CustomEvent('console-join', {}) );
            };
        }, 1000);

        const handleConsoleJoin: () => Promise<void> = async (): Promise<void> => {
            const alreadyUnlocked: boolean = await isMilestoneUnlocked(MILESTONES.PACMAN.id);
            if (!alreadyUnlocked) {
                await unlockMilestone(MILESTONES.PACMAN.id, MILESTONES.PACMAN.imageKey,
                    (router.locale === "de" || router.locale === "en") ? router.locale : "de");
            }
        };

        document.addEventListener('console-join', handleConsoleJoin);
        return (): void => { if (window.hugIsaac) { delete window.hugIsaac; } };  // Cleanup
    }, []);
}