import { render, screen, fireEvent } from '@testing-library/react';
import FAQItem, {FAQItemProps} from "@/components/elements/grid/FAQItem";

// Mock Next.js Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
    FaChevronDown: () => <span data-testid="chevron-icon">ChevronDown</span>,
}));

describe('FAQItem', () => {
    const mockOnToggle = jest.fn();

    const defaultProps: FAQItemProps = {
        index: 0,
        isOpen: false,
        title: 'Test FAQ Title',
        description: '<p>Test description content</p>',
        onToggle: mockOnToggle,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render title correctly', () => {
        render(<FAQItem {...defaultProps} />);
        expect(screen.getByText('Test FAQ Title')).toBeInTheDocument();
    });

    it('should render chevron icon', () => {
        render(<FAQItem {...defaultProps} />);
        expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
    });

    it('should call onToggle with correct index when clicked', () => {
        render(<FAQItem {...defaultProps} />);
        const clickableArea = screen.getByText('Test FAQ Title').closest('div');

        fireEvent.click(clickableArea!);

        expect(mockOnToggle).toHaveBeenCalledTimes(1);
        expect(mockOnToggle).toHaveBeenCalledWith(0);
    });

    it('should call onToggle with custom index when clicked', () => {
        const customProps = { ...defaultProps, index: 5 };
        render(<FAQItem {...customProps} />);
        const clickableArea = screen.getByText('Test FAQ Title').closest('div');

        fireEvent.click(clickableArea!);

        expect(mockOnToggle).toHaveBeenCalledWith(5);
    });

    it('should render description with HTML content when isOpen is true', () => {
        const props = { ...defaultProps, isOpen: true };
        render(<FAQItem {...props} />);

        const descriptionElement = screen.getByText((_content, element) => {
            return element?.innerHTML === '<p>Test description content</p>';
        });

        expect(descriptionElement).toBeInTheDocument();
    });

    it('should not display description content when isOpen is false', () => {
        render(<FAQItem {...defaultProps} />);

        const container = screen.getByText('Test FAQ Title').closest('div')?.parentElement;
        const descriptionContainer = container?.querySelector('.max-h-0');

        expect(descriptionContainer).toBeInTheDocument();
    });

    it('should apply rotate-180 class to chevron when isOpen is true', () => {
        const props = { ...defaultProps, isOpen: true };
        render(<FAQItem {...props} />);

        const chevronContainer = screen.getByTestId('chevron-icon').parentElement;
        expect(chevronContainer?.className).toContain('rotate-180');
    });

    it('should not apply rotate-180 class to chevron when isOpen is false', () => {
        render(<FAQItem {...defaultProps} />);

        const chevronContainer = screen.getByTestId('chevron-icon').parentElement;
        expect(chevronContainer?.className).not.toContain('rotate-180');
    });

    it('should render special image when index is 999 and isOpen is true', () => {
        const props = { ...defaultProps, index: 999, isOpen: true };
        render(<FAQItem {...props} />);

        const specialImage = screen.getByAltText('Ignore Me IMG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(specialImage).toBeInTheDocument();
        expect(specialImage).toHaveAttribute('src', '/images/bg/ignore-me-606w.webp');
        expect(specialImage).toHaveAttribute('width', '606');
        expect(specialImage).toHaveAttribute('height', '221');
    });

    it('should not render special image when index is not 999', () => {
        const props = { ...defaultProps, index: 0, isOpen: true };
        render(<FAQItem {...props} />);

        const specialImage = screen.queryByAltText('Ignore Me IMG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(specialImage).not.toBeInTheDocument();
    });

    it('should render background image with correct attributes', () => {
        render(<FAQItem {...defaultProps} />);

        const bgImage = screen.getByAltText('Bentobox BG - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(bgImage).toBeInTheDocument();
        expect(bgImage).toHaveAttribute('src', '/images/containers/bentobox-tl-339w.avif');
    });

    it('should render description with complex HTML content', () => {
        const complexHTML = '<div><strong>Bold text</strong> and <em>italic text</em></div>';
        const props = { ...defaultProps, description: complexHTML, isOpen: true };
        render(<FAQItem {...props} />);

        const descriptionElement = screen.getByText((_content, element) => {
            return element?.innerHTML === complexHTML;
        });

        expect(descriptionElement).toBeInTheDocument();
    });
});