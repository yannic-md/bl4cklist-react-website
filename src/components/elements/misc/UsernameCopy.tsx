import {useTranslations} from "next-intl";
import {JSX, ReactNode, useRef} from "react";

interface UsernameCopyProps {
    username: string;
    displayName: string;
    userId: string;
    children?: ReactNode;
    className?: string;
}

/**
 * A reusable component that displays a username with a copy-to-clipboard functionality.
 * Shows a tooltip with the actual username on hover and provides visual feedback when copied.
 *
 * @param username - The actual username to be copied to clipboard
 * @param displayName - The display name shown to the user
 * @param userId - Unique identifier for the tooltip element
 * @param children - Optional custom content to display instead of displayName
 * @param className - Additional CSS classes for the wrapper
 */
export function UsernameCopy({ username, displayName, userId, children, className = '' }: UsernameCopyProps): JSX.Element {
    const tMisc = useTranslations('Misc');
    const tooltipRef = useRef<HTMLDivElement>(null);
    const tooltipTextRef = useRef<HTMLSpanElement>(null);
    const tooltipArrowRef = useRef<HTMLDivElement>(null);

    /**
     * Handles the click event on a username element by copying the username to clipboard
     * and showing a temporary visual feedback indicating the copy action was successful.
     */
    const handleUsernameClick: () => void = (): void => {
        navigator.clipboard.writeText(username).then();

        const tooltip: HTMLDivElement | null = tooltipRef.current;
        const childElement: HTMLSpanElement | null = tooltipTextRef.current;
        const tooltipArrow: HTMLDivElement | null = tooltipArrowRef.current;

        if (tooltip && childElement && tooltipArrow) {
            tooltip.classList.add('!bg-green-600', '!border-green-500');
            tooltipArrow.classList.add('!border-t-green-600');
            childElement.innerText = tMisc('copy');

            setTimeout((): void => {
                childElement.innerText = username;
                tooltip.classList.remove('!bg-green-600', '!border-green-500');
                tooltipArrow.classList.remove('!border-t-green-600');
            }, 1500);
        }
    };

    return (
        <div className={`group ${className}`}>
            <span className="text-base tracking-[-.02em] z-10 w-full cursor-pointer m-0" onClick={handleUsernameClick}>
                {children || displayName}
            </span>

            {/* Tooltip */}
            <div ref={tooltipRef} className={`username-tooltip-${userId} absolute bottom-11/12 left-3/12 transform 
                                              -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg 
                                              shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                                              transition-all duration-200 whitespace-nowrap z-[100] border 
                                              border-gray-700 pointer-events-none`}>
                <span ref={tooltipTextRef}>{username}</span>
                <div ref={tooltipArrowRef}
                     className="absolute top-full left-6 transform -translate-x-1/2 w-0 h-0
                                border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
        </div>
    );
}