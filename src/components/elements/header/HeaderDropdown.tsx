import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import responsive from '../../../styles/util/responsive.module.css';
import { DropdownItem } from '@/types/NavigationItem';
import {JSX} from "react";

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
  return (
    <div className={`absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                     transition-all duration-200 ease-in-out flex z-20 top-[calc(100%+8px)] rounded-3xl
                     backdrop-blur-xl ${leftPosition} ${responsive.chrome_doesnt_like_nesting} border border-white/15`}>
      <div className="flex flex-col self-start pt-5 px-3.5 pb-3.5 gap-1 min-w-48">
        <div className="flex items-center h-6 leading-6 pl-1.5 mb-1.5 text-white/60 font-medium">
          {title}
        </div>

        {items.map((item, index) => (
          <Link key={index} className="flex justify-start items-center gap-3 text-left capitalize text-white/90 
                                       text-base px-3 py-2 rounded-lg hover:text-white hover:bg-white/6" 
            href={item.href}>
            <div className="flex items-center justify-center w-[42px] h-[42px] rounded-lg
                            [box-shadow:inset_0_0_0_1px_hsla(0,0%,100%,.1)]">
              <Image src={item.icon} width={20} height={20}
                     alt={`${item.title} Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server`} />
            </div>
            
            <div className="flex flex-col justify-center">
              <div>
                <span>{item.title}</span>
                {item.isExternal && ( <FontAwesomeIcon icon={faLink} size='2xs' className="ml-2 text-white/40" /> )}
              </div>
              <div className="text-xs text-white/40 [text-transform:none]">{item.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}