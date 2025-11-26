import {JSX, useState} from "react";

interface TestimonialCardProps {
    userid: string;
    username: string;
    rank: string;
    rank_color: string;
    avatar_url: string;
    content: string;
    isHovered?: boolean;
    hoveredCard: string | null;
    onHoverChange?: (hovered: boolean) => void;
}

/**
 * Renders a testimonial card showing a user's avatar, name, rank, and message.
 *
 * @param {object} props Component properties.
 * @param {string} props.userid The id of the user.
 * @param {string} props.username Display name of the user.
 * @param {string} props.rank Rank label shown under the username.
 * @param {string} props.rank_color CSS color value applied to the rank label.
 * @param {string} props.avatar_url Public URL of the user's avatar image.
 * @param {string} props.content Testimonial text content.
 * @param {boolean} props.isHovered State if user is hovering on card.
 * @param {string | null} props.hoveredCard The card that is currently hovered on
 * @param {function} props.onHoverChange Function what happens at hovering.
 * @returns {JSX.Element} Rendered testimonial card component.
 */
export function TestimonialCard({ userid, username, rank, rank_color, avatar_url, content,
                                  isHovered = false, hoveredCard, onHoverChange }: TestimonialCardProps): JSX.Element {
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
        <div className={`relative p-px transition-opacity duration-300 
                         ${isHovered ? 'opacity-100' : hoveredCard !== null ? 'opacity-30' : 'opacity-100'}`}
             onMouseEnter={() => onHoverChange?.(true)}
             onMouseLeave={() => onHoverChange?.(false)}>
            <div className="relative z-[1] rounded-xl bg-[#0e0e21] h-full p-6 min-w-0 max-w-none">
                <div className="flex items-center justify-between gap-x-4 mb-6">
                    {/* Profile Name + Avatar */}
                    <div className="flex justify-start items-center gap-2.5">
                        {/* Fallback for image in case discord avatar was deleted / changed */}
                        {!imageError ? (
                            <img src={avatar_url} alt={`${username} Avatar - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server`}
                                 className="rounded-full overflow-hidden translate-0 w-10 h-10 !cursor-default"
                                 onError={(): void => setImageError(true)} />
                        ) : (
                            <div className="rounded-full w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-500
                                            flex items-center justify-center !cursor-default">
                                <span className="text-white text-sm font-semibold">
                                    {getInitials(username)}
                                </span>
                            </div>
                        )}
                        <div title={userid}>
                            <div className="text-base font-medium text-white ml-0.5">{username}</div>
                            <div className="text-sm" style={{ color: rank_color }}>
                                {rank}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-[#969cb1]">"{content}"</p>
            </div>

            {/* Border Gradient */}
            <div className="opacity-40 bg-white/[0.05] bg-gradient-to-r from-transparent via-white/60
                            to-transparent rounded-lg absolute inset-0"></div>
        </div>
    );
}
