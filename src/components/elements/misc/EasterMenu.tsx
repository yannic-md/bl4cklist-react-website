import {ChangeEvent, JSX, useEffect, useState} from 'react';
import Image from 'next/image';
import animations from '@/styles/util/animations.module.css';
import {useMilestones} from "@/hooks/useMilestones";
import {Milestone, TOTAL_MILESTONES} from "@/types/APIResponse";
import {MILESTONES} from "@/data/milestones";
import {useTranslations} from "next-intl";
import {saveUserMilestones} from "@/lib/api";
import {getUnlockedMilestones} from "@/lib/milestones/MilestoneEvents";
import {MdClose} from "react-icons/md";
import {FaRegCircleQuestion} from "react-icons/fa6";

/**
 * Displays an animated achievement menu for user milestones in the application.
 *
 * Renders a floating button that opens a modal showing the user's achievement progress, a Discord login option,
 * and a list of unlocked achievements. Handles menu open/close animations and closes the menu when clicking outside.
 * Progress bar and text colors adapt to the user's achievement status.
 *
 * @returns {JSX.Element} - The rendered achievement menu component with panel button.
 */
export default function EasterMenu(): JSX.Element {
    const tGenericMenu = useTranslations('GenericMenu');
    const tForm = useTranslations('Form');
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOnCooldown, setIsOnCooldown] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [foundUser, setFoundUser] = useState(false);
    const [isRefreshVisible, setIsRefreshVisible] = useState(false);
    const [discordName, setDiscordName] = useState<string>('');
    const [discordError, setDiscordError] = useState<string | null>(null);
    const { count, unlockedIds } = useMilestones();

    const progress: number = (count / TOTAL_MILESTONES) * 100;
    const foundAchievements: {imageKey: string | undefined, icon: string | undefined}[] = unlockedIds
        .map((id: string): {imageKey: string | undefined, icon: string | undefined} => {
            const milestone: Milestone | undefined = Object.values(MILESTONES).find((m: Milestone): boolean => m.id === id);
            return { imageKey: milestone?.imageKey, icon: milestone?.icon };
        });

    /**
     * Load saved Discord ID from localStorage into component state on mount.
     *
     * Executes once when the component mounts. Retrieves the value stored under
     * `user_id` in localStorage and, if present, sets `discordName` and marks
     * `foundUser` to true so the input is treated as an existing saved user.
     */
    useEffect((): void => {
        const savedName: string | null = localStorage.getItem('user_id');
        if (savedName) { setDiscordName(savedName); setFoundUser(true); setIsRefreshVisible(true); }
    }, []);

    /**
     * Validates whether a string is a valid Discord user ID.
     *
     * Returns true if the provided value contains only digits and matches Discord's typical
     * snowflake length (17-19 characters). Leading and trailing whitespace is trimmed before validation.
     *
     * @param {string} value - The input string to validate as a Discord ID.
     * @returns {boolean} - True if the input is a valid Discord ID; otherwise false.
     */
    const isValidDiscordId: (value: string) => boolean = (value: string): boolean => {
        return /^[0-9]{17,19}$/.test(value.trim());
    };

    /**
     * Validate and store Discord ID input on change.
     *
     * Trims and saves the input value to component state, then updates the validation error state
     * if the field is empty or does not match Discord's expected ID pattern (17-19 digits).
     *
     * @param {ChangeEvent<HTMLInputElement>} e - The input change event from the Discord ID field.
     */
    const handleDiscordChange: (e: ChangeEvent<HTMLInputElement>) => void = (e: ChangeEvent<HTMLInputElement>): void => {
        const value: string = e.target.value;
        setDiscordName(value);

        if (!value) { setDiscordError(null);
        } else if (!isValidDiscordId(value)) { setDiscordError(tForm('errorDiscordId'));
        } else { setDiscordError(null);
        }
    };

    /**
     * Save the user's unlocked milestones to the backend for the provided Discord User-ID.
     * (Not necessary to make the system work - just for internal tracking purposes)
     *
     * Validates the Discord ID, sends the currently unlocked milestones to the backend,
     * updates UI state for loading, saved status and cooldown, persists the Discord ID
     * to localStorage on success, and provides appropriate success or error feedback.
     *
     * @returns {Promise<void>} - Resolves when the save attempt completes.
     */
    const handleSaveMilestones: () => Promise<void> = async (): Promise<void> => {
        if (!isValidDiscordId(discordName)) return;
        setIsLoading(true);
        setDiscordError(null);
        setIsSaved(false); // reset for the new feedback

        const success: boolean = await saveUserMilestones(discordName.trim(), getUnlockedMilestones());

        if (success) {
            const isInitialSave: boolean = !isRefreshVisible; // check if its the first save
            localStorage.setItem("user_id", discordName.trim());
            setIsSaved(true);
            setIsRefreshVisible(true);
            setIsOnCooldown(true);

            // After the cooldown we reset isSaved, so the success message goes away and makes room
            // for the default status
            setTimeout((): void => {
                setIsOnCooldown(false);
                setIsSaved(false);
                if (isInitialSave) setFoundUser(true); // now he's an official existing user
            }, 5000);
        } else {
            setDiscordError(tForm('errorFormUnknown'));
        }
        setIsLoading(false);
    };

    /**
     * Returns the TailwindCSS gradient and shadow classes for the progress bar color.
     *
     * Determines the color of the achievement progress bar based on the current progress percentage.
     * The color transitions from red (0-25%), orange (26-50%), yellow (51-75%), to emerald (above 75%),
     * providing a visual indicator of achievement status.
     *
     * @returns {string} - TailwindCSS classes for the progress bar color and shadow.
     */
    const getBarColor: () => string = (): string => {
        if (progress <= 25) return "from-red-500 via-red-400 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
        if (progress <= 75) return "from-orange-500 via-orange-400 to-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]";
        if (progress <= 99) return "from-yellow-400 via-yellow-300 to-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]";
        return "from-emerald-500 via-green-500 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]";
    };

    /**
     * Returns a TailwindCSS text color class based on the current progress value.
     *
     * Determines the appropriate text color for the achievement progress display.
     * The color changes depending on the percentage of progress: red for 0-25%,
     * orange for 26-50%, yellow for 51-75%, and emerald for above 75%.
     * This helps visually indicate the user's achievement status.
     *
     * @returns {string} - TailwindCSS class for text color based on progress.
     */
    const getTextColor: () => string = (): string => {
        if (progress <= 25) return "text-red-400";
        if (progress <= 75) return "text-orange-400";
        if (progress <= 99) return "text-yellow-300";
        return "text-emerald-400";
    };

    /**
     * Closes the achievement menu with a short slide-out animation.
     *
     * This function first sets the `isClosing` state to `true` to trigger
     * the closing animation. After the animation duration has passed,
     * it hides the menu by setting `isOpen` to `false` and resets
     * `isClosing` to `false` so the animation can be used again on next open/close.
     */
    const handleClose: () => void = (): void => {
        setIsClosing(true);
        setTimeout((): void => { setIsOpen(false); setIsClosing(false); }, 400);
    };

    /**
     * Closes the achievement menu if the user clicks outside from it.
     *
     * Registers a global `mousedown` listener while the achievement menu is open.
     * If the user clicks outside both the menu and the trigger button,
     * the menu is closed via `handleClose`. The listener is cleaned up
     * when the menu closes or the component unmounts to avoid memory leaks.
     */
    useEffect((): (() => void) | undefined => {
        if (!isOpen) return;

        const handleClickOutside: (event: MouseEvent) => void = (event: MouseEvent): void => {
            const target = event.target as HTMLElement;
            const menu: HTMLDivElement | null = document.querySelector('[data-achievement-menu]');
            const button: HTMLButtonElement | null = document.querySelector('[data-achievement-button]');

            if (menu && button && !menu.contains(target) && !button.contains(target)) {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return (): void => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <>
            {/* Hovering Button to open the Achievement menu or close it */}
            {count >= 1 && (
                <button data-achievement-button aria-label="Achievement Menu"
                        onClick={(): void => { if (isOpen) { handleClose(); } else { setIsOpen(true); }} }
                        className={`fixed bottom-4 left-4 sm:bottom-5 sm:left-6 z-50 p-2 py-1.5 rounded-full 
                                bg-[rgba(29,30,35,0.92)] border border-white/10 shadow-lg backdrop-blur-md 
                                transition-all duration-200 hover:bg-white/20 hover:border-white/20 text-white 
                                text-lg !cursor-pointer hover:-translate-y-0.5 animate__animated animate__fadeInUp`}>
                    <Image src="/images/icons/super-mario-star-cursor-32w.png" width={28} height={28}
                           className="!cursor-pointer sm:w-8 sm:h-8"
                           alt="Achievement Menu - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                </button>
            )}

            {/* Achievement Menu */}
            {(isOpen || isClosing) && (
                <div data-achievement-menu
                     className={`fixed bottom-16 left-4 right-4 sm:bottom-20 sm:left-6 sm:right-auto
                                 sm:w-96 max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-6rem)]
                                 overflow-y-auto z-50 bg-[rgba(29,30,35,0.92)] border border-white/15 
                                 rounded-xl shadow-2xl backdrop-blur-xl animate__animated
                                 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
                                 hover:scrollbar-thumb-white/30 animate__faster
                                 ${isClosing ? animations.animate_slideOutLeftFar : 'animate__slideInLeft'}`}>

                    {/* Header */}
                    <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            {/* Title + Close Button */}
                            <div className="flex items-center gap-2">
                                <span className="text-xl sm:text-2xl -me-1 sm:-me-2">✨</span>
                                <h2 className="text-white font-semibold text-base sm:text-lg leading-tight">
                                    - {tGenericMenu('title')}
                                </h2>
                            </div>
                            <button onClick={handleClose} aria-label="Close Menu"
                                    className="text-white/50 hover:text-white hover:bg-white/10 transition-all
                                               text-base leading-none !cursor-pointer rounded-lg p-2 w-8 h-8
                                               flex items-center justify-center">
                                <MdClose />
                            </button>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-white/10">
                        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                            <span className="text-white/70 text-xs sm:text-sm font-medium">{tGenericMenu('progress')}</span>
                            <span className="text-xs sm:text-sm font-semibold">
                                <span className={getTextColor()}>{count}</span>
                                <span className="text-white/40 mx-1">/</span>
                                <span className="text-white/60">{TOTAL_MILESTONES}</span>
                            </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 sm:h-2.5 overflow-hidden border border-white/5">
                            <div className={`bg-gradient-to-r h-full transition-all duration-500 rounded-full ${getBarColor()}`}
                                 style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    {/* Discord ID label */}
                    <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-white/10 flex-col items-center justify-between">
                        <div className="flex items-center justify-start gap-x-1 mb-2.5">
                            <label htmlFor="discordName" className="block text-white/80 text-sm font-medium">
                                {tForm('textDiscordID')}
                            </label>
                            <a href="https://support.discord.com/hc/articles/206346498#h_01HRSTXPS5H5D7JBY2QKKPVKNA"
                               target="_blank" rel="noopener noreferrer" aria-label="Mehr Informationen zur Discord-ID"
                               className="text-gray-500 hover:text-gray-300 transition-colors mt-px">
                                <FaRegCircleQuestion />
                            </a>
                        </div>

                        {/* Discord ID input */}
                        <div className="flex items-center gap-2">
                            <input type="text" id="discordName" value={discordName} placeholder="775415193760169995"
                                   onChange={handleDiscordChange} disabled={foundUser || isSaved || isLoading}
                                   className={`flex-1 px-4 py-2.5 bg-white/5 rounded-lg text-white text-sm 
                                               placeholder-white/30 focus:outline-none focus:bg-white/8 focus:ring-1 
                                               transition-all duration-200 disabled:text-gray-500 w-full
                                               ${discordError ? "border border-red-500 focus:border-red-400 focus:ring-red-400" 
                                                              : "border border-white/10 focus:border-[#5865F2] focus:ring-[#5865F2]"}`} />

                            {/* Save/Refresh button */}
                            <button type="button" onClick={handleSaveMilestones}
                                    disabled={!!discordError || !discordName || isLoading || isOnCooldown}
                                    className={`px-3.5 py-2.5 text-sm font-medium rounded-lg !cursor-pointer 
                                                bg-[#5865F2] hover:bg-[#4752c4] text-white shadow-md transition-all 
                                                duration-150 whitespace-nowrap disabled:!opacity-50 
                                                disabled:!cursor-not-allowed disabled:!bg-neutral-600 border
                                                border-white/10 focus:border-[#5865F2] focus:ring-[#5865F2]"}`}>
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    tForm(isRefreshVisible ? 'buttonRefresh' : 'buttonSave')
                                )}
                            </button>
                        </div>

                        {/* Feedback Messages */}
                        <div className="mt-1.5">
                            {discordError ? ( <p className="text-xs text-red-400">{discordError}</p>
                            ) : isSaved ? (
                                <p className="text-xs text-emerald-400">
                                    ✓ {tForm(foundUser ? 'successMilestonesUpdated' : 'successMilestonesSaved')}
                                </p>
                            ) : isRefreshVisible ? ( <p className="text-xs text-gray-400"> {tForm('infoMilestonesSaved')} </p>
                            ) : null}
                        </div>
                    </div>

                    {/* Achievements List */}
                    <div className="px-4 py-3 sm:px-5 sm:py-4">
                        <h3 className="text-white/80 text-xs sm:text-sm font-semibold mb-2.5 sm:mb-3">
                            {tGenericMenu('foundDesc')}
                        </h3>

                        {foundAchievements.length > 0 ? (
                            <div className="space-y-2 max-h-[140px] sm:max-h-[180px] overflow-y-auto pr-1.5 sm:pr-2
                                            scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
                                            hover:scrollbar-thumb-white/30">
                                {foundAchievements.map(({imageKey, icon}, index: number): JSX.Element => (
                                    <div key={index} className="flex items-center gap-2.5 sm:gap-3 px-2.5 py-2 sm:px-3
                                                                sm:py-2.5 bg-white/5 rounded-lg border border-white/10
                                                                hover:bg-white/10 hover:border-white/20 transition-all
                                                                duration-200 group">
                                        <span className="text-base sm:text-xl group-hover:scale-110 transition-transform">{icon}</span>
                                        <span className="text-white/90 text-xs sm:text-sm font-medium leading-tight">
                                            {tGenericMenu('generic_' + imageKey)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                                <span className="text-3xl sm:text-4xl mb-2.5 sm:mb-3 opacity-30">🔍</span>
                                <p className="text-white/40 text-xs sm:text-sm text-center">
                                    {tGenericMenu('emptyTipp')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}