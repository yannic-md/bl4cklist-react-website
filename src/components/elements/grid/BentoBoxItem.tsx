import {JSX, useEffect, useState} from "react";
import {AnimateOnView} from "@/components/animations/AnimateOnView";
import Image from "next/image";
import animations from "@/styles/util/animations.module.css";
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {MILESTONES} from "@/data/milestones";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";
import {NextRouter, useRouter} from "next/router";

interface BentoBoxItemProps {
    animation: string;
    backgroundImage: string;
    showcaseImage: string;
    showcaseAlt: string;
    showcaseTitle?: string;
    title: string;
    description: string;
    maxWidth?: string;
    minHeight?: string;
    showcaseWidth?: number;
    showcaseHeight?: number;
    hoverRotation?: "left" | "right";
    showcaseMaxWidth?: string;
    hasBug?: boolean;
}

/**
 * Renders an animated, responsive card containing:
 *  - a full-bleed background image,
 *  - a centered showcase image with optional hover rotation/scale effects,
 *  - and a title with a short description overlay.
 *
 * Props:
 * @param {BentoBoxItemProps} props - The used props
 * @param {string} props.animation - Animation name passed to AnimateOnView.
 * @param {string} props.backgroundImage - URL or import for the background Image component.
 * @param {string} props.showcaseImage - URL or import for the showcase Image component.
 * @param {string} props.showcaseAlt - Alt text for the showcase Image.
 * @param {string} [props.showcaseTitle] - Optional title attribute for the showcase Image.
 * @param {string} props.title - Heading text displayed above the description.
 * @param {string} props.description - Supporting descriptive text.
 * @param {string} [props.maxWidth='w-full'] - Tailwind width utility applied to the root container.
 * @param {string} [props.minHeight='min-h-[376px]'] - Tailwind min-height utility applied to the root container.
 * @param {number} [props.showcaseWidth=594] - Intrinsic width forwarded to Next/Image for the showcase.
 * @param {number} [props.showcaseHeight=301] - Intrinsic height forwarded to Next/Image for the showcase.
 * @param {'left'|'right'} [props.hoverRotation='left'] - Determines hover rotation direction for the showcase image.
 * @param {string} [props.showcaseMaxWidth] - Tailwind max-width utilities for the showcase container.
 * @param {boolean} [props.hasBug=false] - Whether this item should display a bug.
 *
 * @returns {JSX.Element} - The composed, animated card element.
 */
export default function BentoBoxItem({animation, backgroundImage, showcaseImage, showcaseAlt, showcaseTitle, title,
                                      description, maxWidth = "w-full", minHeight = "min-h-[376px]", showcaseWidth = 594,
                                      showcaseHeight = 301, hoverRotation = "left", hasBug = false,
                                      showcaseMaxWidth = "max-w-[320px] sm:max-w-[400px] md:max-w-[450px] " +
                                                         "lg:max-w-[500px] xl:max-w-full"}: BentoBoxItemProps): JSX.Element {
    const rotationClass: "hover:-rotate-1" | "hover:rotate-1" = hoverRotation === "left" ? "hover:-rotate-1" : "hover:rotate-1";
    const [bugPosition, setBugPosition] = useState<{ position: 'top' | 'right' | 'bottom' | 'left' | 'top-left' |
            'top-right' | 'bottom-left' | 'bottom-right'; rotation: number } | null>(null);
    const [isBugSquashed, setIsBugSquashed] = useState(false);
    const router: NextRouter = useRouter();

    /**
     * Initializes a random bug position when `hasBug` is enabled.
     *
     * Runs whenever `hasBug` changes. If `hasBug` is true the effect picks a random position
     * among predefined corners and edges and stores it in component state. Each position
     * includes a rotation value so the bug can be oriented toward the card center.
     *
     * @param {boolean} hasBug - Flag indicating whether a bug should be shown.
     * @param setBugPosition - State setter to store the selected position and rotation.
     */
    useEffect((): void => {
        if (hasBug) {
            const positions = [
                // Corners
                { position: 'top-left' as const, rotation: -45 },       // ↘
                { position: 'top-right' as const, rotation: -135 },     // ↙
                { position: 'bottom-left' as const, rotation: 45 },     // ↗
                { position: 'bottom-right' as const, rotation: -30 },   // ↖
                // Edges
                { position: 'top' as const, rotation: 180 },            // ↓
                { position: 'right' as const, rotation: -90 },          // ←
                { position: 'bottom' as const, rotation: 45 },          // ↑
                { position: 'left' as const, rotation: 100 },           // →
            ];

            setBugPosition(positions[Math.floor(Math.random() * positions.length)]);
        }
    }, [hasBug]);

    /**
     * Get inline CSS style object for the bug button based on a named position.
     *
     * Returns a small set of inline styles suitable for applying to the bug button
     * so it visually sits on one of the card's edges or corners. If an unknown
     * position is provided the base sizing styles are returned without positional offsets.
     *
     * @param {string} position -The position where to place the bug.
     * @returns {Record<string, string>} - An object of CSS properties and values for inline styling.
     */
    const getBugPositionStyles: (position: string) => Record<string, string> = (position: string): Record<string, string> => {
        const baseStyles = {fontSize: '22px'};

        switch (position) {
            case 'top-left':
                return { ...baseStyles, top: '-16px', left: '-10px' };
            case 'top-right':
                return { ...baseStyles, top: '-10px', right: '-8px' };
            case 'bottom-left':
                return { ...baseStyles, bottom: '-8px', left: '-8px' };
            case 'bottom-right':
                return { ...baseStyles, bottom: '-8px', right: '-8px' };
            case 'top':
                return { ...baseStyles, top: '-14px', left: '43%', transform: 'translateX(-50%)' };
            case 'bottom':
                return { ...baseStyles, bottom: '-12px', left: '59%', transform: 'translateX(-50%)' };
            case 'left':
                return { ...baseStyles, left: '-12px', top: '47%', transform: 'translateY(-50%)' };
            case 'right':
                return { ...baseStyles, right: '-12px', top: '54%', transform: 'translateY(-50%)' };
            default:
                return baseStyles;
        }
    };

    /**
     * Squash the on-card bug and unlock the related milestone if necessary.
     *
     * Marks the bug as squashed in component state, then checks whether the milestone
     * is already unlocked. If it is not unlocked, the function attempts to unlock it
     * using the current locale.
     *
     * @returns {Promise<void>} - Resolves when state update and any milestone unlock operation complete.
     */
    const handleBugClick: () => Promise<void> = async (): Promise<void> => {
        setIsBugSquashed(true);

        const alreadyUnlocked: boolean = await isMilestoneUnlocked(MILESTONES.WHATBUG.id);
        if (!alreadyUnlocked) {
            await unlockMilestone(MILESTONES.WHATBUG.id, MILESTONES.WHATBUG.imageKey,
                (router.locale === "de" || router.locale === "en") ? router.locale : "de");
        }
    };

    return (
        <AnimateOnView animation={animation} className={`relative flex flex-col justify-end items-start overflow-visible
                                                         w-full transition-all duration-200 ${maxWidth} ${minHeight} p-6 
                                                         border border-white/[0.08] rounded-lg group`}>
            {/* Background Image Wrapper */}
            <div className="absolute inset-0 -z-10">
                <Image src={backgroundImage} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 602px"
                    alt={`Bentobox Background - ${title}`} className="object-cover object-center pointer-events-none
                                                                      group-hover:brightness-125 transition-all duration-200" />
            </div>

            {/* A little bug.. */}
            {hasBug && bugPosition && (
                <button onClick={handleBugClick} aria-label="Bug - click to squash!"
                        className={`absolute z-[3] transition-all duration-200 
                                    ${!isBugSquashed ? `!cursor-pointer ${animations.animate_little_shake} hover:scale-125` 
                                                     : `pointer-events-none ${animations.animate_squash}`}`}
                        style={{...getBugPositionStyles(bugPosition.position), rotate: `${bugPosition.rotation}deg`}}>
                    🐞
                </button>
            )}

            {/* Showcase Image */}
            <div className={`inline-block self-center my-auto mt-0 max-h-[70%] overflow-hidden border-2
                             border-gray-700/50 rounded-4xl drop-shadow-2xl transition-all duration-200
                             ${rotationClass} hover:-translate-y-1 hover:scale-105 w-full
                             ${showcaseMaxWidth} mb-7 xl:mb-auto`}>
                <Image src={showcaseImage} width={showcaseWidth} height={showcaseHeight} unoptimized alt={showcaseAlt}
                       title={showcaseTitle} data-cursor-special loading={"lazy"}
                       className="w-full h-auto object-contain opacity-65 transition-opacity duration-200 hover:opacity-100" />
            </div>

            {/* Description */}
            <div className="relative z-[2] text-lg text-center w-full">
                <span className="font-medium text-white">{title}</span><br />
                <span className="text-base text-[#969cb1]">{description}</span>
            </div>
        </AnimateOnView>
    );
}
