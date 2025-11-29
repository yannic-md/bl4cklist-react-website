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

    return (
        <div className={`rounded-2xl p-px bg-gradient-to-b via-[#1b1f2f4d] to-[#1b1f2f4d] from-0% via-5%
                         ${member.rank === 'BIRTHDAY' ? 'from-[#f3a683]/50' :
                           member.rank === 'SPONSOR'  ? 'from-[#a9c9ff]/50' :
                           member.rank === 'BOOSTER'  ? 'from-[#f368e0]/50' :
                           member.rank === 'REKRUT'   ? 'from-[#c7e072]/50' : 'from-[#1b1f2f]'} z-10`}>
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
                        <div className={`text-sm opacity-95 ${member.rank === 'BIRTHDAY' ? 'text-[#f3a683]' :
                                                              member.rank === 'SPONSOR'  ? colors.rank_sponsor_gradient :
                                                              member.rank === 'BOOSTER'  ? colors.rank_booster_gradient :
                                                              member.rank === 'REKRUT'   ? colors.rank_rekrut_gradient : 
                                                                                           'text-[#969cb1]'}`}>
                            {member.rank === 'BIRTHDAY' ? tMemberListSection('rankBirthday') :
                             member.rank === 'SPONSOR'  ? tMemberListSection('rankSponsor') :
                             member.rank === 'BOOSTER'  ? tMemberListSection('rankBooster') :
                             member.rank === 'REKRUT'   ? tMemberListSection('rankRekrut') : ''}
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