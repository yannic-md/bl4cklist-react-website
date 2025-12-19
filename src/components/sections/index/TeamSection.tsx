import {JSX, RefObject, useEffect, useRef, useState} from "react";
import { AnimatedTextReveal } from "@/components/animations/TextReveal";
import { AnimateOnView } from "@/components/animations/AnimateOnView";
import { useTranslations } from "next-intl";

import colors from '../../../styles/util/colors.module.css';
import index from '../../../styles/components/index.module.css';
import animations from '@/styles/util/animations.module.css';
import TeamMemberCard from "@/components/elements/grid/TeamMemberCard";
import Image from "next/image";
import {Member} from "@/types/Member";
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {MILESTONES} from "@/data/milestones";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";
import {NextRouter, useRouter} from "next/router";

interface TeamSectionProps {
    teamMembers: Member[] | null;
}

/**
 * Renders the Discord server team section with animated elements and team member cards.
 *
 * Displays a headline, description, and a grid of team members with individual animations
 * based on their position in the grid. Uses translations for all texts and applies
 * responsive TailwindCSS styling.
 *
 * @param {TeamSectionProps} props - Component configuration
 * @param {Member[]} props.teamMembers - The loaded api data for all team members.
 * @returns {JSX.Element} The rendered team section component.
 */
export default function TeamSection({ teamMembers: apiTeamMembers }: TeamSectionProps): JSX.Element {
    const tTeam = useTranslations('TeamSection');
    const router: NextRouter = useRouter();
    const [isGlitching, setIsGlitching] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [isExploding, setIsExploding] = useState(false);
    const [exploded, setExploded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const clickTimerRef: RefObject<number | null> = useRef<number | null>(null);

    // fetched Team member data (or fallback)
    const teamMembers: Member[] = apiTeamMembers ?? [ // fallback data for SSR
        { user_name: 'yannicde', user_display_name: 'Yannic 🦙', rank: 'LEITUNG', user_id: '327176944640720906',
          user_avatar_url: 'https://cdn.discordapp.com/avatars/327176944640720906/a_c261a382dc3b0ebe95d6304eb452c854.gif?size=128',
          social_media_url: null },
    ];

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
        if (clickCount === 0) return '';
        if (clickCount === 1) return animations.animate_shake_light;
        if (clickCount === 2) return animations.animate_shake_medium;
        if (clickCount === 3) return animations.animate_shake_heavy;
        if (clickCount === 4) return animations.animate_shake_extreme;
        return '';
    };

    /**
     * Determines the appropriate animation class for a team member based on their position in a grid layout.
     * 
     * @param index - The zero-based index of the team member in the array
     * @param totalMembers - The total number of team members
     * @returns The CSS animation class name to apply to the team member element
     */
    const getTeamMemberAnimation = (index: number, totalMembers: number): string => {
        const rowIndex: number = Math.floor(index / 3);
        const colIndex: number = index % 3;
        const totalRows: number = Math.ceil(totalMembers / 3);
        
        if (colIndex === 0) {
            if (totalMembers === 4) {
                return "animate__fadeInRight"
            } else {
                return "animate__fadeInLeft";
            }
        } else if (colIndex === 2) {
            if (totalMembers === 4) {
                return "animate__fadeInLeft"
            } else {
                return "animate__fadeInRight";
            }
        } else if (colIndex === 1) {
            // Middle column - determine based on row position
            if (rowIndex === 0) { return "animate__fadeInDown";
            } else if (rowIndex === totalRows - 1) { return "animate__fadeInUp";
            } else { return "animate__fadeIn"; }
        }
        
        // Mid items in a mid row
        return "animate__fadeIn";
    };

    return (
        <section className="relative flex flex-col w-full gap-10 z-[2] bg-slate-900/30 px-10 
                            pt-24 pb-28 scroll-m-2.5 overflow-hidden justify-center" id="discord-server-team">

            {/* Decorational moon image */}
            <AnimateOnView animation="animate__fadeIn animate__slower z-[3]">
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
            </AnimateOnView>

            <div className="relative flex flex-col w-full z-[1] justify-center items-center gap-2.5">
                <div className="relative flex flex-col items-center gap-2.5 mb-10">
                    {/* Tag */}
                    <div className="font-bold tracking-wider mb-1">
                        <AnimateOnView animation="animate__fadeInLeft animate__slower">
                            <AnimatedTextReveal text={tTeam('infoTag')}
                                                className="text-sm text-[coral] uppercase
                                                            text-center lg:text-start pb-3 lg:pb-0"
                                                shadowColor="rgba(255,127,80,0.35)" />
                        </AnimateOnView>
                    </div>

                    {/* Headline */}
                    <AnimateOnView animation="animate__fadeInRight animate__slower">
                        <h2 className={`${index.head_border_center} max-w-[20ch] bg-clip-text text-transparent mb-6 
                                        ${colors.text_gradient_gray} my-0 font-semibold leading-[1.1] text-center lg:text-start
                                        text-[clamp(2rem,_1.3838rem_+_2.6291vw,_3.75rem)]`}>
                            <span className="inline-block align-middle leading-none -mx-[10px]
                                             text-white">🚔</span> - {tTeam('title')}
                        </h2>
                    </AnimateOnView>
                    <AnimateOnView animation="animate__fadeInUp animate__slower">
                        <p className="text-base max-w-4xl leading-[-.02em] text-center text-[#969cb1]">
                            {tTeam('description')}</p>
                    </AnimateOnView>
                
                </div>

                {/* Team-Members */}
                <div className={`relative flex flex-wrap z-[1] w-full justify-center 
                                 ${teamMembers.length == 4 ? 'max-w-6xl' : 'max-w-7xl'} gap-8`}>
                    {teamMembers.map((member: Member, index: number): JSX.Element => (
                        <AnimateOnView key={member.user_id} animation={`${getTeamMemberAnimation(index, teamMembers.length)} animate__slower`}>
                            <TeamMemberCard member={member} />
                        </AnimateOnView>
                    ))}
                </div>
            </div>

            {/* Border for better transition to next section & Light shape for more depth */}
            <div className="bg-[radial-gradient(50%_50%_at_50%_50%,#d8e7f212_0%,#04070d_100%)] z-[1] 
                            flex-none h-1 absolute bottom-0 left-0 right-0"></div>
            <div className="-rotate-[13deg] bg-[radial-gradient(50%_50%_at_50%_50%,#d5dbe6b3_0%,#04070d00_100%)] 
                            opacity-10 pointer-events-none z-[1] rounded-[10px] flex-none w-[793px] h-[499px] 
                            absolute -bottom-[249px] left-[calc(50%-396.5px)]"></div>
        </section>
    )
}