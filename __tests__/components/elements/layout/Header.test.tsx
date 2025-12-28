/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://localhost/"}
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import {getNavItems} from "@/types/NavigationItem";
import useConsoleListener from "@/hooks/useConsoleListener";
import Header from "@/components/elements/layout/Header";

// Mock all dependencies
jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

jest.mock('@/types/NavigationItem', () => ({
    getNavItems: jest.fn(),
}));

jest.mock('@/hooks/useConsoleListener', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('@/components/elements/layout/HeaderNavItem', () => ({
    __esModule: true,
    default: ({ item }: any) => <li data-testid="nav-item">{item.label}</li>,
}));

jest.mock('@/components/elements/layout/HeaderMobile', () => ({
    __esModule: true,
    default: ({ isOpen, onClose, navItems }: any) => (
        isOpen ? (
            <div data-testid="mobile-nav">
                <button onClick={onClose}>Close Mobile Nav</button>
                {navItems.map((item: any, i: number) => <div key={i}>{item.label}</div>)}
            </div>
        ) : null
    ),
}));

jest.mock('react-icons/fa', () => ({
    FaDiscord: () => <span data-testid="discord-icon">Discord</span>,
    FaBars: (props: any) => <span data-testid="bars-icon" className={props.className}>Bars</span>,
    FaTimes: (props: any) => <span data-testid="times-icon" className={props.className}>Times</span>,
}));

describe('Header', () => {
    const mockPush = jest.fn();
    const mockTranslations = jest.fn((key: string) => key);
    const mockNavItems = [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
    ];

    const mockRouter = {
        push: mockPush,
        pathname: '/',
        asPath: '/test',
        locale: 'de',
        query: {},
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useTranslations as jest.Mock).mockReturnValue(mockTranslations);
        (getNavItems as jest.Mock).mockReturnValue(mockNavItems);
        (useConsoleListener as jest.Mock).mockReturnValue(undefined);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render desktop navigation', () => {
        render(<Header />);

        expect(screen.getByLabelText('Header Desktop')).toBeInTheDocument();
    });

    it('should render mobile navigation', () => {
        render(<Header />);

        expect(screen.getByLabelText('Header Mobile')).toBeInTheDocument();
    });

    it('should render logo with correct attributes', () => {
        render(<Header />);

        const logos = screen.getAllByAltText('Logo - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(logos).toHaveLength(2); // Desktop + Mobile
        expect(logos[0]).toHaveAttribute('src', '/images/brand/logo-64w.avif');
    });

    it('should render all navigation items', () => {
        render(<Header />);

        const navItems = screen.getAllByTestId('nav-item');
        expect(navItems).toHaveLength(2);
        expect(navItems[0]).toHaveTextContent('Home');
        expect(navItems[1]).toHaveTextContent('About');
    });

    it('should render Discord button with correct link', () => {
        render(<Header />);

        const discordLink = screen.getByText('Discord').parentElement as HTMLElement;
        expect(discordLink).toHaveAttribute('href', 'https://discord.gg/bl4cklist');
        expect(discordLink).toHaveAttribute('target', '_blank');
    });

    it('should render language switcher when not on imprint page', () => {
        render(<Header />);

        const languageSwitchers = screen.getAllByLabelText('Switch to English');
        expect(languageSwitchers).toHaveLength(2); // Desktop + Mobile
    });

    it('should not render language switcher on imprint page', () => {
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouter,
            pathname: '/imprint',
        });

        render(<Header />);

        const languageSwitchers = screen.queryAllByLabelText('Switch to English');
        expect(languageSwitchers).toHaveLength(0);
    });

    it('should switch language from German to English', () => {
        jest.spyOn(console, "error").mockImplementation();
        render(<Header />);

        const languageSwitcher = screen.getAllByLabelText('Switch to English')[0];

        fireEvent.click(languageSwitcher);

        // document.location.href shouldn't/can't be mocked
        expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('should switch language from English to German', () => {
        jest.spyOn(console, "error").mockImplementation();

        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouter,
            locale: 'en',
        });

        render(<Header />);
        const languageSwitcher = screen.getAllByLabelText('Switch to German')[0];

        fireEvent.click(languageSwitcher);

        // document.location.href shouldn't/can't be mocked
        expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('should display German flag when locale is de', () => {
        render(<Header />);
        const flags = screen.getAllByAltText('German Flag - Switch to English');
        expect(flags[0]).toHaveAttribute('src', '/images/icons/lang/germany-35w.webp');
    });

    it('should display US flag when locale is en', () => {
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouter,
            locale: 'en',
        });

        render(<Header />);
        const flags = screen.getAllByAltText('US Flag - Switch to German');
        expect(flags[0]).toHaveAttribute('src', '/images/icons/lang/united-states-35w.webp');
    });

    it('should toggle mobile menu open', () => {
        render(<Header />);
        const toggleButton = screen.getByLabelText('Menü öffnen');

        fireEvent.click(toggleButton);

        expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();
        expect(screen.getByLabelText('Menü schließen')).toBeInTheDocument();
    });

    it('should toggle mobile menu closed', () => {
        render(<Header />);
        const toggleButton = screen.getByLabelText('Menü öffnen');

        // Open menu
        fireEvent.click(toggleButton);
        expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();

        // Close menu
        const closeButton = screen.getByLabelText('Menü schließen');
        fireEvent.click(closeButton);

        expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
    });

    it('should close mobile menu via HeaderMobileNav onClose', () => {
        render(<Header />);

        // Open menu
        fireEvent.click(screen.getByLabelText('Menü öffnen'));
        expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();

        // Close via mobile nav component
        fireEvent.click(screen.getByText('Close Mobile Nav'));

        expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
    });

    it('should display correct icon states when menu is closed', () => {
        render(<Header />);
        const barsIcon = screen.getByTestId('bars-icon');
        const timesIcon = screen.getByTestId('times-icon');

        expect(barsIcon.className).toContain('opacity-100');
        expect(timesIcon.className).toContain('opacity-0');
    });

    it('should display correct icon states when menu is open', () => {
        render(<Header />);

        fireEvent.click(screen.getByLabelText('Menü öffnen'));

        const barsIcon = screen.getByTestId('bars-icon');
        const timesIcon = screen.getByTestId('times-icon');

        expect(barsIcon.className).toContain('opacity-0');
        expect(timesIcon.className).toContain('opacity-100');
    });

    it('should call useConsoleListener on mount', () => {
        render(<Header />);
        expect(useConsoleListener).toHaveBeenCalled();
    });
});