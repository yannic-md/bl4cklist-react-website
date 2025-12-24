import {useTranslations} from "next-intl";
import {JSX, ReactNode, RefObject, useCallback, useEffect, useRef, useState} from "react";

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
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef: RefObject<NodeJS.Timeout | null> = useRef<NodeJS.Timeout | null>(null);

    /**
     * Cleanup timeout on unmount to prevent memory leaks
     */
    useEffect((): () => void => {
        return (): void => { if (timeoutRef.current) { clearTimeout(timeoutRef.current); } };
    }, []);

    /**
     * Handles the click event on a username element by copying the username to clipboard
     * and showing a temporary visual feedback indicating the copy action was successful.
     */
    const handleUsernameClick: () => Promise<void> = useCallback(async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(username);

            // Clear any existing timeout
            if (timeoutRef.current) { clearTimeout(timeoutRef.current); }
            setIsCopied(true);

            // Reset after 1.5 seconds
            timeoutRef.current = setTimeout((): void => { setIsCopied(false); }, 1500);
        } catch (err) {
            console.error('Failed to copy username:', err);
        }
    }, [username]);

    return (
        <div className={`group ${className}`}>
            <span className="text-base tracking-[-.02em] z-10 w-full cursor-pointer m-0" onClick={handleUsernameClick}>
                {children || displayName}
            </span>

            {/* Tooltip */}
            <div className={`username-tooltip-${userId} absolute bottom-11/12 left-3/12 transform -translate-x-1/2 
                             px-3 py-2 text-white text-xs rounded-lg shadow-2xl opacity-0 invisible 
                             group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap 
                             z-[100] border pointer-events-none 
                             ${isCopied ? 'bg-green-600 border-green-500' : 'bg-gray-900 border-gray-700'}`}>
                <span>{isCopied ? tMisc('copy') : username}</span>
                <div className={`absolute top-full left-6 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4
                                 border-t-4 border-transparent
                                 ${isCopied ? 'border-t-green-600' : 'border-t-gray-900'}`}></div>
            </div>
        </div>
    );
}