import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import index from '../../../styles/components/index.module.css';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons/faCircleQuestion';
import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faTiktok } from '@fortawesome/free-brands-svg-icons/faTiktok';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faTwitch } from '@fortawesome/free-brands-svg-icons/faTwitch';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {IconDefinition} from "@fortawesome/free-brands-svg-icons";
import {TeamMember} from "@/types/TeamMember";

export default function TeamMemberCard({ member }: { member: TeamMember }) {
    const tTeam = useTranslations('TeamSection');
    const tMisc = useTranslations('Misc');

    /**
     * Handles the click event on a username element by copying the username to clipboard
     * and showing a temporary visual feedback indicating the copy action was successful.
     * 
     * @param username - The username string to be copied to the clipboard
     * @param user_id - The unique identifier for the user, used to target the specific tooltip element
     */
    const handleUsernameClick = (username: string, user_id: string): void => {
        navigator.clipboard.writeText(username).then();

        // Trigger the copied tooltip change
        const tooltip: HTMLDivElement = document.querySelector(`.username-tooltip-${user_id}`) as HTMLDivElement;
        if (tooltip) {
            const childElement: HTMLSpanElement = tooltip.childNodes[0] as HTMLSpanElement;
            const tooltipArrow: HTMLDivElement = tooltip.childNodes[1] as HTMLDivElement;

            tooltip.classList.add("!bg-green-600", "!border-green-500");
            tooltipArrow.classList.add("!border-t-green-600");
            childElement.innerText = tMisc('copy');

            setTimeout((): void => {
                childElement.innerText = username;
                tooltip.classList.remove("!bg-green-600", "!border-green-500");
                tooltipArrow.classList.remove("!border-t-green-600");
            }, 1500);
        }
    };

    /**
     * Determines the appropriate FontAwesome icon for a given social media URL.
     * 
     * @param url - The social media URL to analyze
     * @returns The corresponding FontAwesome icon definition based on the URL domain
     */
    const getSocialMediaIcon: (url: string) => IconDefinition = (url: string): IconDefinition => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) return faYoutube;
        if (url.includes('twitter.com') || url.includes('x.com')) return faTwitter;
        if (url.includes('instagram.com')) return faInstagram;
        if (url.includes('tiktok.com')) return faTiktok;
        if (url.includes('github.com')) return faGithub;
        if (url.includes('twitch.tv')) return faTwitch;
        return faLink;
    };

    return (
        <div>
            <div className="relative flex-[1_0_0] w-96"></div>
            <div className={`relative flex gap-6 p-8 bg-[#04070d] rounded-2xl
                                shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)] ${index.team_border_shadow}`}>

                {/* User Name + Rank */}
                <div className="relative flex flex-col flex-1 items-start justify-center gap-6 w-px">
                    <div className="flex flex-col gap-2">
                        <div className="group">
                            <p className="text-base tracking-[-.02em] z-10 w-full cursor-pointer" 
                                onClick={() => handleUsernameClick(member.username, member.user_id)}>
                                {member.display_name}
                            </p>

                            {/* Tooltip for Username */}
                            <div className={`username-tooltip-${member.user_id} 
                                             absolute bottom-11/12 left-3/12 transform -translate-x-1/2 px-3 py-2 
                                            bg-gray-900 text-white text-xs rounded-lg shadow-2xl opacity-0 invisible 
                                            group-hover:opacity-100 group-hover:visible transition-all duration-200 
                                            whitespace-nowrap z-[100] border border-gray-700 pointer-events-none`}>
                                <span>{member.username}</span>
                                <div className="absolute top-full left-6 transform -translate-x-1/2 w-0 h-0 
                                                border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                        </div>
                        <div className="relative flex shrink-0 justify-start whitespace-pre-wrap w-full group">
                            <p className={`text-xs font-normal tracking-normal opacity-80 
                            ${member.rank === 'LEITUNG' ? 'text-red-500' :
                                member.rank === 'ADMIN' ? 'text-red-400' :
                                member.rank === 'SENIOR' ? 'text-blue-500' :
                                member.rank === 'ENTWICKLER' ? 'text-blue-600' :
                                member.rank === 'MODERATOR' ? 'text-sky-400' :
                                member.rank === 'HELFER' ? 'text-emerald-400' : ''}`}>
                                    
                                {/* Content */}
                                {member.rank === 'LEITUNG' ? tTeam('rank_owner') :
                                 member.rank === 'ADMIN' ? 'Administrator' :
                                 member.rank === 'SENIOR' ? 'Senior-Moderator' :
                                 member.rank === 'ENTWICKLER' ? tTeam('rank_developer') :
                                 member.rank === 'MODERATOR' ? 'Server-Moderator' :
                                 member.rank === 'HELFER' ? tTeam('rank_helper') : ''}</p>
                            <FontAwesomeIcon icon={faCircleQuestion} size="xs" className="text-gray-400 ml-1 mt-0.5 opacity-60" />

                            {/* Tooltip for Rank Description */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
                                            bg-gray-900 text-white text-xs rounded-lg shadow-2xl opacity-0 invisible 
                                            group-hover:opacity-100 group-hover:visible transition-all duration-200 
                                            whitespace-pre-wrap z-[100] border border-gray-700 w-78 pointer-events-none">
                                {member.rank === 'LEITUNG' ? tTeam('rank_owner_desc') :
                                 member.rank === 'ADMIN' ? tTeam('rank_admin_desc') :
                                 member.rank === 'SENIOR' ? tTeam('rank_senior_desc') :
                                 member.rank === 'ENTWICKLER' ? tTeam('rank_dev_desc') :
                                 member.rank === 'MODERATOR' ? tTeam('rank_mod_desc') :
                                 member.rank === 'HELFER' ? tTeam('rank_helper_desc') : ''}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 
                                                border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div className="flex flex-row gap-2">
                        <a className="relative flex flex-row bg-[#04070d] rounded-lg opacity-100 p-3 group
                                      shadow-[inset_0_1px_1px_0_rgba(207,231,255,0.2)]" target="_blank" 
                            href={`http://discord.com/users/${member.user_id}`}>
                            <FontAwesomeIcon icon={faDiscord} size="sm" className="group-hover:scale-110 text-gray-300 
                                                                                 group-hover:!text-white transition-all duration-300" />
                        </a>

                        {member.social_media_1 && (
                            <a className="relative flex flex-row bg-[#04070d] rounded-lg opacity-100 p-3 group
                                          shadow-[inset_0_1px_1px_0_rgba(207,231,255,0.2)]" target="_blank" 
                                href={member.social_media_1}>
                                <FontAwesomeIcon icon={getSocialMediaIcon(member.social_media_1)} size="sm" 
                                                 className="group-hover:scale-110 text-gray-300 group-hover:!text-white 
                                                            transition-all duration-300" />
                            </a>
                        )}

                        {member.social_media_2 && (
                            <a className="relative flex flex-row bg-[#04070d] rounded-lg opacity-100 p-3 group
                                          shadow-[inset_0_1px_1px_0_rgba(207,231,255,0.2)]" target="_blank" 
                                href={member.social_media_2}>
                                <FontAwesomeIcon icon={getSocialMediaIcon(member.social_media_2)} size="sm"
                                                 className="group-hover:scale-110 text-gray-300 group-hover:!text-white 
                                                            transition-all duration-300" />
                            </a>
                        )}
                    </div>
                </div>

                {/* User Avatar */}
                <div className="relative flex flex-1 aspect-[1.08594]">
                    <Image src={member.avatar_url} className={`rounded-lg hover:rotate-1 transition-all duration-300
                                                              hover:scale-105 ${index.easter_cursor}`}
                           width={136} height={136}
                           alt={`${member.display_name} Avatar - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server`} />
                </div>
                
                {/* Light Effect on Profile Container */}
                <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
            </div>
        </div>
    );
}