import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import {useMediaQuery} from "@/hooks/useMediaQuery";
import {createValidationSchemas} from "@/lib/formValidation";
import ContactFormSection from "@/components/sections/imprint/ContactFormSection";

// Mock all dependencies
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('@/hooks/useMediaQuery', () => ({
    useMediaQuery: jest.fn(),
}));

jest.mock('@/lib/formValidation', () => ({
    createValidationSchemas: jest.fn(),
}));

jest.mock('@/components/animations/AnimateOnView', () => {
    const MockAnimate = ({ children, className }: any) => (
        <div data-testid="animate-on-view" className={className}>
            {children}
        </div>
    );
    return {__esModule: true, AnimateOnView: MockAnimate};
});

jest.mock('@/components/animations/TextReveal', () => ({
    __esModule: true,
    AnimatedTextReveal: ({ text, className }: any) => <div className={className}>{text}</div>,
}));

jest.mock('@/components/elements/form/ContactForm', () => ({
    __esModule: true,
    default: ({ formType, submitText }: { formType: string; submitText: string }) => (
        <div data-testid="contact-form">
            <span data-testid="form-type">{formType}</span>
            <span data-testid="submit-text">{submitText}</span>
        </div>
    ),
}));

describe('ContactFormSection', () => {
    const mockTMisc = jest.fn();
    const mockTForm = jest.fn();
    const mockTContactForm = jest.fn();
    const mockValidationSchemas = {
        unban: { schema: 'unban' },
        general: { schema: 'general' },
    };

    beforeEach(() => {
        // Setup translation mocks
        (useTranslations as jest.Mock).mockImplementation((namespace: string) => {
            if (namespace === 'Misc') return mockTMisc;
            if (namespace === 'Form') return mockTForm;
            if (namespace === 'ContactForm') return mockTContactForm;
            return jest.fn();
        });

        // Default translation returns
        mockTMisc.mockImplementation((key: string) => `misc.${key}`);
        mockTForm.mockImplementation((key: string) => `form.${key}`);
        mockTContactForm.mockImplementation((key: string) => `contactForm.${key}`);

        // Default media query mock
        (useMediaQuery as jest.Mock).mockReturnValue(false);

        // Default validation schemas mock
        (createValidationSchemas as jest.Mock).mockReturnValue(mockValidationSchemas);
    });

    describe('when no form is selected', () => {
        it('should render the placeholder section', () => {
            render(<ContactFormSection selectedForm={null} />);

            expect(screen.getByText('contactForm.infoTagEmpty')).toBeInTheDocument();
            expect(screen.getByText(/contactForm.titleEmpty/)).toBeInTheDocument();
            expect(screen.getByText(/contactForm.descriptionEmpty/)).toBeInTheDocument();
            expect(screen.getByText(/contactForm.descriptionEmpty2/)).toBeInTheDocument();
        });

        it('should render question mark emoji in placeholder', () => {
            render(<ContactFormSection selectedForm={null} />);

            expect(screen.getByText('❓')).toBeInTheDocument();
        });

        it('should not render ContactForm component', () => {
            render(<ContactFormSection selectedForm={null} />);

            expect(screen.queryByTestId('contact-form')).not.toBeInTheDocument();
        });
    });

    describe('when unban form is selected', () => {
        it('should render unban form with correct content', () => {
            render(<ContactFormSection selectedForm="unban" />);

            expect(screen.getByText('contactForm.infoTagUnban')).toBeInTheDocument();
            expect(screen.getByText(/contactForm.titleUnban/)).toBeInTheDocument();
            expect(screen.getByText(/contactForm.descriptionUnban/)).toBeInTheDocument();
            expect(screen.getByText(/contactForm.descriptionUnban2/)).toBeInTheDocument();
        });

        it('should render unlock emoji for unban form', () => {
            render(<ContactFormSection selectedForm="unban" />);

            expect(screen.getByText('🔓')).toBeInTheDocument();
        });

        it('should pass correct props to ContactForm for unban', () => {
            render(<ContactFormSection selectedForm="unban" />);

            expect(screen.getByTestId('form-type')).toHaveTextContent('unban');
            expect(screen.getByTestId('submit-text')).toHaveTextContent('form.buttonUnban');
        });

        it('should apply correct order classes for unban form', () => {
            const { container } = render(<ContactFormSection selectedForm="unban" />);

            const formContainer = container.querySelector('.xl\\:order-1');
            const infoContainer = container.querySelector('.xl\\:order-2');

            expect(formContainer).toBeInTheDocument();
            expect(infoContainer).toBeInTheDocument();
        });
    });

    describe('when general form is selected', () => {
        it('should render general form with correct content', () => {
            render(<ContactFormSection selectedForm="general" />);

            expect(screen.getByText('contactForm.infoTagGeneral')).toBeInTheDocument();
            expect(screen.getByText(/contactForm.titleGeneral/)).toBeInTheDocument();
            expect(screen.getByText(/contactForm.descriptionGeneral/)).toBeInTheDocument();
            expect(screen.getByText(/contactForm.descriptionGeneral2/)).toBeInTheDocument();
        });

        it('should render envelope emoji for general form', () => {
            render(<ContactFormSection selectedForm="general" />);

            expect(screen.getByText('💌')).toBeInTheDocument();
        });

        it('should pass correct props to ContactForm for general', () => {
            render(<ContactFormSection selectedForm="general" />);

            expect(screen.getByTestId('form-type')).toHaveTextContent('general');
            expect(screen.getByTestId('submit-text')).toHaveTextContent('misc.send');
        });

        it('should apply correct order classes for general form', () => {
            const { container } = render(<ContactFormSection selectedForm="general" />);

            const formContainer = container.querySelector('.xl\\:order-2');
            const infoContainer = container.querySelector('.xl\\:order-1');

            expect(formContainer).toBeInTheDocument();
            expect(infoContainer).toBeInTheDocument();
        });
    });

    describe('media query behavior', () => {
        it('should apply head_border class when is2XL is true', () => {
            (useMediaQuery as jest.Mock).mockReturnValue(true);
            const { container } = render(<ContactFormSection selectedForm="unban" />);

            // Check if the h2 element contains the expected pattern for 2XL
            const h2Element = container.querySelector('h2');
            expect(h2Element?.className).toContain('max-w-[30ch]');
        });

        it('should apply head_border_center class when is2XL is false', () => {
            (useMediaQuery as jest.Mock).mockReturnValue(false);
            const { container } = render(<ContactFormSection selectedForm="general" />);

            // Check if the h2 element contains the expected pattern for non-2XL
            const h2Element = container.querySelector('h2');
            expect(h2Element?.className).toContain('max-w-[30ch]');
        });
    });

    describe('validation schemas', () => {
        it('should call createValidationSchemas with tForm', () => {
            render(<ContactFormSection selectedForm="unban" />);

            expect(createValidationSchemas).toHaveBeenCalledWith(mockTForm);
        });

        it('should use correct validation schema for each form type', () => {
            const { rerender } = render(<ContactFormSection selectedForm="unban" />);
            expect(screen.getByTestId('contact-form')).toBeInTheDocument();

            rerender(<ContactFormSection selectedForm="general" />);
            expect(screen.getByTestId('contact-form')).toBeInTheDocument();
        });
    });

    describe('section structure', () => {
        it('should render section with correct id for placeholder', () => {
            const { container } = render(<ContactFormSection selectedForm={null} />);

            const section = container.querySelector('#really-cool-thing');
            expect(section).toBeInTheDocument();
        });

        it('should render section with correct id for form', () => {
            const { container } = render(<ContactFormSection selectedForm="unban" />);

            const section = container.querySelector('#really-cool-thing');
            expect(section).toBeInTheDocument();
        });

        it('should render bottom border element', () => {
            const { container } = render(<ContactFormSection selectedForm="general" />);

            const border = container.querySelector('.absolute.bottom-0.left-0.right-0');
            expect(border).toBeInTheDocument();
        });
    });
});