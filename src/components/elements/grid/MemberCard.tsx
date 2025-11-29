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
     * @returns Translated rank label string.
     */
    const getRankLabel: (rank: string) => string = (rank: string): string => {
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
                        <Image src={member.avatar_url} className="h-20 w-20 object-cover rounded-lg" width={80} height={80}
                               alt={`${member.display_name}'s Avatar - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server`}
                               onError={(): void => setImageError(true)}/>
                    ) : (
                        <div className="rounded-lg w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-500
                                        flex items-center justify-center cursor-special">
                                <span className="text-white text-3xl font-semibold">
                                    {getInitials(member.username)}
                                </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center flex-row w-full gap-5">
                    <div className="flex items-start justify-start flex-col gap-1.5">
                        <UsernameCopy username={member.username} displayName={member.display_name}
                                      userId={member.user_id} className="relative">
                            <h3 className="text-lg font-medium m-0">{member.display_name}</h3>
                        </UsernameCopy>
                        <div className={`text-sm opacity-95 ${getRankTextColor(member.rank)}`}>
                            {getRankLabel(member.rank)}
                        </div>
                    </div>

                    {/* Social Media Icon Button */}
                    <div className="flex items-start justify-start gap-3">
                        <a href={`https://discord.com/users/${member.user_id}`} target="_blank"
                           className="flex items-center justify-center flex-col w-6 h-6 mr-2 hover:scale-[101%]
                                      text-[#969cb1] hover:text-white transition-all duration-200"
                           aria-label={`${member.display_name}'s Discord Profile`}>
                            <FontAwesomeIcon icon={faDiscord} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}