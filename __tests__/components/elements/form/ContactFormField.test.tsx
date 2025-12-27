import { render, screen } from '@testing-library/react';
import { FaEnvelope } from 'react-icons/fa';
import FormField from "@/components/elements/form/ContactFormField";

describe('FormField', () => {
    const defaultProps = {
        id: 'test-field',
        name: 'testField',
        label: 'Test Label',
        icon: FaEnvelope,
        onBlur: jest.fn(),
    };

    it('should render input field with label', () => {
        render(<FormField required={true} placeholder={""} {...defaultProps} />);

        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render textarea when type is textarea', () => {
        render(<FormField placeholder={""} {...defaultProps} type="textarea" />);

        const textarea = screen.getByRole('textbox');
        expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should render input when type is not textarea', () => {
        render(<FormField placeholder={""} {...defaultProps} type="email" />);

        const input = screen.getByRole('textbox');
        expect(input.tagName).toBe('INPUT');
        expect(input).toHaveAttribute('type', 'email');
    });

    it('should show optional text when required is false', () => {
        render(<FormField placeholder={""} {...defaultProps} required={false} />);

        expect(screen.getByText('(Optional)')).toBeInTheDocument();
    });

    it('should not show optional text when required is true', () => {
        render(<FormField placeholder={""} {...defaultProps} required={true} />);

        expect(screen.queryByText('(Optional)')).not.toBeInTheDocument();
    });

    it('should render help link when helpLink is provided', () => {
        render(<FormField placeholder={""} {...defaultProps} helpLink="https://example.com/help" />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', 'https://example.com/help');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should not render help link when helpLink is not provided', () => {
        render(<FormField placeholder={""} {...defaultProps} />);

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('should show error message when touched is true and error exists', () => {
        render(<FormField placeholder={""} {...defaultProps} touched={true} error="This field is required" />);

        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should not show error message when touched is false', () => {
        render(<FormField placeholder={""} {...defaultProps} touched={false} error="This field is required" />);

        expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
    });

    it('should not show error message when error is undefined', () => {
        render(<FormField placeholder={""} {...defaultProps} touched={true} />);

        expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    });

    it('should render with placeholder', () => {
        render(<FormField {...defaultProps} placeholder="Enter your email" />);

        expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    });

    it('should render textarea with custom rows', () => {
        render(<FormField placeholder={""} {...defaultProps} type="textarea" rows={10} />);

        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveAttribute('rows', '10');
    });

    it('should render textarea with default rows when rows not provided', () => {
        render(<FormField placeholder={""} {...defaultProps} type="textarea" />);

        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveAttribute('rows', '5');
    });
});