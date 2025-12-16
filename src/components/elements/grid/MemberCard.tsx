import {JSX, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons";
import {Member} from "@/types/Member";
import Image from "next/image";
import {UsernameCopy} from "@/components/elements/misc/UsernameCopy";
import {useTranslations} from "next-intl";
import colors from "@/styles/util/colors.module.css";

interface MemberCardProps {
    member: Member;
}

/**
 * Renders a member profile card showing the avatar, display name and a link to the member's Discord profile.
 * It should NOT be used for team members.
 *
 * @param member The member data used to render avatar, name, rank and Discord profile link.
 * @returns A styled React element representing the member card.
 */
export function MemberCard({ member }: MemberCardProps): JSX.Element {
    const tMisc = useTranslations("Misc");
    const tTeamSection = useTranslations("TeamSection");
    const tMemberListSection = useTranslations('MemberListSection');
    const [imageError, setImageError] = useState(false);

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
            case 'SPONSOR': return 'from-[#a9c9ff]/50';
            case 'BOOSTER': return 'from-[#f368e0]/50';
            case 'EHEM_LEITUNG': return 'from-red-500/50';
            case 'EHEM_ADMIN': return 'from-red-400/50';
            case 'EHEM_SENIOR': return 'from-blue-500/50';
            case 'EHEM_MOD': return 'from-sky-400/50';
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

                    const totalSeconds: number = parseInt(staff_duration.split(" - ")[1]);
                    const months: number = Math.floor(totalSeconds / 2592000);
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

    return (
        <div className={`rounded-2xl p-px bg-gradient-to-b via-[#1b1f2f4d] to-[#1b1f2f4d] from-0% via-5%
                         ${getRankBorderColor(member.rank)} z-10`}>
            <div className="flex w-full h-full rounded-2xl gap-5 bg-[#070b15] p-[.625rem]">
                <div className="rounded-lg flex-none transition-all duration-200 hover:-rotate-1 hover:scale-110">
                    {/* Fallback for image in case discord avatar was deleted / changed */}
                    {!imageError ? (
                        <Image src={member.user_avatar_url} className="h-20 w-20 object-cover rounded-lg" width={80} height={80}
                               alt={`${member.user_display_name}'s Avatar - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server`}
                               onError={(): void => setImageError(true)}/>
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