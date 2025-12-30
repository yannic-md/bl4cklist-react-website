import {render, screen, fireEvent, act} from '@testing-library/react';
import { useRouter } from 'next/router';
import HeaderMobileNav from "@/components/elements/layout/HeaderMobile";
import {NavigationItem} from "@/types/NavigationItem";

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('next/link', () => {
    return ({ children, href, onClick, className, style }: any) => {
        return (
            <a href={href} onClick={onClick} className={className} style={style}>
                {children}
            </a>
        );
    };
});

jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

describe('HeaderMobileNav', () => {
    const mockRouter = {
        push: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
    };

    const mockNavItems = [
        {
            title: 'Products',
            href: '/products',
            items: [
                {
                    title: 'Product 1',
                    href: '/products/product-1',
                    description: 'Description 1',
                    icon: '/icon1.svg',
                    isExternal: false,
                },
                {
                    title: 'Product 2',
                    href: '/products/product-2',
                    description: 'Description 2',
                    icon: '/icon2.svg',
                    isExternal: true,
                },
            ],
        },
        {
            title: 'Services',
            href: '/services',
            items: [
                {
                    title: 'Service 1',
                    href: '/services/service-1',
                    description: 'Service Description',
                    icon: '/icon3.svg',
                    isExternal: false,
                },
            ],
        },
    ] as NavigationItem[];

    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.useFakeTimers();
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('should return null when isOpen is false and shouldRender is false', () => {
        const { container } = render(
            <HeaderMobileNav isOpen={false} onClose={mockOnClose} navItems={mockNavItems} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should render when isOpen is true and trigger animations', () => {
        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />);

        // shouldRender becomes true immediately
        expect(screen.getByRole('menu')).toBeInTheDocument();

        // isVisible becomes true after 10ms
        act(() => { jest.advanceTimersByTime(10); });
        expect(screen.getByRole('menu')).toBeInTheDocument();

        // animationComplete becomes true after 750ms
        act(() => { jest.advanceTimersByTime(750); });
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should hide menu when isOpen changes from true to false', () => {
        const { rerender } = render(
            <HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />
        );

        act(() => { jest.advanceTimersByTime(10); });
        expect(screen.getByRole('menu')).toBeInTheDocument();

        rerender(<HeaderMobileNav isOpen={false} onClose={mockOnClose} navItems={mockNavItems} />);

        // Wait for exit animation (200ms)
        act(() => { jest.advanceTimersByTime(200); });

        // Component should be unmounted after animation
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should toggle expanded item when button is clicked', () => {
        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />);

        act(() => { jest.advanceTimersByTime(10); });

        const firstButton = screen.getByText('Products').closest('button');
        expect(firstButton).toHaveAttribute('aria-expanded', 'false');

        // Expand first item
        fireEvent.click(firstButton!);
        expect(firstButton).toHaveAttribute('aria-expanded', 'true');

        // Collapse first item by clicking again
        fireEvent.click(firstButton!);
        expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should collapse previous item when expanding a new item', () => {
        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />);

        act(() => { jest.advanceTimersByTime(10); });

        const firstButton = screen.getByText('Products').closest('button');
        const secondButton = screen.getByText('Services').closest('button');

        // Expand first item
        fireEvent.click(firstButton!);
        expect(firstButton).toHaveAttribute('aria-expanded', 'true');
        expect(secondButton).toHaveAttribute('aria-expanded', 'false');

        // Expand second item
        fireEvent.click(secondButton!);
        expect(firstButton).toHaveAttribute('aria-expanded', 'false');
        expect(secondButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should mark item as active when pathname matches href exactly', () => {
        mockRouter.pathname = '/products';

        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />);

        act(() => { jest.advanceTimersByTime(10); });

        const activeButton = screen.getByText('Products').closest('button');
        expect(activeButton?.className).toContain('active');
    });

    it('should mark item as active when pathname starts with href (not root)', () => {
        mockRouter.pathname = '/products/product-1';

        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />);

        act(() => { jest.advanceTimersByTime(10); });

        const activeButton = screen.getByText('Products').closest('button');
        expect(activeButton?.className).toContain('active');
    });

    it('should not mark root path as active when pathname starts with it', () => {
        mockRouter.pathname = '/about';

        const rootNavItems = [
            {
                title: 'Home',
                href: '/',
                items: [],
            },
        ] as unknown as NavigationItem[];

        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={rootNavItems} />);

        act(() => { jest.advanceTimersByTime(10); });

        const homeButton = screen.getByText('Home').closest('button');
        expect(homeButton?.className).not.toContain('active');
    });

    it('should handle href with hash and match pathname correctly', () => {
        mockRouter.pathname = '/products';

        const navItemsWithHash = [
            {
                title: 'Products',
                href: '/products#section',
                items: [],
            },
        ] as unknown as NavigationItem[];

        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={navItemsWithHash} />);

        act(() => { jest.advanceTimersByTime(10); });

        const activeButton = screen.getByText('Products').closest('button');
        expect(activeButton?.className).toContain('active');
    });

    it('should call onClose when clicking on backdrop', () => {
        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />);

        act(() => { jest.advanceTimersByTime(10); });

        const backdrop = screen.getByRole('menu').parentElement?.previousSibling as HTMLElement;
        fireEvent.click(backdrop);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when clicking on menu content (child element)', () => {
        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />);

        act(() => { jest.advanceTimersByTime(10); });

        const backdrop = screen.getByRole('menu').parentElement?.previousSibling as HTMLElement;

        // Simulate clicking on a child element by making target !== currentTarget
        const clickEvent = new MouseEvent('click', { bubbles: true });
        Object.defineProperty(clickEvent, 'target', { value: document.createElement('div'), configurable: true });
        Object.defineProperty(clickEvent, 'currentTarget', { value: backdrop, configurable: true });

        fireEvent(backdrop, clickEvent);

        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should call onClose when clicking on dropdown link', () => {
        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />);

        act(() => { jest.advanceTimersByTime(10); });

        // Expand first item to reveal dropdown links
        const firstButton = screen.getByText('Products').closest('button');
        fireEvent.click(firstButton!);

        const dropdownLink = screen.getByText('Product 1').closest('a');
        fireEvent.click(dropdownLink!);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when clicking on Discord link', () => {
        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />);

        act(() => { jest.advanceTimersByTime(10); });

        const discordLink = screen.getByText('Discord-Server').closest('a');
        fireEvent.click(discordLink!);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should render external link indicator when isExternal is true', () => {
        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />);

        act(() => { jest.advanceTimersByTime(10); });

        // Expand first item
        const firstButton = screen.getByText('Products').closest('button');
        fireEvent.click(firstButton!);

        // Product 2 has isExternal: true
        const product2Link = screen.getByText('Product 2');
        expect(product2Link.parentElement?.querySelector('svg')).toBeInTheDocument();
    });

    it('should not render external link indicator when isExternal is false', () => {
        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />);

        act(() => { jest.advanceTimersByTime(10); });

        // Expand first item
        const firstButton = screen.getByText('Products').closest('button');
        fireEvent.click(firstButton!);

        // Product 1 has isExternal: false
        const product1Link = screen.getByText('Product 1');
        const product1Container = product1Link.parentElement;

        // Check that FaLink is not rendered for Product 1
        expect(product1Container?.querySelectorAll('svg').length).toBe(0);
    });

    it('should render all navigation items with correct structure', () => {
        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />);

        act(() => { jest.advanceTimersByTime(10); });

        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Services')).toBeInTheDocument();
    });

    it('should render dropdown items when expanded', () => {
        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />);

        act(() => { jest.advanceTimersByTime(10); });

        const firstButton = screen.getByText('Products').closest('button');
        fireEvent.click(firstButton!);

        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByText('Description 1')).toBeInTheDocument();
        expect(screen.getByText('Description 2')).toBeInTheDocument();
    });

    it('should render icons for dropdown items', () => {
        render(<HeaderMobileNav isOpen={true} onClose={mockOnClose} navItems={mockNavItems} />);

        act(() => { jest.advanceTimersByTime(10); });

        const firstButton = screen.getByText('Products').closest('button');
        fireEvent.click(firstButton!);

        expect(screen.getByAltText('Product 1 Icon')).toBeInTheDocument();
        expect(screen.getByAltText('Product 2 Icon')).toBeInTheDocument();
    });
});