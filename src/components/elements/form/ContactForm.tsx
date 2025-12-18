import {FormEvent, JSX, RefObject, useEffect, useRef, useState} from "react";
import {Turnstile} from "@marsidev/react-turnstile";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useTranslations} from "next-intl";
import {validateForm, ValidationErrors, ValidationSchema} from "@/lib/formValidation";
import ButtonHover from "@/components/elements/ButtonHover";
import buttons from "@/styles/util/buttons.module.css";
import {
    faEnvelope,
    faGavel,
    faHandcuffs,
    faHeart,
    faIdCard, faMessage,
    faReply,
    faUser,
    faUserShield
} from "@fortawesome/free-solid-svg-icons";
import {FormType} from "@/pages/contact";
import FormField from "@/components/elements/form/ContactFormField";
import {submitContactForm} from "@/lib/api";

interface GeneralFormFieldsProps {
    tForm: (key: string) => string;
    validationErrors: ValidationErrors;
    touchedFields: TouchedFields;
    handleBlur: (fieldName: string) => void;
    disabled: boolean;
}

interface UnbanFormFieldsProps {
    tForm: (key: string) => string;
    validationErrors: ValidationErrors;
    touchedFields: TouchedFields;
    handleBlur: (fieldName: string) => void;
    disabled: boolean;
}

interface ContactFormProps {
    formType: FormType;
    validationSchema: ValidationSchema;
    submitIcon: typeof faHandcuffs | typeof faReply;
    submitText: string;
    turnstileAlign?: 'lg:self-start' | 'lg:self-end';
}

interface TouchedFields {
    [key: string]: boolean;
}

/**
 * Generic reusable contact form component with validation and Turnstile support.
 * Handles form submission, field validation, and error display.
 *
 * @param {ContactFormProps} props - Form configuration including type, schema, and styling
 * @param {FormType} props.formType - Type of the form to render (`unban` or `general`)
 * @param {ValidationSchema} props.validationSchema - Validation rules applied to the form fields
 * @param {typeof faHandcuffs | typeof faReply} props.submitIcon - Icon displayed inside the submit button
 * @param {string} props.submitText - Text label displayed on the submit button
 * @param {'start' | 'end'} [props.turnstileAlign='lg:self-start'] - Horizontal alignment of the Turnstile widget on large screens
 * @returns {JSX.Element} Complete form with validation and submit logic
 */
export default function ContactForm({formType, validationSchema, submitIcon, submitText,
                                     turnstileAlign = 'lg:self-start'}: ContactFormProps): JSX.Element {
    const tForm = useTranslations("Form");
    const turnstileRef: RefObject<any> = useRef<any>(null);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [touchedFields, setTouchedFields] = useState<TouchedFields>({});

    /**
     * Resets the form state when the form type changes.
     *
     * Clears validation errors, touched fields, submit status, and resets the Turnstile widget
     * to ensure a clean slate when switching between unban and general contact forms.
     */
    useEffect((): void => {
        setValidationErrors({});
        setTouchedFields({});
        setSubmitStatus('idle');
        setIsSubmitting(false);
        setFormError(null);
        setTurnstileToken(null);
        turnstileRef.current?.reset();
    }, [formType]);

    /**
     * Handles blur events for individual form fields.
     *
     * Marks the given field as "touched" and immediately revalidates the entire form using the provided validation
     * schema. The updated validation errors are stored in local state so that the UI can render error messages next
     * to the corresponding fields.
     *
     * @param fieldName Name of the form field that lost focus.
     */
    const handleBlur: (fieldName: string) => void = (fieldName: string): void => {
        setTouchedFields((prev: TouchedFields) => ({ ...prev, [fieldName]: true }));

        const form: HTMLFormElement | null = document.querySelector('form');
        if (form) {
            const formData = new FormData(form);
            const errors: ValidationErrors = validateForm(formData, validationSchema);
            setValidationErrors(errors);
        }
    };

    /**
     * Checks whether the form can be submitted.
     *
     * The form is considered valid when no validation errors are present
     * and a non-null Turnstile token has been obtained.
     *
     * @returns {boolean} - true if form is valid, else false.
     */
    const isFormValid: () => boolean = (): boolean => {
        return Object.keys(validationErrors).length === 0 && turnstileToken !== null;
    };

    /**
     * Handles contact form submission by validating input, enforcing Turnstile verification,
     * sending the data to the backend, and resetting form and Turnstile state based on the result.
     * It prevents the default submit behavior, marks invalid fields, displays backend error messages,
     * and ensures the Turnstile token is cleared and widget reset after each submission attempt.
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!turnstileToken || !formType) { return setFormError(tForm('errorTurnstile')); }

        const formData = new FormData(e.currentTarget);
        const errors: ValidationErrors = validateForm(formData, validationSchema);

        // check if any validation errors exist and (if yes) marks all corresponding fields as touched & stops submission.
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setTouchedFields( Object.keys(errors).reduce((acc: {}, key: string): {} => ({ ...acc, [key]: true }), {}) );
            return;
        }

        setIsSubmitting(true);
        const success: boolean = await submitContactForm(formData, turnstileToken, formType);

        if (success) {
            setSubmitStatus('success');
            setIsSubmitting(false);
        } else {
            setSubmitStatus('error');
            setTimeout((): void => {
                setSubmitStatus('idle');
                setIsSubmitting(false);

                // reset recaptcha
                turnstileRef.current?.reset();
                setTurnstileToken(null);
            }, 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
            {formType === 'unban' ? <UnbanFormFields   tForm={tForm} validationErrors={validationErrors}
                                                       disabled={submitStatus === 'success'}
                                                       touchedFields={touchedFields} handleBlur={handleBlur} />
                                  : <GeneralFormFields tForm={tForm} validationErrors={validationErrors}
                                                       disabled={submitStatus === 'success'}
                                                       touchedFields={touchedFields} handleBlur={handleBlur} />}

            {/* Cloudflare Captcha to avoid Spam */}
            <div className="flex flex-col gap-2">
                <Turnstile ref={turnstileRef} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                           onSuccess={(token: string): void => { setTurnstileToken(token); setFormError(null); }}
                           onError={(): void => { setTurnstileToken(null); setFormError(tForm('errorTurnstileLoad')); }}
                           onExpire={(): void => { setTurnstileToken(null); }}
                           className={`self-center ${turnstileAlign}`} />
                {formError && (
                    <span className={`text-xs text-red-400 self-center ${turnstileAlign}`}>
                        {formError}
                    </span>
                )}
            </div>

            {/* Button Row */}
            <div className={`flex flex-col ${formType === 'unban' ? 'lg:flex-row-reverse' : 'lg:flex-row'} mt-2 gap-6`}>
                {/* Success / error message based on backend result */}
                <span className={`text-sm font-medium w-full self-center transition-opacity duration-200 
                                  ${submitStatus === 'idle' ? 'opacity-0' : 'opacity-100'}
                                  ${submitStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {submitStatus === 'success' && tForm('successFormSent')}
                    {submitStatus === 'error' && (
                        <span className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: tForm('errorSubmit') }}/>
                    )}
                </span>

                {/* Submit button */}
                <div className="flex flex-col items-end relative group z-[20] drop-shadow-xl drop-shadow-white/5">
                    <button type="submit" disabled={!isFormValid() || submitStatus === 'success' || isSubmitting}
                            className={`relative w-full lg:w-fit ${buttons.white_gray} disabled:opacity-50
                                        disabled:!cursor-not-allowed transition-all duration-200`}>
                        <FontAwesomeIcon icon={submitIcon} className="text-gray-100" />
                        <p className="whitespace-pre">{submitText}</p>
                    </button>

                    {isFormValid() || submitStatus != 'success' || !isSubmitting && <ButtonHover />}
                </div>
            </div>
        </form>
    );
}

/**
 * Renders the field set for the unban request form, including Discord identity,
 * optional ban details and a required apology textarea. It wires validation
 * errors and touched state to each `FormField` and applies the disabled state
 * when the form has been submitted.
 *
 * @param {UnbanFormFieldsProps} props Props containing translations, validation state and handlers.
 * @param {(key: string) => string} props.tForm Translation function for localized form texts.
 * @param {ValidationErrors} props.validationErrors Current validation errors mapped by field name.
 * @param {TouchedFields} props.touchedFields Map of fields that have been interacted with.
 * @param {(fieldName: string) => void} props.handleBlur Blur handler to trigger validation for a field.
 * @param {boolean} props.disabled If the form field should be disabled.
 * @returns {JSX.Element} Rendered JSX fragment containing all unban form fields.
 */
function UnbanFormFields({ tForm, validationErrors, touchedFields, handleBlur, disabled }: UnbanFormFieldsProps): JSX.Element {
    return (
        <>
            {/* Discord-Name & User-ID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField id="discordName" name="discordName" label={tForm('textDiscordName')} required
                           icon={faUser} placeholder="yannicde" touched={touchedFields.discordName} disabled={disabled}
                           error={validationErrors.discordName} onBlur={(): void => handleBlur('discordName')} />
                <FormField id="discordId" name="discordId" label={tForm('textDiscordID')} disabled={disabled}
                           icon={faIdCard} required placeholder="775415193760169995" touched={touchedFields.discordId}
                           error={validationErrors.discordId} onBlur={(): void => handleBlur('discordId')}
                           helpLink="https://support.discord.com/hc/articles/206346498#h_01HRSTXPS5H5D7JBY2QKKPVKNA" />
            </div>

            {/* Optional fields: Reason & Punished by */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField id="banReason" name="banReason" label={tForm('textReason')} icon={faGavel}
                           placeholder={tForm('placeholderReason')} onBlur={(): void => {}} disabled={disabled} />
                <FormField id="bannedBy" name="bannedBy" label={tForm('textPunishedBy')} placeholder="xlonestar.888"
                           icon={faUserShield} onBlur={(): void => {}} disabled={disabled} />
            </div>

            {/* Apology field */}
            <FormField id="apology" name="apology" label={tForm('textExcuse')} type="textarea" required
                       icon={faHeart} disabled={disabled} placeholder={tForm('placeholderExcuse')}
                       touched={touchedFields.apology} error={validationErrors.apology}
                       onBlur={(): void => handleBlur('apology')} rows={5}
            />
        </>
    );
}

/**
 * Renders the general contact form fields, including name, email and message.
 * It wires localization, validation errors, touched state and disabled state
 * into the underlying `FormField` components.
 *
 * @param {GeneralFormFieldsProps} props Component props used to configure labels, validation and state handling.
 * @param {function} props.tForm Translation function used to resolve localized form labels and placeholders by key.
 * @param {ValidationErrors} props.validationErrors Map of validation error messages keyed by the corresponding field name.
 * @param {TouchedFields} props.touchedFields Map of field names to a boolean indicating whether the field was interacted with.
 * @param {function} props.handleBlur Handler that is called when a field loses focus and triggers validation for that field.
 * @param {boolean} props.disabled If the form field should be disabled.
 * @returns {JSX.Element} A JSX fragment containing all fields of the general contact form.
 */
function GeneralFormFields({ tForm, validationErrors, touchedFields, handleBlur, disabled }: GeneralFormFieldsProps): JSX.Element {
    return (
        <>
            {/* Your Name & E-Mail Adress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField id="name" name="name" label={tForm('textName')} placeholder={tForm('placeholderName')}
                           icon={faUser} required disabled={disabled} touched={touchedFields.name}
                           error={validationErrors.name} onBlur={(): void => handleBlur('name')} />
                <FormField id="email" name="email" label={tForm('textEmail')} type="email" placeholder={tForm('placeholderEmail')}
                           icon={faEnvelope} required disabled={disabled} touched={touchedFields.email}
                           error={validationErrors.email} onBlur={(): void => handleBlur('email')} />
            </div>

            {/* Message */}
            <FormField id="message" name="message" label={tForm('textMessage')} type="textarea" required  rows={5}
                       icon={faMessage} disabled={disabled} placeholder={tForm('placeholderMessage')}
                       touched={touchedFields.message} error={validationErrors.message}
                       onBlur={(): void => handleBlur('message')} />
        </>
    );
}
