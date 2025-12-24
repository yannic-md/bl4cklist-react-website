import Image from 'next/image';
import Link from 'next/link';
import responsive from '../../../styles/util/responsive.module.css';
import { DropdownItem } from '@/types/NavigationItem';
import {JSX, RefObject, useMemo, useRef} from "react";
import {useActiveSection} from "@/hooks/useActiveSection";
import {FaLink} from "react-icons/fa";

interface DropdownMenuProps {
  title: string;
  items: DropdownItem[];
  leftPosition: string;
}

/**
 * Renders a dropdown menu for the header with a title and a list of selectable items.
 *
 * @param {DropdownMenuProps} props - The properties for the dropdown menu.
 * @param {string} props.title - The title displayed at the top of the dropdown.
 * @param {Array} props.items - The array of menu items to display in the dropdown. Each item should include:
 *   - `title`: The display text for the item.
 *   - `href`: The link URL for the item.
 *   - `icon`: The icon image source for the item.
 *   - `description`: A short description for the item.
 *   - `isExternal` (optional): Whether the link is external.
 * @param {string} props.leftPosition - The CSS class for positioning the dropdown horizontally.
 * @returns {JSX.Element} The rendered dropdown menu component.
 */
export default function HeaderDropdown({ title, items, leftPosition }: DropdownMenuProps): JSX.Element {
    const dropdownRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

    /**
     * Extracts section IDs from the hrefs of dropdown items.
     * Only hrefs containing a hash (#) are considered.
     *
     * @param {DropdownItem[]} items - Array of dropdown items.
     * @returns {string[]} Array of section IDs.
     */
    const sectionIds: string[] = useMemo((): string[] =>
            items.map((item: DropdownItem): string => item.href.includes('#') ? item.href.split('#')[1] : '')
                 .filter((id: string): boolean => id !== ''), [items]
    );

    const activeSection: string = useActiveSection(sectionIds);

    /**
     * Checks if the given href corresponds to the currently active section.
     *
     * @param {string} href - The link URL containing a section hash.
     * @returns {boolean} True if the section in href matches the active section, otherwise false.
     */
    const isItemActive: (href: string) => boolean = (href: string): boolean => {
        if (!href.includes('#')) return false;
        const sectionId: string = href.split('#')[1];
        return sectionId === activeSection;
    };

    /**
     * Closes the dropdown by temporarily disabling pointer events on the parent element.
     * Adds the `pointer-events-none` class to prevent interaction, then removes it after 200ms
     * to match the transition duration for smooth UI behavior.
     */
    const closeDropdown: () => void = (): void => {
        const parentElement: HTMLDivElement | undefined | null = dropdownRef.current?.closest('.group');
        if (parentElement) {
            parentElement.classList.add('pointer-events-none');

            setTimeout((): void => {
                parentElement.classList.remove('pointer-events-none');
            }, 200); // 200ms equals transition-duration
        }
    };

    return (
        <div ref={dropdownRef} className={`absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                         transition-all duration-200 ease-in-out flex z-20 top-[calc(100%+8px)] rounded-3xl
                         backdrop-blur-xl ${leftPosition} ${responsive.chrome_doesnt_like_nesting} border border-white/15`}>
          <div className="flex flex-col self-start pt-5 px-3.5 pb-3.5 gap-1 min-w-48">
            <div className="flex items-center h-6 leading-6 pl-1.5 mb-1.5 text-white/60 font-medium">
              {title}
            </div>

            {items.map((item, index) => (
              <Link key={index} href={item.href} onClick={closeDropdown}
                    className={`flex justify-start items-center gap-3 text-left capitalize text-white/90 text-base px-3 
                                py-2 rounded-lg ${isItemActive(item.href) ? 'text-white bg-white/10 border border-white/20' 
                                                                          : 'text-white/90 hover:text-white hover:bg-white/6'}`}>
                  <div className={`flex items-center justify-center w-[42px] h-[42px] rounded-lg
                                  ${isItemActive(item.href) ? '[box-shadow:inset_0_0_0_1px_hsla(0,0%,100%,.2)]'
                                                            : '[box-shadow:inset_0_0_0_1px_hsla(0,0%,100%,.1)]'}`}>
                  <Image src={item.icon} width={20} height={20}
                         alt={`${item.title} Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server`} />
                </div>

                <div className="flex flex-col justify-center">
                  <div className="inline-flex items-center justify-start">
                    <span>{item.title}</span>
                    {item.isExternal && ( <FaLink size={10} className="ml-2 text-white/40" /> )}
                  </div>
                  <div className="text-xs text-white/40 [text-transform:none]">{item.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
  );
}