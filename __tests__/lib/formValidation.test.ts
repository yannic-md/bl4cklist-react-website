import {
    createValidationSchemas,
    validateField,
    validateForm,
    ValidationRule,
    ValidationSchema
} from "@/lib/formValidation";

describe('formValidation', () => {
    const tForm = jest.fn((key: string) => `translated_${key}`);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('validateField', () => {
        const errorMsg = 'Error occurred';

        it('should return null if no rules are provided', () => {
            expect(validateField('test', [])).toBeNull();
        });

        it('should handle undefined/null value as empty string', () => {
            const rules: ValidationRule[] = [{ required: true, message: errorMsg }];

            expect(validateField(null as any, rules)).toBe(errorMsg);
            expect(validateField(undefined as any, rules)).toBe(errorMsg);
        });

        it('should validate "required" rule', () => {
            const rules: ValidationRule[] = [{ required: true, message: errorMsg }];

            expect(validateField('   ', rules)).toBe(errorMsg); // Trim check
            expect(validateField('valid', rules)).toBeNull();
        });

        it('should validate "pattern" rule', () => {
            const rules: ValidationRule[] = [{ pattern: /^\d+$/, message: errorMsg }];

            expect(validateField('abc', rules)).toBe(errorMsg);
            expect(validateField('123', rules)).toBeNull();

            expect(validateField('', rules)).toBeNull();
        });

        it('should validate "minLength" rule', () => {
            const rules: ValidationRule[] = [{ minLength: 5, message: errorMsg }];

            expect(validateField('123', rules)).toBe(errorMsg);
            expect(validateField('12345', rules)).toBeNull();
            expect(validateField('', rules)).toBeNull(); // Skipped if empty
        });

        it('should validate "maxLength" rule', () => {
            const rules: ValidationRule[] = [{ maxLength: 3, message: errorMsg }];

            expect(validateField('1234', rules)).toBe(errorMsg);
            expect(validateField('123', rules)).toBeNull();
        });

        it('should validate "custom" rule', () => {
            const mockCustom = jest.fn((val) => val === 'valid');
            const rules: ValidationRule[] = [{ custom: mockCustom, message: errorMsg }];

            expect(validateField('invalid', rules)).toBe(errorMsg);
            expect(mockCustom).toHaveBeenCalledWith('invalid');
            expect(validateField('valid', rules)).toBeNull();
        });

        it('should return only the first error in order of rules', () => {
            const rules: ValidationRule[] = [
                { required: true, message: 'first_error' },
                { minLength: 10, message: 'second_error' }
            ];

            // doesn't work for both, but should return first
            expect(validateField('', rules)).toBe('first_error');
        });
    });

    describe('validateForm', () => {
        it('should return errors for all failing fields in schema', () => {
            const schema: ValidationSchema = {
                field1: [{ required: true, message: 'err1' }],
                field2: [{ minLength: 5, message: 'err2' }]
            };

            const formData = new FormData();
            formData.append('field1', '');
            formData.append('field2', '12');

            const result = validateForm(formData, schema);

            expect(result).toEqual({
                field1: 'err1',
                field2: 'err2'
            });
        });

        it('should return an empty object if all fields are valid', () => {
            const schema: ValidationSchema = {
                field1: [{ required: true, message: 'err1' }]
            };

            const formData = new FormData();
            formData.append('field1', 'valid value');

            const result = validateForm(formData, schema);

            expect(result).toEqual({});
        });

        it('should ignore fields in FormData that are not in schema', () => {
            const schema: ValidationSchema = {};
            const formData = new FormData();
            formData.append('unknown', 'value');

            expect(validateForm(formData, schema)).toEqual({});
        });
    });

    describe('createValidationSchemas', () => {
        const schemas = createValidationSchemas(tForm);

        it('should have unban and general schemas defined', () => {
            expect(schemas).toHaveProperty('unban');
            expect(schemas).toHaveProperty('general');
        });

        describe('unban schema logic', () => {
            const { unban } = schemas;

            it('should validate discordId numeric pattern', () => {
                const rules = unban.discordId;
                // Test numeric only
                expect(validateField('abc', rules)).toBe('translated_errorDiscordIdNumeric');
                // Test length requirement (17-19)
                expect(validateField('123', rules)).toBe('translated_errorDiscordIdInvalid');
                expect(validateField('123456789012345678', rules)).toBeNull();
            });

            it('should validate discordName requirement', () => {
                expect(validateField('', unban.discordName)).toBe('translated_errorRequired');
            });
        });

        describe('general schema logic', () => {
            const { general } = schemas;

            it('should validate email format pattern', () => {
                const rules = general.email;
                expect(validateField('invalid-email', rules)).toBe('translated_errorEmailInvalid');
                expect(validateField('test@example.com', rules)).toBeNull();
            });

            it('should validate name and message requirements', () => {
                expect(validateField('', general.name)).toBe('translated_errorRequired');
                expect(validateField('', general.message)).toBe('translated_errorRequired');
            });
        });
    });
});