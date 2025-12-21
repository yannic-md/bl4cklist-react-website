import {JSX} from "react";
import { AnimatedTextReveal } from "@/components/animations/TextReveal";
import { AnimateOnView } from "@/components/animations/AnimateOnView";
import { useTranslations } from "next-intl";

import colors from '../../../styles/util/colors.module.css';
import index from '../../../styles/components/index.module.css';
import TeamMemberCard from "@/components/elements/grid/TeamMemberCard";
import {Member} from "@/types/Member";
import GlitchingMoon from "@/components/elements/misc/GlitchingMoon";

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

    // fetched Team member data (or fallback)
    const teamMembers: Member[] = apiTeamMembers ?? [ // fallback data for SSR
        { user_name: 'yannicde', user_display_name: 'Yannic 🦙', rank: 'LEITUNG', user_id: '327176944640720906',
          user_avatar_url: 'https://cdn.discordapp.com/avatars/327176944640720906/a_c261a382dc3b0ebe95d6304eb452c854.gif?size=128',
          social_media_url: null },
    ];

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
                <GlitchingMoon />
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