import index from '../../../styles/components/index.module.css';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {Member} from "@/types/Member";
import {JSX, useState} from "react";
import {UsernameCopy} from "@/components/elements/misc/UsernameCopy";
import {FaDiscord, FaGithub, FaInstagram, FaLink, FaTiktok, FaTwitch, FaTwitter, FaYoutube} from "react-icons/fa";
import {IconType} from "react-icons";
import {FaRegCircleQuestion} from "react-icons/fa6";
import {useAvatarUrl} from "@/hooks/useAvatarUrl";

interface SocialPlatform {
    name: string;
    icon: IconType;
    matchers: string[];
}

/**
 * Renders a card component for a team member, displaying their avatar, username, rank,
 * and social media links. The card includes interactive elements such as tooltips
 * for additional information and a copy-to-clipboard feature for the username.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Member} props.member - The team member object containing details such as
 * username, rank, avatar URL, and social media links.
 *
 * @returns {JSX.Element} A styled card component with team member details.
 */
export default function TeamMemberCard({ member }: { member: Member }): JSX.Element {
    const tTeam = useTranslations('TeamSection');
    const [isHovered, setIsHovered] = useState(false);
    const SOCIAL_CONFIG: SocialPlatform[] = [
        { name: 'YouTube', icon: FaYoutube, matchers: ['youtube.com', 'youtu.be'] },
        { name: 'Twitter', icon: FaTwitter, matchers: ['twitter.com', 'x.com'] },
        { name: 'Instagram', icon: FaInstagram, matchers: ['instagram.com'] },
        { name: 'TikTok', icon: FaTiktok, matchers: ['tiktok.com'] },
        { name: 'GitHub', icon: FaGithub, matchers: ['github.com'] },
        { name: 'Twitch', icon: FaTwitch, matchers: ['twitch.tv'] },
    ];

    /**
     * Get FontAwesome icon and platform name for a social media URL.
     *
     * Normalizes the provided URL and checks it against a list of known platform matchers.
     * Returns the matched platform's icon and name, or a generic external link icon if no match is found.
     *
     * @param {string} url - The social media URL to inspect. May include protocol and www prefix.
     * @returns {{ icon: IconType; name: string }} An object containing the FontAwesome icon definition and the platform display name.
     */
    const getSocialMediaMetadata: (url: string) => { icon: IconType; name: string } = (url: string): { icon: IconType; name: string } => {
        const normalizedUrl: string = url.replace(/^(https?:\/\/)?(www\.)?/, '');

        for (const platform of SOCIAL_CONFIG) {
            if (platform.matchers.some((matcher: string): boolean => normalizedUrl.startsWith(matcher))) {
                return { icon: platform.icon, name: platform.name };
            }
        }

        // Fallback for unknown links
        return { icon: FaLink, name: 'External Link' };
    };

    const isGif: boolean = member.user_avatar_url.includes('.gif');
    const avatarUrl: string = useAvatarUrl({ avatarUrl: member.user_avatar_url, isHovered: isHovered });

    return (
        <div onMouseEnter={(): void => setIsHovered(true)} onMouseLeave={(): void => setIsHovered(false)}>
            <div className="relative flex-[1_0_0] w-96"></div>
            <div className={`relative flex gap-6 p-8 bg-[#04070d] rounded-2xl
                ${member.rank === 'LEITUNG' ? 'shadow-[inset_0_2px_1px_0_rgba(239,68,68,0.2)]' :
                    member.rank === 'ADMIN' ? 'shadow-[inset_0_2px_1px_0_rgba(248,113,113,0.2)]' :
                    member.rank === 'SENIOR' ? 'shadow-[inset_0_2px_1px_0_rgba(59,130,246,0.2)]' :
                    member.rank === 'ENTWICKLER' ? 'shadow-[inset_0_2px_1px_0_rgba(37,99,235,0.2)]' :
                    member.rank === 'MODERATOR' ? 'shadow-[inset_0_2px_1px_0_rgba(56,189,248,0.2)]' :
                    member.rank === 'HELFER' ? 'shadow-[inset_0_2px_1px_0_rgba(52,211,153,0.2)]' :
                    'shadow-[inset_0_2px_1px_0_rgba(207,231,255,0.2)]'} ${index.team_border_shadow}`}>

                {/* User Name + Rank */}
                <div className="relative flex flex-col flex-1 items-start justify-center gap-6 w-px">
                    <div className="flex flex-col gap-2">
                        <UsernameCopy username={member.user_name} displayName={member.user_display_name}
                                      userId={member.user_id} className="relative" />

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
                            <FaRegCircleQuestion size={12} className="text-gray-400 ml-1 mt-0.5 opacity-60" />

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
                            href={`https://discord.com/users/${member.user_id}`} aria-label="Discord">
                            <FaDiscord size={14} className="group-hover:scale-110 text-gray-300
                                                            group-hover:!text-white transition-all duration-300" />
                        </a>

                        {member.social_media_url && ((): JSX.Element => {
                            const metadata: { icon: IconType, name: string} = getSocialMediaMetadata(member.social_media_url);
                            const IconComponent: IconType = metadata.icon;

                            return (
                                <a className="relative flex flex-row bg-[#04070d] rounded-lg opacity-100 p-3 group
                                              shadow-[inset_0_1px_1px_0_rgba(207,231,255,0.2)]"
                                   target="_blank" href={member.social_media_url} aria-label={metadata.name}>

                                    <IconComponent size={14} className="group-hover:scale-110 text-gray-300
                                                                        group-hover:text-white transition-all
                                                                        duration-300 text-sm" />
                                </a>
                            );
                        })()}
                    </div>
                </div>

                {/* User Avatar (with Fallback Avatar) */}
                <div className="relative flex flex-1 aspect-[1.08594]">
                    {member.user_avatar_url ? (
                        <Image src={avatarUrl} width={136} height={136} data-cursor-special
                               className="rounded-lg hover:rotate-1 transition-all duration-300 hover:scale-105"
                               alt={`${member.user_display_name} Avatar - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server`}
                               unoptimized={isGif} sizes="136px"
                               onError={(e): void => {
                                   const target: HTMLImageElement = e.currentTarget as HTMLImageElement;
                                   target.style.display = 'none';
                                   const fallback: HTMLDivElement = target.nextElementSibling as HTMLDivElement;
                                   if (fallback) fallback.style.display = 'flex';
                               }} />) : null}

                    {/* Fallback Avatar */}
                    <div className={`${member.user_avatar_url ? 'hidden' : 'flex'} w-full h-full items-center justify-center 
                                     rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 text-white text-5xl 
                                     font-bold hover:rotate-1 transition-all duration-300 hover:scale-105 cursor-special`}
                         style={{ aspectRatio: '1.08594' }}>
                        {member.user_name.length > 1 ? member.user_id.substring(0, 2).toUpperCase()
                                                     : member.user_name.toUpperCase()}
                    </div>
                </div>
                
                {/* Light Effect on Profile Container */}
                <div className="absolute top-0 right-0 w-[437px] h-[306px] pointer-events-none opacity-[0.1] rounded-tr-2xl
                                bg-[radial-gradient(50%_50%_at_93.7%_8.1%,#b8c7d980_0%,rgba(4,7,13,0)_100%)]"></div>
            </div>
        </div>
    );
}