import React, {JSX, useState} from 'react';
import Image from "next/image";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import animations from "@/styles/util/animations.module.css";
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {MILESTONES} from "@/data/milestones";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";
import {NextRouter, useRouter} from "next/router";
import {useTranslations} from "next-intl";

/**
 * Renders a decorative gravestone that shows a tooltip on hover and unlocks a milestone when clicked.
 *
 * Displays a positioned gravestone image intended for large screens. It maintains local `isHovered` and `isClicked`
 * states to control a tooltip, hover animations and an exit animation. When clicked it marks the element as clicked.
 *
 * @returns {JSX.Element} - The rendered gravestone component with tooltip and interactive behavior.
 */
export default function DecorationalImage(): JSX.Element {
    const tMisc = useTranslations('Misc')
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const router: NextRouter = useRouter();

    /**
     * Handle click on the gravestone: mark clicked state and unlock a new milestone if not already unlocked.
     *
     * This asynchronous handler sets the local `isClicked` state to true to update the UI, then checks
     * whether a specific milestone is already unlocked.
     *
     * @returns {Promise<void>} - Resolves when the unlock check and potential unlock call complete.
     */
    const handleClick: () => void = async (): Promise<void> => {
        setIsClicked(true);

        const alreadyUnlocked: boolean = await isMilestoneUnlocked(MILESTONES.BOTSDEAD.id);
        if (!alreadyUnlocked) {
            await unlockMilestone(MILESTONES.BOTSDEAD.id, MILESTONES.BOTSDEAD.imageKey,
                (router.locale === "de" || router.locale === "en") ? router.locale : "de");
        }
    };

    return (
        <div className="hidden lg:block absolute -bottom-0.5 right-24 opacity-40">
            {/* Tooltip */}
            {isHovered && !isClicked && (
                <AnimateOnView animation={"animate__fadeIn animate__faster"}>
                    <div className="absolute w-48 bottom-full mb-4 right-0 bg-gray-900/95 text-white px-4 py-2
                                    rounded-lg shadow-xl border border-gray-700">
                        <p className="text-sm">{tMisc('ripBots')} 💐</p>
                        <div className="absolute bottom-0 right-14 transform translate-y-1/2 rotate-45 w-3 h-3
                                        bg-gray-900 border-r border-b border-gray-700"></div>
                    </div>
                </AnimateOnView>
            )}

            {/* Gravestone */}
            <div onMouseEnter={(): void => setIsHovered(true)} onClick={handleClick}
                 onMouseLeave={(): void => setIsHovered(false)}
                 className={`relative cursor-pointer transition-all duration-300 opacity-20 
                             ${isHovered && !isClicked ? 'scale-110 -translate-y-1.5' : 'scale-100'} 
                             ${isClicked ? animations.animate_slideOutRight : ''}`}>
                <AnimateOnView animation={"animate__fadeInRight animate__slower"}>
                    <div className="relative w-32 h-auto flex justify-center">
                        <Image src={"/images/icons/gravestone-128w.webp"} width={128} height={128}
                               alt="Gravestone - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                    </div>
                </AnimateOnView>
            </div>
        </div>
    );
}