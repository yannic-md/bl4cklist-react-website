import { render, screen } from '@testing-library/react';
import FeatureItem from "@/components/elements/grid/FeatureItem";

// Mock Next.js Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({fill, unoptimized, priority, src, alt, ...rest}: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return ( <img src={src} alt={alt || ""}{...rest} /> );
    },
}));

describe('FeatureItem', () => {
    const defaultProps = {
        iconSrc: '/icon.svg',
        title: 'Test Feature',
        description: 'Test Description',
        altText: 'Test Icon',
    };

    it('should render with title, description and icon', () => {
        render(<FeatureItem {...defaultProps} />);

        expect(screen.getByText('Test Feature')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByAltText('Test Icon')).toBeInTheDocument();
    });

    it('should render title as link when link prop is provided', () => {
        render(<FeatureItem {...defaultProps} link="https://example.com" />);

        const linkElement = screen.getByRole('link', { name: 'Test Feature' });
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', 'https://example.com');
    });

    it('should render title as plain text when link prop is not provided', () => {
        render(<FeatureItem {...defaultProps} />);

        const titleElement = screen.getByText('Test Feature');
        expect(titleElement.tagName).not.toBe('A');
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('should render icon with correct props', () => {
        render(<FeatureItem {...defaultProps} />);

        const icon = screen.getByAltText('Test Icon');
        expect(icon).toHaveAttribute('src', '/icon.svg');
        expect(icon).toHaveAttribute('width', '40');
        expect(icon).toHaveAttribute('height', '40');
    });
});