export interface ValidationErrors {
    [key: string]: string;
}

export interface ValidationRule {
    required?: boolean;
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: string) => boolean;
    message: string;
}

export interface ValidationSchema {
    [fieldName: string]: ValidationRule[];
}

/**
 * Validates a field value against a list of validation rules.
 * The rules are evaluated in order, and the first failing rule
 * determines the returned error message. If all rules pass, no
 * error is returned.
 *
 * @param value The field value to validate.
 * @param rules The list of validation rules to apply to the value.
 * @returns The first validation error message, or `null` if the value is valid.
 */
export function validateField(value: string, rules: ValidationRule[]): string | null {
    for (const rule of rules) {
        const trimmedValue: string = value?.trim() || '';

        if (rule.required && !trimmedValue) {
            return rule.message;
        }

        if (trimmedValue && rule.pattern && !rule.pattern.test(trimmedValue)) {
            return rule.message;
        }

        if (trimmedValue && rule.minLength && trimmedValue.length < rule.minLength) {
            return rule.message;
        }

        if (trimmedValue && rule.maxLength && trimmedValue.length > rule.maxLength) {
            return rule.message;
        }

        if (trimmedValue && rule.custom && !rule.custom(trimmedValue)) {
            return rule.message;
        }
    }

    return null;
}

/**
 * Validates the given `FormData` against a provided validation schema.
 * Each field defined in the schema is validated using `validateField`, and
 * only the first error per field is recorded. Fields without errors are
 * omitted from the returned error object.
 *
 * @param formData The `FormData` instance containing the values to validate.
 * @param schema The `ValidationSchema` describing the validation rules per field.
 * @returns {ValidationErrors} A object mapping field names to their first error message, or an empty object if all fields are valid.
 */
export function validateForm(formData: FormData, schema: ValidationSchema): ValidationErrors {
    const errors: ValidationErrors = {};

    for (const [fieldName, rules] of Object.entries(schema)) {
        const value = formData.get(fieldName) as string;
        const error: string | null = validateField(value, rules);

        if (error) {
            errors[fieldName] = error;
        }
    }

    return errors;
}

/**
 * Creates and returns the validation schemas for the available contact forms.
 * Each schema defines the validation rules for its respective fields, including
 * requirements such as presence, patterns and basic format checks.
 *
 * @param {(key: string) => string} tForm A translation function that maps a translation key to its localized error message.
 * @returns An object containing validation schemas for the `unban` and `general` forms.
 */
export function createValidationSchemas(tForm: (key: string) => string) {
    return {
        unban: {
            discordName: [
                { required: true, message: tForm('errorRequired') }
            ],
            discordId: [
                { required: true, message: tForm('errorRequired') },
                { pattern: /^\d+$/, message: tForm('errorDiscordIdNumeric') },
                { pattern: /^\d{17,19}$/, message: tForm('errorDiscordIdInvalid') }
            ],
            apology: [
                { required: true, message: tForm('errorRequired') }
            ]
        } as ValidationSchema,

        general: {
            name: [
                { required: true, message: tForm('errorRequired') }
            ],
            email: [
                { required: true, message: tForm('errorRequired') },
                { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: tForm('errorEmailInvalid') }
            ],
            message: [
                { required: true, message: tForm('errorRequired') }
            ]
        } as ValidationSchema
    };
}
