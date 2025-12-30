import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import type { NextRouter } from 'next/router';
import HeaderNavItem from "@/components/elements/layout/HeaderNavItem";
import {NavigationItem} from "@/types/NavigationItem";

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => {
        return <a href={href}>{children}</a>;
    };
});

jest.mock('react-icons/fa', () => ({
    FaChevronDown: ({ size, className }: { size: number; className: string }) => (
        <span data-testid="chevron-icon" data-size={size} className={className} />
    ),
}));

jest.mock('@/components/elements/layout/HeaderDropdown', () => {
    return function HeaderDropdown({ title, items, leftPosition }: any) {
        return (
            <div data-testid="header-dropdown" data-title={title} data-left-position={leftPosition}>
                {items?.map((item: any, index: number) => (
                    <div key={index}>{item.title}</div>
                ))}
            </div>
        );
    };
});

jest.mock('@/styles/components/header.module.css', () => ({
    active: 'active-class',
}));

describe('HeaderNavItem', () => {
    const mockRouter: Partial<NextRouter> = {
        pathname: '/',
        query: {},
        asPath: '/',
        push: jest.fn(),
        replace: jest.fn(),
    };

    const mockItem = {
        title: 'Test Item',
        href: '/test',
        dropdownTitle: 'Test Dropdown',
        items: [
            { title: 'Item 1', href: '/test/item1' },
            { title: 'Item 2', href: '/test/item2' },
        ],
    } as NavigationItem;

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('should render the navigation item with title', () => {
        render(<HeaderNavItem item={mockItem} leftPosition={"0"} />);

        expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    it('should render Link with correct href', () => {
        render(<HeaderNavItem item={mockItem} leftPosition={"0"} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/test');
    });

    it('should render FaChevronDown icon with correct props', () => {
        render(<HeaderNavItem item={mockItem} leftPosition={"0"} />);

        const icon = screen.getByTestId('chevron-icon');
        expect(icon).toHaveAttribute('data-size', '10');
        expect(icon).toHaveClass('self-center', 'opacity-40', 'transition-all', 'duration-200', 'group-hover:rotate-180');
    });

    it('should render HeaderDropdown with correct props', () => {
        render(<HeaderNavItem item={mockItem} leftPosition={"100"} />);

        const dropdown = screen.getByTestId('header-dropdown');
        expect(dropdown).toHaveAttribute('data-title', 'Test Dropdown');
        expect(dropdown).toHaveAttribute('data-left-position', '100');
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should apply active class when pathname matches href exactly', () => {
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouter,
            pathname: '/test',
        });

        render(<HeaderNavItem item={mockItem} leftPosition={"0"} />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('active-class');
    });

    it('should apply active class when pathname matches href without hash', () => {
        const itemWithHash = { ...mockItem, href: '/test#section' };
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouter,
            pathname: '/test',
        });

        render(<HeaderNavItem item={itemWithHash} leftPosition={"0"} />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('active-class');
    });

    it('should apply active class when pathname starts with href for non-root paths', () => {
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouter,
            pathname: '/test/subpage',
        });

        render(<HeaderNavItem item={mockItem} leftPosition={"0"} />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('active-class');
    });

    it('should not apply active class when pathname does not match', () => {
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouter,
            pathname: '/other',
        });

        render(<HeaderNavItem item={mockItem} leftPosition={"0"} />);

        const button = screen.getByRole('button');
        expect(button).not.toHaveClass('active-class');
    });

    it('should not apply active class for root path when on different page', () => {
        const rootItem = { ...mockItem, href: '/' };
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouter,
            pathname: '/other',
        });

        render(<HeaderNavItem item={rootItem} leftPosition={"0"} />);

        const button = screen.getByRole('button');
        expect(button).not.toHaveClass('active-class');
    });

    it('should apply active class for root path when on root page', () => {
        const rootItem = { ...mockItem, href: '/' };
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouter,
            pathname: '/',
        });

        render(<HeaderNavItem item={rootItem} leftPosition={"0"} />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('active-class');
    });

    it('should not apply active class for root path with startsWith logic', () => {
        const rootItem = { ...mockItem, href: '/' };
        (useRouter as jest.Mock).mockReturnValue({
            ...mockRouter,
            pathname: '/about',
        });

        render(<HeaderNavItem item={rootItem} leftPosition={"0"} />);

        const button = screen.getByRole('button');
        expect(button).not.toHaveClass('active-class');
    });
});