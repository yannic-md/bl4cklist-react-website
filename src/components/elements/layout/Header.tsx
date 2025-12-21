import Image from 'next/image';
import { JSX, useState } from "react";

import head from '../../../styles/components/header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { getNavItems, NavigationItem } from '@/types/NavigationItem';
import HeaderNavItem from './HeaderNavItem';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import HeaderMobileNav from './HeaderMobile';
import { useTranslations } from 'next-intl';
import {NextRouter, useRouter} from 'next/router';
import useConsoleListener from "@/hooks/useConsoleListener";

const dropdown_pos: string[] = ['left-[63px]', 'left-[145px]', 'left-[305px]', 'left-[435px]'];

/**
 * Renders the main header component for the website, including navigation for both desktop and mobile devices.
 *
 * - On large screens (2xl and above), displays a horizontal navigation bar with logo, navigation items, language switcher, and Discord button.
 * - On smaller screens, displays a compact header with a menu button, language switcher, and a mobile navigation menu.
 * - The component is fixed at the top of the viewport and uses various Tailwind CSS classes for styling and responsiveness.
 *
 * @returns {JSX.Element} The rendered header component with responsive navigation.
 */
export default function Header(): JSX.Element {
    const router: NextRouter = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const t = useTranslations('Navigation');
    const tDropdown = useTranslations('Dropdown');
    const tHeader = useTranslations('Header');
    const nav_items: NavigationItem[] = getNavItems(t, tDropdown);
    useConsoleListener();

    /**
     * Toggles the state of the mobile menu.
     * When called, it switches the `isMobileMenuOpen` state between open and closed.
     * Useful for showing or hiding the mobile navigation menu.
     */
    const toggleMobileMenu: () => void = (): void => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    /**
     * Closes the mobile menu by setting its open state to false.
     * Typically used as an event handler to hide the mobile navigation menu.
     */
    const closeMobileMenu: () => void = (): void => {
        setIsMobileMenuOpen(false);
    };

    /**
     * Switches the application language between German and English.
     * Uses Next.js router to change the locale while preserving the current path.
     */
    const switchLanguage: () => void = (): void => {
        const newLocale: "de" | "en" = router.locale === 'de' ? 'en' : 'de';
        window.location.href = `/${newLocale}${router.asPath}`;  /* don't use router redirect to show page loader */
    };

    /**
     * Gets the appropriate flag image based on current locale.
     * @returns The flag image path for the current language
     */
    const getCurrentFlag: () => string = (): string => {
        return router.locale === 'de' ? '/images/icons/lang/germany-35w.webp' : '/images/icons/lang/united-states-35w.webp';
    };

    /**
     * Gets the alt text for the flag image based on current locale.
     * @returns The alt text for the flag image
     */
    const getFlagAltText: () => string = (): string => {
        return router.locale === 'de' ? 'German Flag - Switch to English' : 'US Flag - Switch to German';
    };

    return (
        <header className="fixed top-5 lg:top-3 left-0 right-0 mt-0 z-[30] my-0 mx-auto py-0 px-4 lg:!p-0
                           xl:top-5 w-full">
            {/* Header for PCs & Laptops (Big Screens) */}
            <nav aria-label="Header Desktop" className="hidden 2xl:flex justify-center relative">
                <div className="relative">
                    <ul className={`relative inline-flex lg:flex items-center max-w-full h-14 mx-auto rounded-full 
                                   transition-colors duration-200 ease-in-out backdrop-blur-md z-10 transform-gpu
                                   bg-[rgba(29,30,35,0.8)] ${head.header_border} animate__animated animate__fadeInDown`}>
                        <div className="flex items-center justify-between w-full h-full capitalize py-3 pr-2 pl-3 gap-2">
                            <Link className="block w-8 ml-2 transition-all duration-200 hover:-translate-y-0.5" href="/">
                                <Image src="/images/brand/logo-64w.avif" className="object-contain !cursor-pointer"
                                       width={64} height={64} priority
                                       alt="Logo - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                            </Link>

                            {/* Navigation Items */}
                            <div className="flex-shrink-1">
                                <div className="flex items-center justify-between w-full h-full gap-2 capitalize py-3
                                                pr-2 pl-3">
                                    {nav_items.map((item, index) => (
                                        <HeaderNavItem key={index} item={item} leftPosition={dropdown_pos[index]} />
                                    ))}
                                </div>
                            </div>
                        
                            <div className="flex gap-2 ml-16 items-center mr-2">
                                {/* Language Switcher */}
                                {!router.pathname.includes('/imprint') &&
                                    <button className="transition-transform duration-500 ease-in-out transform animate-rotate
                                                       rotate-left cursor-pointer" onClick={switchLanguage}
                                            aria-label={`Switch to ${router.locale === 'de' ? 'English' : 'German'}`}>
                                        <Image src={getCurrentFlag()} width={31} height={31} alt={getFlagAltText()}
                                             className='bg-gray-500 transition-all duration-200 rounded-full hover:-translate-y-0.5
                                                        hover:bg-white/25 hover:border-white/20 !cursor-pointer
                                                        hover:[box-shadow:_0_4px_4px_rgba(114,137,218,0.3)]' />
                                    </button>
                                }

                                {/* Discord Button */}
                                <div className="flex flex-col items-end relative group w-full sm:w-auto z-[20] mt-0.5">
                                    <a href="https://discord.gg/bl4cklist" target="_blank" 
                                       className="border border-white/5 rounded-[3.125rem] text-white py-1.5 px-4 font-semibold
                                                bg-white/15 transition-all duration-200 ease-in-out -translate-y-[1px]
                                                hover:bg-white/25 hover:border-white/20 
                                                hover:[box-shadow:_0_4px_4px_rgba(114,137,218,0.3)]">
                                        <FontAwesomeIcon icon={faDiscord} size='sm' className="mr-2" />{tHeader('discord')}</a>
                                </div>
                            </div>
                        </div>
                    </ul>
                </div>
            </nav>

            {/* Header for Mobile Devices (Small Screens) */}
            <nav aria-label="Header Mobile" className="block 2xl:hidden lg:px-16 lg:pt-4 z-20">
                <div className="relative">
                    <ul className={`inline-flex bg-[rgba(29,30,35,0.8)] items-center w-full ${head.header_border} 
                                    rounded-full backdrop-blur-sm animate__animated animate__fadeInDown transform-gpu`}>
                        <div className="flex items-center justify-between w-full h-full gap-2 capitalize py-1.5
                                        lg:py-3 pl-3 pr-2">
                            <Link className="block w-8 ml-2" href="/">
                                <Image src="/images/brand/logo-64w.avif" className="object-contain"
                                       width={64} height={64} priority
                                       alt="Logo - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server" />
                            </Link>

                            <div className='flex flex-row-reverse items-center gap-3'>
                                {/* Toggle Mobile Menu Button */}
                                <button type="button" onClick={toggleMobileMenu}
                                        aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
                                        className="flex bg-white/5 p-1.5 lg:p-3 rounded-[3.5rem] mr-1.5 transition-colors 
                                                   duration-200 hover:bg-white/10">
                                    <div className="relative w-4 h-4 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faBars} className={`absolute text-white/70 
                                                                                   transition-all duration-300 ease-in-out
                                            ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                                        <FontAwesomeIcon icon={faTimes} className={`absolute text-white/70 transition-all duration-300 ease-in-out
                                            ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
                                    </div>
                                </button>

                                {/* Language Switcher */}
                                {!router.pathname.includes('/imprint') &&
                                    <button className="transition-transform duration-500 ease-in-out transform animate-rotate
                                                       rotate-left cursor-pointer" onClick={switchLanguage}
                                            aria-label={`Switch to ${router.locale === 'de' ? 'English' : 'German'}`}>
                                        <Image src={getCurrentFlag()} width={35} height={35} alt={getFlagAltText()}
                                               className='bg-gray-500 transition-all duration-200 rounded-full
                                                          hover:bg-white/25 hover:border-white/20 hover:-translate-y-0.5
                                                          hover:[box-shadow:_0_4px_4px_rgba(114,137,218,0.3)]' />
                                    </button>
                                }
                            </div>
                        </div>
                    </ul>
                </div>

                {/* Mobile Navigation Menu */}
                <HeaderMobileNav isOpen={isMobileMenuOpen} onClose={closeMobileMenu} navItems={nav_items} />
            </nav>

        </header>
    )
}
