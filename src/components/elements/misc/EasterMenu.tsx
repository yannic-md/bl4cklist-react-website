import {JSX, useEffect, useState} from 'react';
import Image from 'next/image';
import animations from '@/styles/util/animations.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons/faClose";
import {faDiscord} from "@fortawesome/free-brands-svg-icons/faDiscord";

export default function EasterMenu(): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [progress, setProgress] = useState(0);

    // TODO: https://canary.discord.com/channels/@me/728228737492975628/1451357569128988672 - for more details
    const foundEasterEggs = 6;
    const totalEasterEggs = 11;
    const foundAchievements: string[] = ["Sssssuper Reflexe", "Waka Waka Waka", "Waka Waka Waka", "Bei mir läuft's lokal"];

    const getBarColor = () => {
        if (progress <= 25) return "from-red-500 via-red-400 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
        if (progress <= 50) return "from-orange-500 via-orange-400 to-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]";
        if (progress <= 75) return "from-yellow-400 via-yellow-300 to-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]";
        return "from-emerald-500 via-green-500 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]";
    };

    const getTextColor = () => {
        if (progress <= 25) return "text-red-400";
        if (progress <= 50) return "text-orange-400";
        if (progress <= 75) return "text-yellow-300";
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
            <button data-achievement-button aria-label="Achievement Menu"
                    onClick={(): void => {
                        if (isOpen) {
                            handleClose();
                        } else {
                            setIsOpen(true);
                            setProgress(totalEasterEggs > 0 ? (foundEasterEggs / totalEasterEggs) * 100 : 0);
                        }}}
                    className={`fixed bottom-4 left-4 sm:bottom-5 sm:left-6 z-50 p-2 py-1.5 rounded-full 
                                bg-[rgba(29,30,35,0.92)] border border-white/10 shadow-lg backdrop-blur-md 
                                transition-all duration-200 hover:bg-white/20 hover:border-white/20 text-white 
                                text-lg !cursor-pointer hover:-translate-y-0.5 animate__animated animate__fadeInUp`}>
                <Image src="/images/icons/super-mario-star-cursor-32w.png" width={28} height={28}
                       className="!cursor-pointer sm:w-8 sm:h-8"
                       alt="Achievement Menu - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
            </button>

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
                                    - Deine Erfolge
                                </h2>
                            </div>
                            <button onClick={handleClose} aria-label="Close Menu"
                                    className="text-white/50 hover:text-white hover:bg-white/10 transition-all
                                               text-base leading-none !cursor-pointer rounded-lg p-2 w-8 h-8
                                               flex items-center justify-center">
                                <FontAwesomeIcon icon={faClose} />
                            </button>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-white/10">
                        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                            <span className="text-white/70 text-xs sm:text-sm font-medium">Dein Fortschritt:</span>
                            <span className="text-xs sm:text-sm font-semibold">
                                <span className={`${getTextColor()}`}>{foundEasterEggs}</span>
                                <span className="text-white/40 mx-1">/</span>
                                <span className="text-white/60">{totalEasterEggs}</span>
                            </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 sm:h-2.5 overflow-hidden border border-white/5">
                            <div className={`bg-gradient-to-r h-full transition-all duration-500 rounded-full ${getBarColor()}`}
                                 style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    {/* Discord Name Input */}
                    <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-white/10 flex items-center">
                        <div className="flex items-center justify-start gap-x-1">
                            <label htmlFor="discordName" className="text-white/80 text-xs sm:text-sm font-medium">
                                Speichere deinen Fortschritt:
                            </label>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <button type="button" id="discordName"
                                    className="px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg
                                               !cursor-pointer bg-[#5865F2] hover:bg-[#4752c4] text-white shadow-md
                                               transition-all duration-150 whitespace-nowrap
                                               disabled:bg-neutral-700 disabled:!cursor-not-allowed
                                               disabled:text-neutral-400">
                                <FontAwesomeIcon icon={faDiscord} className="me-1.5" />
                                Anmelden mit Discord
                            </button>
                        </div>
                    </div>

                    {/* Achievements List */}
                    <div className="px-4 py-3 sm:px-5 sm:py-4">
                        <h3 className="text-white/80 text-xs sm:text-sm font-semibold mb-2.5 sm:mb-3">
                            Gefundene Achievements
                        </h3>

                        {foundAchievements.length > 0 ? (
                            <div className="space-y-2 max-h-[140px] sm:max-h-[180px] overflow-y-auto pr-1.5 sm:pr-2
                                            scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
                                            hover:scrollbar-thumb-white/30">
                                {foundAchievements.map((achievement: string, index: number): JSX.Element => (
                                    <div key={index} className="flex items-center gap-2.5 sm:gap-3 px-2.5 py-2 sm:px-3
                                                                sm:py-2.5 bg-white/5 rounded-lg border border-white/10
                                                                hover:bg-white/10 hover:border-white/20 transition-all
                                                                duration-200 group">
                                        <span className="text-base sm:text-xl group-hover:scale-110 transition-transform">✨</span>
                                        <span className="text-white/90 text-xs sm:text-sm font-medium leading-tight">
                                            {achievement}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                                <span className="text-3xl sm:text-4xl mb-2.5 sm:mb-3 opacity-30">🔍</span>
                                <p className="text-white/40 text-xs sm:text-sm text-center">
                                    Noch keine Achievements gefunden
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}