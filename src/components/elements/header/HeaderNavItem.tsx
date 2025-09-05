import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import head from '../../../styles/components/header.module.css';
import { NavigationItem } from '@/types/NavigationItem';
import HeaderDropdown from './HeaderDropdown';
import { useRouter } from 'next/router';

interface NavigationItemProps {
  item: NavigationItem;
  leftPosition: string;
  isActive?: boolean;
}

/**
 * Renders a navigation item for the header, including a link button and an optional dropdown menu.
 *
 * @param item - The navigation item data, including title, href, and optional dropdown items.
 * @param leftPosition - The left position value used for positioning the dropdown menu.
 * @returns A list item (`<li>`) containing a styled navigation button and a dropdown menu if provided.
 *
 * The navigation button highlights as active if the current route matches the item's href.
 */
export default function HeaderNavItem({ item, leftPosition }: NavigationItemProps) {
  const router = useRouter();
  const isActive = router.pathname === item.href || 
                   (item.href !== '/' && router.pathname.startsWith(item.href));

  return (
    <li className="group">
      <Link href={item.href}>
        <button className={`flex gap-2 pt-2.5 pr-1.5 pb-2.5 pl-2.5 p-2.5 text-white/70 
                            cursor-pointer transition-colors duration-200 group-hover:text-white 
                            group-hover:[text-shadow:_0_0_1px_currentColor] ${isActive ? head.active : ''}`}>
          <span>{item.title}</span> 
          <FontAwesomeIcon icon={faChevronDown} size='2xs' 
                           className="self-center opacity-40 transition-all duration-200 group-hover:rotate-180" />
        </button>
      </Link>

      <HeaderDropdown title={item.dropdownTitle} items={item.items} leftPosition={leftPosition} />
    </li>
  );
}