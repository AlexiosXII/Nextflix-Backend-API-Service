import { maskSensitiveData, sanitizeArgs, sanitizeString } from './sensitive-data.helper';

describe('sanitizeString', () => {
    it('should remove non-alphanumeric characters and trim whitespace', () => {
        expect(sanitizeString('  hello!@#  ')).toBe('hello');
    });

    it('should return an empty string if input is only non-alphanumeric characters', () => {
        expect(sanitizeString('!@#$%^&*()')).toBe('');
    });

    it('should return the same string if it contains only alphanumeric characters', () => {
        expect(sanitizeString('hello123')).toBe('hello123');
    });
});

describe('maskSensitiveData', () => {
    it('should mask all characters in the string with asterisks', () => {
        expect(maskSensitiveData('password')).toBe('********');
    });
    it('should return asterisks if input is an empty string', () => {
        expect(maskSensitiveData('')).toBe('********');
    });
});

describe('sanitizeArgs', () => {
    it('should sanitize strings in an array', () => {
        const input = ['  hello!@#  ', 'world123'];
        const expected = ['hello', 'world123'];
        expect(sanitizeArgs(input)).toEqual(expected);
    });

    it('should mask sensitive properties in an object', () => {
        const input = { username: 'user1', password: 'secret' };
        const expected = { username: 'user1', password: '********' };
        expect(sanitizeArgs(input)).toEqual(expected);
    });

    it('should recursively sanitize nested objects', () => {
        const input = {
            user: { username: 'user1', password: 'secret' },
            message: '  hello!@#  ',
        };
        const expected = {
            user: { username: 'user1', password: '********' },
            message: 'hello',
        };
        expect(sanitizeArgs(input)).toEqual(expected);
    });

    it('should handle mixed arrays and objects', () => {
        const input = [{ username: 'user1', password: 'secret' }, '  hello!@#  '];
        const expected = [{ username: 'user1', password: '********' }, 'hello'];
        expect(sanitizeArgs(input)).toEqual(expected);
    });

    it('should return the same value for non-string, non-object, non-array inputs', () => {
        expect(sanitizeArgs(123)).toBe(123);
        expect(sanitizeArgs(true)).toBe(true);
    });
});
