import {JSX} from "react";
import {IconType} from "react-icons";
import {FaRegCircleQuestion} from "react-icons/fa6";

interface FormFieldProps {
    id: string;
    name: string;
    label: string;
    type?: 'text' | 'email' | 'textarea';
    icon: IconType;
    placeholder: string;
    required?: boolean;
    touched?: boolean;
    error?: string;
    onBlur: () => void;
    rows?: number;
    helpLink?: string;
    disabled?: boolean;
}

/**
 * Reusable form field component with icon, label, validation error display.
 * Supports text inputs, email inputs, and textareas.
 *
 * @param {FormFieldProps} props - Configuration for the form field
 * @param {string} props.id - Unique identifier for the form control.
 * @param {string} props.name - Name attribute used for form submission.
 * @param {string} props.label - Text label rendered above the field.
 * @param {'text' | 'email' | 'textarea'} [props.type='text'] - Input type or `textarea`.
 * @param {IconType} props.icon - Leading icon rendered inside the field.
 * @param {string} props.placeholder - Placeholder text for the input value.
 * @param {boolean} [props.required=false] - Marks the field as required.
 * @param {boolean} [props.touched=false] - Validation state flag for displaying errors.
 * @param {string} [props.error] - Validation error message to display.
 * @param {() => void} props.onBlur - Blur handler for validation or state updates.
 * @param {number} [props.rows] - Row count when rendering a textarea.
 * @param {string} [props.helpLink] - External URL for additional help, opened via icon.
 * @param {boolean} [props.disabled] - If the input field should be disabled
 * @returns {JSX.Element} - Styled form field with error handling
 */
export default function FormField({id, name, label, type = 'text', icon, placeholder, required = false, touched = false,
                                   error, onBlur, rows, helpLink, disabled}: FormFieldProps): JSX.Element {
    const hasError: boolean = touched && !!error;
    const borderClass: string = hasError ? 'border-red-500' : 'border-slate-700';
    const isTextarea: boolean = type === 'textarea';
    const Icon: IconType = icon;

    return (
        <div className="flex flex-col gap-2">
            {/* Label with possible optional flag and/or tooltip for questions */}
            <label htmlFor={id} className="text-sm font-medium text-gray-300 inline-flex items-center justify-start">
                {label} {!required && <span className="text-gray-500"> (Optional)</span>}

                {helpLink && (
                    <a href={helpLink} target="_blank" rel="noopener noreferrer">
                        <FaRegCircleQuestion className="ml-1 mt-0.5 text-gray-500 cursor-pointer" />
                    </a>
                )}
            </label>

            {/* The Form field design */}
            <div className={`relative flex ${isTextarea ? '' : 'items-center'} bg-slate-800/50 border rounded-lg
                             focus-within:border-zinc-300 focus-within:ring-1 focus-within:ring-zinc-300
                             transition-colors duration-200 ${borderClass}`}>
                {/* Icon on the right of the field */}
                <div className={`flex ${isTextarea ? 'items-start' : 'items-center'} justify-center 
                                 ${isTextarea ? 'my-auto' : ''} pl-4 pr-3`}>
                    <Icon className="text-gray-400 text-sm" />
                </div>

                {/* Divider after the icon */}
                <div className={`${isTextarea ? 'h-auto mt-3 mb-3' : 'h-8'} w-px bg-slate-700`}></div>

                {/* type of the input field */}
                {isTextarea ? (
                    <textarea id={id} name={name} rows={rows || 5} placeholder={placeholder} onChange={onBlur}
                              className="flex-1 bg-transparent px-4 py-3 text-gray-100 placeholder-gray-500
                                         focus:outline-none resize-none disabled:text-gray-700
                                         disabled:cursor-not-allowed" disabled={disabled} autoComplete="off" />
                ) : (
                    <input type={type} id={id} name={name} placeholder={placeholder} onChange={onBlur} autoComplete="off"
                           className="flex-1 bg-transparent px-4 py-3 text-gray-100 placeholder-gray-500
                                      focus:outline-none disabled:text-gray-700 disabled:cursor-not-allowed"
                           disabled={disabled} />
                )}
            </div>

            {/* Error message */}
            {hasError && ( <span className="text-xs text-red-400">{error}</span> )}
        </div>
    );
}
