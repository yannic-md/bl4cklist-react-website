import {JSX, RefObject, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import {Member} from "@/types/Member";
import Image from "next/image";
import {UsernameCopy} from "@/components/elements/misc/UsernameCopy";
import {useTranslations} from "next-intl";
import colors from "@/styles/util/colors.module.css";
import confetti from "canvas-confetti";
import {isMilestoneUnlocked} from "@/lib/milestones/MilestoneEvents";
import {MILESTONES} from "@/data/milestones";
import {unlockMilestone} from "@/lib/milestones/MilestoneService";
import {NextRouter, useRouter} from "next/router";

interface MemberCardProps {
    member: Member;
    onRemove?: () => void;
}

let lastGlobalConfettiTime: number = 0;

/**
 * Renders a member profile card showing the avatar, display name and a link to the member's Discord profile.
 * It should NOT be used for team members.
 *
 * @param {MemberCardProps} props - Configuration object for this function.
 * @param {Member} props.member - The member data used to render avatar, name, rank and Discord profile link.
 * @param {() => void} props.onRemove - The used function to remove the ghost user.
 * @returns {JSX.Element | null} - A styled React element representing the member card.
 */
export function MemberCard({ member, onRemove }: MemberCardProps): JSX.Element {
    const tMisc = useTranslations("Misc");
    const tTeamSection = useTranslations("TeamSection");
    const tMemberListSection = useTranslations('MemberListSection');
    const [imageError, setImageError] = useState(false);
    const [ghostState, setGhostState] = useState<'idle' | 'growing' | 'fading'>('idle');
    const timerRef: RefObject<NodeJS.Timeout | null> = useRef<NodeJS.Timeout | null>(null);
    const cardRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const router: NextRouter = useRouter();

    /**
     * Extracts up to two initials from a display name.
     *
     * @param name - The display name to derive initials from.
     * @returns Two-character uppercase initials (or fewer if name is short).
     */
    const getInitials: (name: string) => string = (name: string): string => {
        return name.trim().substring(0, 2).toUpperCase();
    };

    /**
     * Returns the appropriate gradient color class based on the member's rank.
     *
     * @param rank - The member's rank.
     * @returns Tailwind CSS class string for the border gradient.
     */
    const getRankBorderColor: (rank: string) => string = (rank: string): string => {
        switch (rank) {
            case 'BIRTHDAY': return 'from-[#f3a683]/50';
            case 'SPONSOR': return 'from-[#ffbbec]/50';
            case 'BOOSTER': return 'from-[#f368e0]/50';
            case 'REKRUT': return 'from-[#81ecec]/50';
            case 'EHEM_LEITUNG': return 'from-red-500/50';
            case 'EHEM_ADMIN': return 'from-red-400/50';
            case 'EHEM_SENIOR': return 'from-blue-500/50';
            case 'EHEM_MOD': return 'from-sky-400/50';
            case 'GHOST': return 'from-sky-400/50';
            case 'LVL50': return 'from-[#ee9d4a]/50';
            case 'LVL75': return 'from-[#ff947a]/50';
            case 'LVL100': return 'from-[#c7ecee]/50';
            case 'LVL125': return 'from-[#ff597e]/50';
            default: return 'from-[#1b1f2f]';
        }
    };

    /**
     * Returns the appropriate text color class based on the member's rank.
     *
     * @param rank - The member's rank.
     * @returns Tailwind CSS class string for the rank text color.
     */
    const getRankTextColor: (rank: string) => string = (rank: string): string => {
        switch (rank) {
            case 'BIRTHDAY': return 'text-[#f3a683]';
            case 'SPONSOR': return colors.rank_sponsor_gradient;
            case 'BOOSTER': return colors.rank_booster_gradient;
            case 'REKRUT': return colors.rank_rekrut_gradient;
            case 'EHEM_LEITUNG': return 'text-slate-400';
            case 'EHEM_ADMIN': return 'text-slate-500';
            case 'EHEM_SENIOR': return 'text-slate-600';
            case 'EHEM_MOD': return 'text-slate-700';
            case 'LVL50': return 'text-[#ee9d4a]';
            case 'LVL75': return 'text-[#ff947a]';
            case 'LVL100': return colors.rank_lvl100_gradient;
            case 'LVL125': return colors.rank_lvl125_gradient;
            default: return 'text-[#969cb1]';
        }
    };

    /**
     * Returns the translated rank label based on the member's rank.
     *
     * @param rank - The member's rank.
     * @param staff_duration - The optional duration how long the member was a staff. Format: YYYY - seconds
     * @returns Translated rank label string.
     */
    const getRankLabel: (rank: string, staff_duration?: string) => string = (rank: string, staff_duration?: string): string => {
        switch (rank) {
            case 'BIRTHDAY': return tMemberListSection('rankBirthday');
            case 'SPONSOR': return tMemberListSection('rankSponsor');
            case 'BOOSTER': return tMemberListSection('rankBooster');
            case 'REKRUT': return tMemberListSection('rankRekrut');
            case 'GHOST': return tMemberListSection('rankGhost');
            default:
                if (rank.startsWith('LVL')) {
                    const level: string = rank.split('LVL')[1];
                    return tMemberListSection('rankLvl').replace('[level]', level);
                }

                // former staff
                if (rank.startsWith("EHEM_") && staff_duration) {
                    const staffMap: Record<string, string> = {
                        "EHEM_LEITUNG": tTeamSection("rank_owner"), "EHEM_ADMIN": "Administrator",
                        "EHEM_SENIOR": "Sr. Moderator", "EHEM_MOD": "Moderator",
                    };
                    const formatted_rank: string | undefined = staffMap[rank];
                    if (!formatted_rank) return "";

                    const totalSeconds: number = parseInt(staff_duration);
                    const months: number = Math.floor(totalSeconds / 2592000); // 30 days per month
                    const years: number = Math.floor(months / 12);

                    const duration: string = years > 0
                        ? `${years} ${years === 1 ? tMisc('durationYear') : tMisc('durationYears')}`
                        : `${months} ${months === 1 ? tMisc('durationMonth') : tMisc('durationMonths')}`;

                    return tMemberListSection("rankFormerStaff")
                        .replace("[rank]", formatted_rank)
                        .replace("[time]", duration);
                }
                return '';
        }
    };

    /**
     * Handles mouse enter events on member cards, triggering special animations and milestone unlocks.
     *
     * For ghosts, it starts a growth animation followed by fading and removal. For birthday members, it launches
     * confetti effects, unlocks a milestone if applicable and uses a global cooldown to prevent excessive triggers.
     */
    const handleMouseEnter: () => void = async (): Promise<void> => {
        if (member.rank === 'GHOST') {
            if (ghostState === 'fading') return;
            setGhostState('growing');

            // let him grow (1s) & remove him after fade-out animation (500ms)
            timerRef.current = setTimeout((): void => {
                setGhostState('fading');
                setTimeout((): void => { if (onRemove) onRemove(); }, 500);
            }, 1000);

            return;
        }

        if (member.rank !== 'BIRTHDAY') return;

        // prevent trigger if less than 3 seconds have passed since ANY birthday card hover
        const currentTime: number = Date.now();
        if (currentTime - lastGlobalConfettiTime < 3000) return;
        lastGlobalConfettiTime = currentTime;

        if (cardRef.current) {
            const rect: DOMRect = cardRef.current.getBoundingClientRect();
            const x: number = (rect.left + rect.width / 2) / window.innerWidth;
            const y: number = (rect.top + rect.height / 2) / window.innerHeight;
            confetti({particleCount: 50, spread: 70, origin: { x, y }, scalar: 1.2, gravity: 0.8, drift: 0, ticks: 200,
                      colors: ['#f3a683', '#ffd700', '#ff69b4', '#87ceeb', '#98fb98'], shapes: ['circle', 'square']});

            const alreadyUnlocked: boolean = await isMilestoneUnlocked(MILESTONES.BIRTHDAY.id);
            if (!alreadyUnlocked) {
                await unlockMilestone(MILESTONES.BIRTHDAY.id, MILESTONES.BIRTHDAY.imageKey,
                    (router.locale === "de" || router.locale === "en") ? router.locale : "de");
            }

            setTimeout((): void => {  // Add some sparkles
                confetti({particleCount: 20, spread: 50, origin: { x, y }, scalar: 0.8, gravity: 0.5, ticks: 150,
                          colors: ['#ffd700', '#ffff00'], shapes: ['circle']});
            }, 100);
        }
    };

    /**
     * Cancel pending ghost growth and reset ghost state on mouse leave.
     *
     * If the member is a ghost currently transitioning to 'growing', this clears the
     * scheduled timeout that would trigger fade-out and removal, and returns the ghost
     * to the 'idle' state. No effect for non-ghost members or other states.
     */
    const handleMouseLeave: () => void = (): void => {
        if (member.rank === 'GHOST' && ghostState === 'growing') {
            if (timerRef.current) clearTimeout(timerRef.current);
            setGhostState('idle');
        }
    };

    /**
     * Returns CSS classes for ghost members based on animation state.
     *
     * Provides appropriate Tailwind utility classes for the ghost card's visual state: 'idle', 'growing' or 'fading'.
     * The function ensures non-ghost members receive no extra classes and controls scale, opacity and transition
     * timing to animate growth and fade-out effects.
     */
    const getGhostClasses = () => {
        if (member.rank !== 'GHOST') return '';

        switch (ghostState) {
            case 'growing':
                return 'scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-[1000ms] ease-linear';
            case 'fading':
                return 'scale-115 opacity-0 transition-all duration-500 ease-out';
            default: // idle
                return 'scale-100 transition-all duration-300';
        }
    };

    return (
        <div ref={cardRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
             className={`rounded-2xl p-px bg-gradient-to-b via-[#1b1f2f4d] to-[#1b1f2f4d] from-0% via-5%
                         ${getRankBorderColor(member.rank)} ${getGhostClasses()} z-10
                         ${member.rank === 'BIRTHDAY' ? 'hover:scale-[1.02] hover:shadow-lg hover:shadow-[#f3a683]/20' : ''}
                         ${member.rank !== 'GHOST' ? 'transition-all duration-200' : ''}`}>
            <div className="flex w-full h-full rounded-2xl gap-5 bg-[#070b15] p-[.625rem]">
                <div className="rounded-lg flex-none transition-all duration-200 hover:-rotate-1 hover:scale-110">
                    {/* Fallback for image in case discord avatar was deleted / changed */}
                    {!imageError ? (
                        <Image src={member.user_avatar_url} className="h-20 w-20 object-cover rounded-lg" width={80} height={80}
                               alt={`${member.user_display_name}'s Avatar - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server`}
                               onError={(): void => setImageError(true)} data-cursor-special />
                    ) : (
                        <div className="rounded-lg w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-500
                                        flex items-center justify-center cursor-special">
                                <span className="text-white text-3xl font-semibold">
                                    {getInitials(member.user_name)}
                                </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center flex-row w-full gap-5">
                    <div className="flex items-start justify-start flex-col gap-1.5">
                        <UsernameCopy username={member.user_name} displayName={member.user_display_name}
                                      userId={member.user_id} className="relative">
                            <h3 className="text-lg font-medium m-0">{member.user_display_name}</h3>
                        </UsernameCopy>
                        <div className={`text-sm opacity-95 ${getRankTextColor(member.rank)}`}>
                            {getRankLabel(member.rank, member.staff_duration)}
                        </div>
                    </div>

                    {/* Social Media Icon Button */}
                    <div className="flex items-start justify-start gap-3">
                        <a href={`https://discord.com/users/${member.user_id}`} target="_blank"
                           className="flex items-center justify-center flex-col w-6 h-6 mr-2 hover:scale-[101%]
                                      text-[#969cb1] hover:text-white transition-all duration-200"
                           aria-label={`${member.user_display_name}'s Discord Profile`}>
                            <FontAwesomeIcon icon={faDiscord} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}