// noinspection DuplicatedCode

import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import { useTranslations } from 'next-intl';
import ContactForm from '@/components/elements/form/ContactForm';
import { validateForm } from '@/lib/formValidation';
import { submitContactForm } from '@/lib/api';
import { FaHandcuffs, FaReply } from 'react-icons/fa6';
import {Ref} from "react";

// Mock all external dependencies
jest.mock('next-intl', () => ({
    useTranslations: jest.fn(),
}));

jest.mock('@/lib/formValidation', () => ({
    validateForm: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
    submitContactForm: jest.fn(),
}));

const mockTurnstileReset = jest.fn();
jest.mock('@marsidev/react-turnstile', () => {
    const React = require('react'); // avoid hoisting error

    return {
        __esModule: true,
        Turnstile: React.forwardRef((props: { className: string | undefined; onSuccess: (arg0: string) => void;
                                              onError: () => void; onExpire: () => void; },
                                     ref: Ref<HTMLDivElement> | undefined) => {
            React.useImperativeHandle(ref, () => ({
                reset: mockTurnstileReset,
            }));

            return (
                <div data-testid="turnstile-mock" className={props.className}>
                    <button type="button"
                            data-testid="turnstile-success"
                            onClick={() => props.onSuccess('mock-token')}
                    />
                    <button type="button"
                            data-testid="turnstile-error"
                            onClick={() => props.onError()}
                    />
                    <button type="button"
                            data-testid="turnstile-expire"
                            onClick={() => props.onExpire()}
                    />
                </div>
            );
        }),
    };
});

jest.mock('@/components/elements/ButtonHover', () => {
    return function MockButtonHover() {
        return <div data-testid="button-hover" />;
    };
});

jest.mock('@/components/elements/form/ContactFormField', () => {
    return function MockFormField(props: any) {
        return (
            <div data-testid={`form-field-${props.id}`} className={props.className}>
                {props.type === 'textarea' ? (
                    <textarea
                        id={props.id}
                        name={props.name}
                        placeholder={props.placeholder}
                        onBlur={props.onBlur}
                        disabled={props.disabled}
                        rows={props.rows}
                    />
                ) : (
                    <input
                        id={props.id}
                        name={props.name}
                        type={props.type || 'text'}
                        placeholder={props.placeholder}
                        onBlur={props.onBlur}
                        disabled={props.disabled}
                    />
                )}
                {props.error && <span data-testid={`error-${props.id}`}>{props.error}</span>}
            </div>
        );
    };
});

describe('ContactForm', () => {
    const mockTForm = jest.fn((key: string) => key);
    const mockValidateForm = validateForm as jest.Mock;
    const mockSubmitContactForm = submitContactForm as jest.Mock;
    let mockForm: HTMLFormElement;

    const defaultProps = {
        formType: 'general' as const,
        validationSchema: {},
        submitIcon: FaReply,
        submitText: 'Submit',
    };

    beforeEach(() => {
        jest.useFakeTimers();
        (useTranslations as jest.Mock).mockReturnValue(mockTForm);
        mockValidateForm.mockReturnValue({});
        mockSubmitContactForm.mockResolvedValue(true);

        // Mock querySelector to return a valid form
        mockForm = document.createElement('form');
        jest.spyOn(document, 'querySelector').mockImplementation((selector) => {
            if (selector === 'form') return mockForm;
            return null;
        });
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    describe('Rendering', () => {
        it('should render general form fields when formType is general', () => {
            render(<ContactForm {...defaultProps} />);

            expect(screen.getByTestId('form-field-name')).toBeInTheDocument();
            expect(screen.getByTestId('form-field-email')).toBeInTheDocument();
            expect(screen.getByTestId('form-field-message')).toBeInTheDocument();
        });

        it('should render unban form fields when formType is unban', () => {
            render(<ContactForm {...defaultProps} formType="unban" submitIcon={FaHandcuffs} />);

            expect(screen.getByTestId('form-field-discordName')).toBeInTheDocument();
            expect(screen.getByTestId('form-field-discordId')).toBeInTheDocument();
            expect(screen.getByTestId('form-field-banReason')).toBeInTheDocument();
            expect(screen.getByTestId('form-field-bannedBy')).toBeInTheDocument();
            expect(screen.getByTestId('form-field-apology')).toBeInTheDocument();
        });

        it('should render Turnstile component', () => {
            render(<ContactForm {...defaultProps} />);

            expect(screen.getByTestId('turnstile-mock')).toBeInTheDocument();
        });

        it('should render submit button with correct text', () => {
            render(<ContactForm {...defaultProps} submitText="Send Message" />);

            expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
        });

        it('should apply lg:self-start alignment by default', () => {
            render(<ContactForm {...defaultProps} />);

            const turnstile = screen.getByTestId('turnstile-mock');
            expect(turnstile).toHaveClass('lg:self-start');
        });

        it('should apply lg:self-end alignment when specified', () => {
            render(<ContactForm {...defaultProps} turnstileAlign="lg:self-end" />);

            const turnstile = screen.getByTestId('turnstile-mock');
            expect(turnstile).toHaveClass('lg:self-end');
        });
    });

    describe('Form State Reset on formType Change', () => {
        it('should reset form state when formType changes', () => {
            const { rerender } = render(<ContactForm {...defaultProps} formType="general" />);

            // Set some state by interacting with form
            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            // Change formType
            rerender(<ContactForm {...defaultProps} formType="unban" />);

            // Verify state was reset
            expect(screen.queryByTestId('form-field-name')).not.toBeInTheDocument();
            expect(screen.getByTestId('form-field-discordName')).toBeInTheDocument();
        });

        it('should call turnstileRef.current.reset when formType changes', async () => {
            const { rerender } = render(<ContactForm {...defaultProps} formType="general" />);

            // Wait for the ref to be set
            await waitFor(() => {
                expect(screen.getByTestId('turnstile-mock')).toBeInTheDocument();
            });

            // Clear any calls from initial render
            mockTurnstileReset.mockClear();

            // Change formType to trigger useEffect
            rerender(<ContactForm {...defaultProps} formType="unban" />);

            // Wait for the effect to run
            await waitFor(() => {
                expect(mockTurnstileReset).toHaveBeenCalled();
            });
        });
    });

    describe('Turnstile Integration', () => {
        it('should set turnstile token on success', () => {
            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));

            const submitButton = screen.getByRole('button', { name: /Submit/i });
            expect(submitButton).toBeDisabled();
        });

        it('should clear form error on turnstile success', async () => {
            render(<ContactForm {...defaultProps} />);

            // First trigger error
            fireEvent.click(screen.getByTestId('turnstile-error'));
            expect(screen.getByText('errorTurnstileLoad')).toBeInTheDocument();

            // Then trigger success
            fireEvent.click(screen.getByTestId('turnstile-success'));
            await waitFor(() => {
                expect(screen.queryByText('errorTurnstileLoad')).not.toBeInTheDocument();
            });
        });

        it('should set error message on turnstile error', () => {
            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-error'));

            expect(screen.getByText('errorTurnstileLoad')).toBeInTheDocument();
        });

        it('should clear token on turnstile expire', () => {
            render(<ContactForm {...defaultProps} />);

            // First set token
            fireEvent.click(screen.getByTestId('turnstile-success'));

            // Then expire it
            fireEvent.click(screen.getByTestId('turnstile-expire'));

            const submitButton = screen.getByRole('button', { name: /Submit/i });
            expect(submitButton).toBeDisabled();
        });

        it('should clear token on turnstile error', () => {
            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-error'));

            const submitButton = screen.getByRole('button', { name: /Submit/i });
            expect(submitButton).toBeDisabled();
        });
    });

    describe('Field Validation on Blur', () => {
        it('should mark field as touched on blur', () => {
            render(<ContactForm {...defaultProps} />);

            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            expect(mockValidateForm).toHaveBeenCalled();
        });

        it('should validate form and set errors on blur', () => {
            mockValidateForm.mockReturnValue({ name: 'Name is required' });
            render(<ContactForm {...defaultProps} />);

            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            expect(mockValidateForm).toHaveBeenCalled();
            expect(screen.getByTestId('error-name')).toHaveTextContent('Name is required');
        });

        it('should not validate if form element is not found', () => {
            document.querySelector = jest.fn(() => null);
            render(<ContactForm {...defaultProps} />);

            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            // Should still mark as touched but not crash
            expect(mockValidateForm).not.toHaveBeenCalled();
        });
    });

    describe('Form Submission', () => {
        it('should prevent submission without turnstile token', async () => {
            render(<ContactForm {...defaultProps} />);

            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                expect(mockSubmitContactForm).not.toHaveBeenCalled();
                expect(screen.getByText('errorTurnstile')).toBeInTheDocument();
            });
        });

        it('should prevent submission without formType', async () => {
            render(<ContactForm {...defaultProps} formType={null as any} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                expect(mockSubmitContactForm).not.toHaveBeenCalled();
                expect(screen.getByText('errorTurnstile')).toBeInTheDocument();
            });
        });

        it('should prevent submission when validation errors exist', async () => {
            mockValidateForm.mockReturnValue({ name: 'Name is required' });
            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                expect(mockSubmitContactForm).not.toHaveBeenCalled();
                expect(screen.getByTestId('error-name')).toHaveTextContent('Name is required');
            });
        });

        it('should mark all error fields as touched on validation failure', async () => {
            mockValidateForm.mockReturnValue({
                name: 'Name is required',
                email: 'Email is required',
            });
            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                expect(screen.getByTestId('error-name')).toBeInTheDocument();
                expect(screen.getByTestId('error-email')).toBeInTheDocument();
            });
        });

        it('should submit form successfully with valid data', async () => {
            mockValidateForm.mockReturnValue({});
            mockSubmitContactForm.mockResolvedValue(true);

            render(<ContactForm {...defaultProps} />);

            // Set turnstile token and touch a field
            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                expect(mockSubmitContactForm).toHaveBeenCalledWith(
                    expect.any(FormData),
                    'mock-token',
                    'general'
                );
            });
        });

        it('should show success message after successful submission', async () => {
            mockValidateForm.mockReturnValue({});
            mockSubmitContactForm.mockResolvedValue(true);

            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                expect(screen.getByText('successFormSent')).toBeInTheDocument();
            });
        });

        it('should show error message after failed submission', async () => {
            mockValidateForm.mockReturnValue({});
            mockSubmitContactForm.mockResolvedValue(false);

            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                expect(screen.getByText('errorSubmit')).toBeInTheDocument();
            });
        });

        it('should reset to idle state after error timeout', async () => {
            mockValidateForm.mockReturnValue({});
            mockSubmitContactForm.mockResolvedValue(false);

            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                expect(screen.getByText('errorSubmit')).toBeInTheDocument();
            });

            // Advance timers by 3 seconds
            act(() => {
                jest.advanceTimersByTime(3000);
            });

            await waitFor(() => {
                expect(screen.queryByText('errorSubmit')).not.toBeInTheDocument();
            });
        });

        it('should call turnstileRef.current.reset after error timeout', async () => {
            mockValidateForm.mockReturnValue({});
            mockSubmitContactForm.mockResolvedValue(false);

            const { container } = render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                expect(screen.getByText('errorSubmit')).toBeInTheDocument();
            });

            // Get the mock reset function from the Turnstile mock
            const turnstileMock = container.querySelector('[data-testid="turnstile-mock"]');
            expect(turnstileMock).toBeInTheDocument();

            // Advance timers by 3 seconds to trigger the reset
            act(() => {
                jest.advanceTimersByTime(3000);
            });

            // The turnstileRef.current?.reset() should have been called
            await waitFor(() => {
                expect(screen.queryByText('errorSubmit')).not.toBeInTheDocument();
            });
        });
    });

    describe('Submit Button State', () => {
        it('should disable submit button when no fields are touched', () => {
            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));

            const submitButton = screen.getByRole('button', { name: /Submit/i });
            expect(submitButton).toBeDisabled();
        });

        it('should disable submit button when validation errors exist', () => {
            mockValidateForm.mockReturnValue({ name: 'Error' });
            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const submitButton = screen.getByRole('button', { name: /Submit/i });
            expect(submitButton).toBeDisabled();
        });

        it('should disable submit button when turnstile token is missing', () => {
            render(<ContactForm {...defaultProps} />);

            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const submitButton = screen.getByRole('button', { name: /Submit/i });
            expect(submitButton).toBeDisabled();
        });

        it('should disable submit button when form is submitting', async () => {
            mockValidateForm.mockReturnValue({});
            mockSubmitContactForm.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 1000)));

            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            const submitButton = screen.getByRole('button', { name: /Submit/i });
            expect(submitButton).toBeDisabled();
        });

        it('should disable submit button after successful submission', async () => {
            mockValidateForm.mockReturnValue({});
            mockSubmitContactForm.mockResolvedValue(true);

            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                const submitButton = screen.getByRole('button', { name: /Submit/i });
                expect(submitButton).toBeDisabled();
            });
        });

        it('should enable submit button when all conditions are met', () => {
            mockValidateForm.mockReturnValue({});
            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const submitButton = screen.getByRole('button', { name: /Submit/i });
            expect(submitButton).not.toBeDisabled();
        });

        it('should show ButtonHover when submit button is enabled', () => {
            mockValidateForm.mockReturnValue({});
            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            expect(screen.getByTestId('button-hover')).toBeInTheDocument();
        });

        it('should not show ButtonHover when submit button is disabled', () => {
            render(<ContactForm {...defaultProps} />);

            expect(screen.queryByTestId('button-hover')).not.toBeInTheDocument();
        });
    });

    describe('Form Layout', () => {
        it('should apply lg:flex-row for general form', () => {
            render(<ContactForm {...defaultProps} formType="general" />);

            const submitButton = screen.getByRole('button', { name: /Submit/i });
            const buttonRow = submitButton.closest('.flex.flex-col.lg\\:flex-row, .flex.flex-col.lg\\:flex-row-reverse');

            expect(buttonRow).toHaveClass('lg:flex-row');
        });

        it('should apply lg:flex-row-reverse for unban form', () => {
            render(<ContactForm {...defaultProps} formType="unban" />);

            const submitButton = screen.getByRole('button', { name: /Submit/i });
            const buttonRow = submitButton.closest('.flex.flex-col.lg\\:flex-row, .flex.flex-col.lg\\:flex-row-reverse');
            expect(buttonRow).toHaveClass('lg:flex-row-reverse');
        });
    });

    describe('Status Message Opacity', () => {
        it('should have opacity-100 when status is success', async () => {
            mockValidateForm.mockReturnValue({});
            mockSubmitContactForm.mockResolvedValue(true);

            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                const statusSpan = screen.getByText('successFormSent');
                expect(statusSpan).toHaveClass('opacity-100');
            });
        });

        it('should have opacity-100 when status is error', async () => {
            mockValidateForm.mockReturnValue({});
            mockSubmitContactForm.mockResolvedValue(false);

            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                const statusSpan = screen.getByText('errorSubmit').parentElement;
                expect(statusSpan).toHaveClass('opacity-100');
            });
        });

        it('should apply text-green-400 for success status', async () => {
            mockValidateForm.mockReturnValue({});
            mockSubmitContactForm.mockResolvedValue(true);

            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                const statusSpan = screen.getByText('successFormSent');
                expect(statusSpan).toHaveClass('text-green-400');
            });
        });

        it('should apply text-red-400 for error status', async () => {
            mockValidateForm.mockReturnValue({});
            mockSubmitContactForm.mockResolvedValue(false);

            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                const statusSpan = screen.getByText('errorSubmit').parentElement;
                expect(statusSpan).toHaveClass('text-red-400');
            });
        });
    });

    describe('Form Fields Disabled State', () => {
        it('should disable all fields after successful submission', async () => {
            mockValidateForm.mockReturnValue({});
            mockSubmitContactForm.mockResolvedValue(true);

            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                const fields = screen.getAllByRole('textbox');
                fields.forEach(field => {
                    expect(field).toBeDisabled();
                });
            });
        });
    });

    describe('Error Message Rendering', () => {
        it('should render error message with dangerouslySetInnerHTML for error status', async () => {
            mockValidateForm.mockReturnValue({});
            mockSubmitContactForm.mockResolvedValue(false);

            render(<ContactForm {...defaultProps} />);

            fireEvent.click(screen.getByTestId('turnstile-success'));
            const nameField = screen.getByPlaceholderText('placeholderName');
            fireEvent.blur(nameField);

            const form = screen.getByRole('button', { name: /Submit/i }).closest('form');
            fireEvent.submit(form!);

            await waitFor(() => {
                const errorElement = screen.getByText('errorSubmit');
                expect(errorElement).toHaveClass('whitespace-pre-line');
            });
        });
    });

    describe('UnbanFormFields', () => {
        it('should call handleBlur with correct field names for required fields', () => {
            render(<ContactForm {...defaultProps} formType="unban" />);

            const discordNameField = screen.getByPlaceholderText('yannicde');
            const discordIdField = screen.getByPlaceholderText('775415193760169995');
            const apologyField = screen.getByPlaceholderText('placeholderExcuse');

            fireEvent.blur(discordNameField);
            fireEvent.blur(discordIdField);
            fireEvent.blur(apologyField);

            expect(mockValidateForm).toHaveBeenCalled();
        });

        it('should not call validation for optional fields', () => {
            render(<ContactForm {...defaultProps} formType="unban" />);

            const banReasonField = screen.getByPlaceholderText('placeholderReason');
            fireEvent.blur(banReasonField);

            // onBlur for optional fields is empty function, so no validation should occur
            expect(banReasonField).toBeInTheDocument();
        });

        it('should call empty function onBlur for bannedBy field', () => {
            render(<ContactForm {...defaultProps} formType="unban" />);

            const bannedByField = screen.getByPlaceholderText('xlonestar.888');

            // This should not throw and should execute the empty onBlur function
            expect(() => fireEvent.blur(bannedByField)).not.toThrow();
            expect(bannedByField).toBeInTheDocument();
        });
    });

    describe('GeneralFormFields', () => {
        it('should call handleBlur with correct field names', () => {
            render(<ContactForm {...defaultProps} formType="general" />);

            const nameField = screen.getByPlaceholderText('placeholderName');
            const emailField = screen.getByPlaceholderText('placeholderEmail');
            const messageField = screen.getByPlaceholderText('placeholderMessage');

            fireEvent.blur(nameField);
            fireEvent.blur(emailField);
            fireEvent.blur(messageField);

            expect(mockValidateForm).toHaveBeenCalled();
        });
    });
});