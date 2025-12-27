import { render, screen, fireEvent } from '@testing-library/react';
import {TestimonialCard} from "@/components/elements/grid/TestimonialCard";

describe('TestimonialCard', () => {
    const defaultProps = {
        userid: 'user123',
        username: 'John Doe',
        rank: 'VIP Member',
        rank_color: '#ff6b6b',
        avatar_url: 'https://example.com/avatar.jpg',
        content: 'This is a great community!',
    };

    it('should render with all provided props', () => {
        render(<TestimonialCard hoveredCard={null} {...defaultProps} />);

        expect(screen.getByAltText('John Doe Avatar - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('VIP Member')).toBeInTheDocument();
        expect(screen.getByText('"This is a great community!"')).toBeInTheDocument();
    });

    it('should display avatar image when avatar_url is valid', () => {
        render(<TestimonialCard hoveredCard={null} {...defaultProps} />);

        const avatar = screen.getByAltText('John Doe Avatar - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should display initials fallback when image fails to load', () => {
        render(<TestimonialCard hoveredCard={null} {...defaultProps} />);

        const avatar = screen.getByAltText('John Doe Avatar - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        fireEvent.error(avatar);

        expect(screen.getByText('JO')).toBeInTheDocument();
        expect(screen.queryByAltText('John Doe Avatar - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server')).not.toBeInTheDocument();
    });

    it('should extract correct initials from username', () => {
        render(<TestimonialCard hoveredCard={null} {...defaultProps} username="Alice" />);

        const avatar = screen.getByAltText('Alice Avatar - Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server');
        fireEvent.error(avatar);

        expect(screen.getByText('AL')).toBeInTheDocument();
    });

    it('should apply correct opacity when isHovered is true', () => {
        const { container } = render(<TestimonialCard hoveredCard={null} {...defaultProps} isHovered={true} />);

        const card = container.firstChild as HTMLElement;
        expect(card.className).toContain('opacity-100');
    });

    it('should apply reduced opacity when hoveredCard is not null and isHovered is false', () => {
        const { container } = render(<TestimonialCard {...defaultProps} isHovered={false} hoveredCard="other-card" />);

        const card = container.firstChild as HTMLElement;
        expect(card.className).toContain('opacity-30');
    });

    it('should apply full opacity when hoveredCard is null and isHovered is false', () => {
        const { container } = render(<TestimonialCard {...defaultProps} isHovered={false} hoveredCard={null} />);

        const card = container.firstChild as HTMLElement;
        expect(card.className).toContain('opacity-100');
    });

    it('should call onHoverChange with true on mouse enter', () => {
        const mockOnHoverChange = jest.fn();
        const { container } = render(<TestimonialCard hoveredCard={null} {...defaultProps} onHoverChange={mockOnHoverChange} />);

        const card = container.firstChild as HTMLElement;
        fireEvent.mouseEnter(card);

        expect(mockOnHoverChange).toHaveBeenCalledWith(true);
        expect(mockOnHoverChange).toHaveBeenCalledTimes(1);
    });

    it('should call onHoverChange with false on mouse leave', () => {
        const mockOnHoverChange = jest.fn();
        const { container } = render(<TestimonialCard hoveredCard={null} {...defaultProps} onHoverChange={mockOnHoverChange} />);

        const card = container.firstChild as HTMLElement;
        fireEvent.mouseLeave(card);

        expect(mockOnHoverChange).toHaveBeenCalledWith(false);
        expect(mockOnHoverChange).toHaveBeenCalledTimes(1);
    });

    it('should not throw error when onHoverChange is undefined on mouse enter', () => {
        const { container } = render(<TestimonialCard hoveredCard={null} {...defaultProps} />);

        const card = container.firstChild as HTMLElement;
        expect(() => fireEvent.mouseEnter(card)).not.toThrow();
    });

    it('should not throw error when onHoverChange is undefined on mouse leave', () => {
        const { container } = render(<TestimonialCard hoveredCard={null} {...defaultProps} />);

        const card = container.firstChild as HTMLElement;
        expect(() => fireEvent.mouseLeave(card)).not.toThrow();
    });

    it('should apply rank color to rank text', () => {
        render(<TestimonialCard hoveredCard={null} {...defaultProps} rank_color="#00ff00" />);

        const rankElement = screen.getByText('VIP Member');
        expect(rankElement).toHaveStyle({ color: '#00ff00' });
    });

    it('should display userid as title attribute', () => {
        render(<TestimonialCard hoveredCard={null} {...defaultProps} userid="user456" />);

        const titleDiv = screen.getByTitle('user456');
        expect(titleDiv).toBeInTheDocument();
    });
});