import { sensitiveProperties } from 'src/common/config/sensitive-properties.config';

/**
 * Sanitizes a given string by trimming whitespace and removing all non-alphanumeric characters.
 *
 * @param str - The string to be sanitized.
 * @returns The sanitized string.
 */
export function sanitizeString(str: string): string {
    return str.trim().replace(/[^\w\s]/gi, '');
}

/**
 * Masks the entire input string by replacing each character with an asterisk (*).
 *
 * @param str - The input string to be masked.
 * @returns A string where each character of the input is replaced with an asterisk.
 */
export function maskSensitiveData(str: string): string {
    return '********';
}

/**
 * Recursively sanitizes the provided arguments by masking sensitive properties and sanitizing strings.
 *
 * @param args - The arguments to sanitize. Can be of any type.
 * @param sensitiveProps - An optional array of property names that should be masked if found in the arguments.
 * @returns The sanitized arguments with sensitive properties masked and strings sanitized.
 */
export function sanitizeArgs(args: any): any {
    if (Array.isArray(args)) {
        return args.map((item) => sanitizeArgs(item)); // Recursively sanitize each element in an array
    } else if (typeof args === 'object' && args !== null) {
        const sanitizedObject: { [key: string]: any } = {};
        for (const key in args) {
            if (Object.hasOwn(args, key)) {
                if (sensitiveProperties.includes(key)) {
                    // If the key is in the sensitive properties list, mask the value
                    sanitizedObject[key] = maskSensitiveData(args[key]);
                } else {
                    // Recursively sanitize object properties
                    sanitizedObject[key] = sanitizeArgs(args[key]);
                }
            }
        }
        return sanitizedObject;
    } else if (typeof args === 'string') {
        return sanitizeString(args); // Sanitize strings
    }
    return args;
}
