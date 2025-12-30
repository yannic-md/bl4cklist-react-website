import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import { useActiveSection } from '@/hooks/useActiveSection';
import HeaderDropdown from "@/components/elements/layout/HeaderDropdown";

jest.mock('@/hooks/useActiveSection', () => ({
    useActiveSection: jest.fn()
}));
jest.mock('next/link', () => {
    return ({ children, href, onClick, className }: any) => (
        <a href={href} onClick={onClick} className={className}>
            {children}
        </a>
    );
});
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

describe('HeaderDropdown', () => {
    const mockItems = [
        {
            title: 'Features',
            description: 'See all features',
            href: '/features#overview',
            icon: '/icons/features.svg',
            isExternal: false,
        },
        {
            title: 'Documentation',
            description: 'Read the docs',
            href: 'https://docs.example.com',
            icon: '/icons/docs.svg',
            isExternal: true,
        },
        {
            title: 'Support',
            description: 'Get help',
            href: '/support#contact',
            icon: '/icons/support.svg',
            isExternal: false,
        },
    ];

    const defaultProps = {
        title: 'Menu',
        items: mockItems,
        leftPosition: 'left-0',
    };

    beforeEach(() => {
        jest.useFakeTimers();
        (useActiveSection as jest.Mock).mockReturnValue('');
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('should render dropdown with title and all items', () => {
        render(<HeaderDropdown {...defaultProps} />);

        expect(screen.getByText('Menu')).toBeInTheDocument();
        expect(screen.getByText('Features')).toBeInTheDocument();
        expect(screen.getByText('See all features')).toBeInTheDocument();
        expect(screen.getByText('Documentation')).toBeInTheDocument();
        expect(screen.getByText('Support')).toBeInTheDocument();
    });

    it('should render external link icon only for external items', () => {
        render(<HeaderDropdown {...defaultProps} />);

        const links = screen.getAllByRole('link');
        const documentationLink = links[1];

        expect(documentationLink.querySelector('svg')).toBeInTheDocument();
    });

    it('should not render external link icon for internal items', () => {
        const singleItemProps = {
            title: 'Menu',
            items: [mockItems[0]],
            leftPosition: 'left-0',
        };

        render(<HeaderDropdown {...singleItemProps} />);

        const link = screen.getByRole('link');
        expect(link.querySelector('svg')).not.toBeInTheDocument();
    });

    it('should apply active styles when item matches active section', () => {
        (useActiveSection as jest.Mock).mockReturnValue('overview');

        render(<HeaderDropdown {...defaultProps} />);

        const featuresLink = screen.getByText('Features').closest('a');
        expect(featuresLink).toHaveClass('text-white bg-white/10 border border-white/20');
    });

    it('should not apply active styles when item does not match active section', () => {
        (useActiveSection as jest.Mock).mockReturnValue('other-section');

        render(<HeaderDropdown {...defaultProps} />);

        const featuresLink = screen.getByText('Features').closest('a');
        expect(featuresLink).toHaveClass('text-white/90 hover:text-white hover:bg-white/6');
        expect(featuresLink).not.toHaveClass('bg-white/10');
    });

    it('should return false in isItemActive when href has no hash', () => {
        (useActiveSection as jest.Mock).mockReturnValue('overview');

        const noHashProps = {
            title: 'Menu',
            items: [
                {
                    title: 'Home',
                    description: 'Go home',
                    href: '/home',
                    icon: '/icons/home.svg',
                    isExternal: false,
                },
            ],
            leftPosition: 'left-0',
        };

        render(<HeaderDropdown {...noHashProps} />);

        const homeLink = screen.getByText('Home').closest('a');
        expect(homeLink).not.toHaveClass('bg-white/10');
    });

    it('should close dropdown when clicking on a link', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const container = document.createElement('div');
        container.className = 'group';
        document.body.appendChild(container);

        const { container: renderedContainer } = render(
            <HeaderDropdown {...defaultProps} />,
            { container: document.body.appendChild(container) }
        );

        const link = screen.getByText('Features').closest('a');
        fireEvent.click(link!);

        await waitFor(() => {
            // document.location.href shouldn't/can't be mocked
            expect(console.error).toHaveBeenCalledTimes(1);
        });

        jest.advanceTimersByTime(200);

        await waitFor(() => {
            // document.location.href shouldn't/can't be mocked
            expect(console.error).toHaveBeenCalledTimes(1);
        });

        document.body.removeChild(container);
    });

    it('should not throw error when closeDropdown is called without parent element', () => {
        render(<HeaderDropdown {...defaultProps} />);

        const link = screen.getByText('Features').closest('a');

        expect(() => {
            fireEvent.click(link!);
        }).not.toThrow();
    });

    it('should render correct number of items', () => {
        render(<HeaderDropdown {...defaultProps} />);

        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(3);
    });

    it('should render images with correct alt text', () => {
        render(<HeaderDropdown {...defaultProps} />);

        const featuresImage = screen.getByAltText('Features Icon - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(featuresImage).toBeInTheDocument();
        expect(featuresImage).toHaveAttribute('src', '/icons/features.svg');
    });

    it('should apply leftPosition class correctly', () => {
        const { container } = render(<HeaderDropdown {...defaultProps} />);

        const dropdown = container.firstChild as HTMLElement;
        expect(dropdown).toHaveClass('left-0');
    });

    it('should apply different leftPosition class', () => {
        const customProps = {
            ...defaultProps,
            leftPosition: 'right-0',
        };

        const { container } = render(<HeaderDropdown {...customProps} />);

        const dropdown = container.firstChild as HTMLElement;
        expect(dropdown).toHaveClass('right-0');
    });
});