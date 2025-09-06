import React, {JSX, useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faDiscord as faDiscordBrand } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import Image from 'next/image';
import {NextRouter, useRouter} from 'next/router';
import { NavigationItem } from '@/types/NavigationItem';
import head from '../../../styles/components/header.module.css';
import responsive from '../../../styles/util/responsive.module.css';

interface HeaderMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavigationItem[];
}

/**
 * Renders the mobile navigation menu for the header, including animated transitions,
 * expandable navigation items with dropdowns, and a Discord server button.
 * 
 * The menu appears as a modal overlay with a backdrop, and supports smooth enter/exit
 * animations. Navigation items can be expanded to reveal dropdown links, each with
 * optional icons and descriptions. The active route is highlighted for better UX.
 * 
 * Props:
 * - `isOpen` (boolean): Controls whether the mobile navigation menu is open and visible.
 * - `onClose` (function): Callback triggered when the menu should be closed, such as when
 *    the backdrop is clicked or a navigation link is selected.
 * - `navItems` (array): List of navigation items to display. Each item may contain a title,
 *    href, and an array of dropdown items with their own titles, hrefs, icons, descriptions,
 *    and external link indicators.
 * 
 * Features:
 * - Animated transitions for menu appearance/disappearance and dropdown expansion.
 * - Highlights the active navigation route.
 * - Handles backdrop clicks to close the menu.
 * - Includes a Discord server button at the bottom of the menu.
 * 
 * @component
 * @param {HeaderMobileNavProps} props - The props for the mobile navigation menu.
 * @returns {JSX.Element | null} The rendered mobile navigation menu, or null if not visible.
 */
export default function HeaderMobileNav({ isOpen, onClose, navItems }: HeaderMobileNavProps): JSX.Element | null {
  const router: NextRouter = useRouter();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect((): void => {
    if (isOpen) {
      setShouldRender(true);
      setAnimationComplete(false);
      setTimeout(() => setIsVisible(true), 10); // small delay to trigger animation
      setTimeout(() => setAnimationComplete(true), 750); // avoid scrollbar jump
    } else {
      setIsVisible(false);
      setAnimationComplete(false);
      setTimeout(() => setShouldRender(false), 200);  // Wait for the exit animation to finish
    }
  }, [isOpen]);

 /**
  * Toggles the expanded state of an item in a list by its index.
  * If the item is already expanded (its index is present in the expanded items array),
  * it will be collapsed (removed from the array). Otherwise, it will be expanded (added to the array).
  *
  * @param index - The index of the item to toggle in the expanded items array.
  */
  const toggleExpanded: (index: number) => void = (index: number): void => {
    setExpandedItem(prev => prev === index ? null : index);
  };

 /**
  * Determines whether the given `href` matches the current route.
  *
  * Returns `true` if the current route's pathname is exactly equal to `href`,
  * or if `href` is not the root path (`'/'`) and the current pathname starts with `href`.
  * This is useful for highlighting active navigation links in a mobile header.
  *
  * @param href - The route path to check against the current pathname.
  * @returns `true` if the route is active, otherwise `false`.
  */
  const isActive: (href: string) => boolean = (href: string): boolean => {
    return router.pathname === href || (href !== '/' && router.pathname.startsWith(href));
  };

 /**
  * Handles click events on the backdrop element.
  * If the user clicks directly on the backdrop (not on any child elements),
  * the `onClose` callback is triggered to close the modal or menu.
  *
  * @param e - The mouse event triggered by the user's click.
 */
  const handleBackdropClick: (e: React.MouseEvent) => void = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) { onClose(); }
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm -z-10 transition-opacity duration-200
                       ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleBackdropClick} />

      {/* Mobile Menu */}
      <div className={`fixed right-0 top-18 px-4 lg:px-16 lg:top-26 xl:top-28 min-w-max z-[19] 
                      transition-all duration-200 ease-out transform-gpu
                      ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'}`}>
        <div className={`flex flex-col w-xs pt-4 rounded-2xl outline-none max-h-[70vh] pointer-events-auto
                         border border-white/15 z-10 ${responsive.chrome_doesnt_like_nesting}
                         bg-[rgba(29,30,35,0.95)] backdrop-blur-md shadow-2xl`} 
             role="menu">
            <div className={`${animationComplete ? 'overflow-auto' : 'overflow-hidden'}`}>
                {navItems.map((item, index) => (
                    <div key={index} role="menuitem" 
                            className={`transition-all duration-300 ease-out transform
                                        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
                            style={{ transitionDelay: `${index * 50}ms` }}>
                        <button className={`flex items-center justify-between w-full text-left text-white/70 
                                            capitalize py-2.5 px-6 hover:text-white transition-colors duration-200 
                                            ${isActive(item.href) ? head.active : ''}`}
                                onClick={(): void => toggleExpanded(index)} aria-expanded={expandedItem === index}>
                        <span>{item.title}</span>
                        <FontAwesomeIcon icon={faChevronDown} size="2xs" className={`text-white/40 transition-transform 
                            duration-200 ${expandedItem === index ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Items */}
                        <div className={`overflow-hidden transition-all duration-500 ease-out
                                        ${expandedItem === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-2 flex flex-col bg-white/5 mx-2 rounded-lg mb-2">
                            {item.items.map((dropdownItem, dropdownIndex) => (
                            <Link key={dropdownIndex} href={dropdownItem.href} onClick={onClose}
                                    className={`flex items-center gap-3 text-base py-3 px-3 text-white/80 hover:text-white
                                            transition-all duration-200 border-b border-white/10 last:border-b-0
                                            hover:bg-white/5 hover:translate-x-1
                                            ${expandedItem === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                                    style={{ transitionDelay: expandedItem === index ? `${(dropdownIndex + 1) * 75}ms` : '0ms' }}>
                                
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 
                                            transition-transform duration-200 group-hover:scale-110">
                                <Image src={dropdownItem.icon} width={16} height={16} alt={`${dropdownItem.title} Icon`} />
                                </div>
                                
                                <div className="flex flex-col flex-1">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium">{dropdownItem.title}</span>
                                        {dropdownItem.isExternal && (
                                        <FontAwesomeIcon icon={faLink} size='2xs' className="ml-2 text-white/40" />
                                        )}
                                    </div>
                                    <div className="text-xs text-white/50 [text-transform:none]">
                                        {dropdownItem.description}
                                    </div>
                                </div>
                            </Link>
                            ))}
                        </div>
                        </div>
                    </div>
                ))}

                {/* Discord Button */}
                <div className={`flex flex-col items-end relative group z-[20] py-3 px-3 mx-auto w-full 
                                border-t border-white/10 mt-2 transition-all duration-300 ease-out
                                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: `${navItems.length * 50 + 100}ms` }}>
                    <a href="https://discord.gg/bl4cklist" target="_blank" onClick={onClose}
                    className="border border-white/5 rounded-[3.125rem] text-white py-1.5 px-4 font-semibold
                                bg-white/15 transition-all duration-200 ease-in-out w-full text-center
                                hover:bg-white/25 hover:border-white/20 hover:scale-105
                                hover:[box-shadow:_0_4px_4px_rgba(114,137,218,0.3)]">
                    <FontAwesomeIcon icon={faDiscordBrand} size='sm' className="mr-2" />Discord-Server
                    </a>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}