import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { CommonError } from '../errors/list/common.error';

jest.mock('jsonwebtoken');

describe('AuthGuard', () => {
    let authGuard: AuthGuard;
    let mockExecutionContext: ExecutionContext;
    let mockRequest: any;

    beforeEach(() => {
        authGuard = new AuthGuard();
        mockRequest = {
            headers: {},
        };
        mockExecutionContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue(mockRequest),
            }),
        } as any;

        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret-key';
    });

    afterEach(() => {
        delete process.env.JWT_SECRET;
    });

    describe('canActivate', () => {
        it('should return true for valid authorization header and token', () => {
            const tokenPayload = { userId: 1 };
            const token = 'valid-jwt-token';
            mockRequest.headers.authorization = `Bearer ${token}`;

            jest.mocked(jwt.verify).mockReturnValueOnce(tokenPayload as any);

            const result = authGuard.canActivate(mockExecutionContext);

            expect(result).toBe(true);
            expect(jwt.verify).toHaveBeenCalledWith(token, 'test-secret-key');
            expect(mockRequest.user).toEqual(tokenPayload);
        });

        it('should throw UnauthorizedError when authorization header is missing', () => {
            mockRequest.headers = {};

            expect(() => authGuard.canActivate(mockExecutionContext)).toThrow(UnauthorizedError);
            expect(() => authGuard.canActivate(mockExecutionContext)).toThrow(
                new UnauthorizedError(CommonError.MISSING_AUTHORIZATION_HEADER),
            );
        });

        it('should handle authorization header case-insensitively (Authorization)', () => {
            const tokenPayload = { userId: 1 };
            const token = 'valid-jwt-token';
            mockRequest.headers.Authorization = `Bearer ${token}`;

            jest.mocked(jwt.verify).mockReturnValueOnce(tokenPayload as any);

            const result = authGuard.canActivate(mockExecutionContext);

            expect(result).toBe(true);
            expect(mockRequest.user).toEqual(tokenPayload);
        });

        it('should throw UnauthorizedError when authorization header has invalid format (missing Bearer)', () => {
            mockRequest.headers.authorization = 'InvalidToken';

            expect(() => authGuard.canActivate(mockExecutionContext)).toThrow(UnauthorizedError);
            expect(() => authGuard.canActivate(mockExecutionContext)).toThrow(
                new UnauthorizedError(CommonError.INVALID_AUTHORIZATION_HEADER_FORMAT),
            );
        });

        it('should throw UnauthorizedError when authorization header has invalid format (missing token)', () => {
            mockRequest.headers.authorization = 'Bearer';

            expect(() => authGuard.canActivate(mockExecutionContext)).toThrow(UnauthorizedError);
            expect(() => authGuard.canActivate(mockExecutionContext)).toThrow(
                new UnauthorizedError(CommonError.INVALID_AUTHORIZATION_HEADER_FORMAT),
            );
        });

        it('should throw UnauthorizedError when authorization header has invalid format (too many parts)', () => {
            mockRequest.headers.authorization = 'Bearer token extra';

            expect(() => authGuard.canActivate(mockExecutionContext)).toThrow(UnauthorizedError);
            expect(() => authGuard.canActivate(mockExecutionContext)).toThrow(
                new UnauthorizedError(CommonError.INVALID_AUTHORIZATION_HEADER_FORMAT),
            );
        });

        it('should throw UnauthorizedError when JWT_SECRET is not configured', () => {
            delete process.env.JWT_SECRET;
            mockRequest.headers.authorization = 'Bearer valid-token';

            expect(() => authGuard.canActivate(mockExecutionContext)).toThrow(UnauthorizedError);
            expect(() => authGuard.canActivate(mockExecutionContext)).toThrow(
                new UnauthorizedError(CommonError.SERVER_CONFIGURATION_ERROR),
            );
        });

        it('should throw UnauthorizedError when token is invalid', () => {
            mockRequest.headers.authorization = 'Bearer invalid-token';
            jest.mocked(jwt.verify).mockImplementationOnce(() => {
                throw new Error('invalid token');
            });

            expect(() => authGuard.canActivate(mockExecutionContext)).toThrow(UnauthorizedError);
        });

        it('should throw UnauthorizedError when token is expired', () => {
            mockRequest.headers.authorization = 'Bearer expired-token';
            jest.mocked(jwt.verify).mockImplementationOnce(() => {
                throw new Error('jwt expired');
            });

            expect(() => authGuard.canActivate(mockExecutionContext)).toThrow(UnauthorizedError);
        });

        it('should attach user payload to request for downstream handlers', () => {
            const tokenPayload = { userId: 42 };
            const token = 'valid-jwt-token';
            mockRequest.headers.authorization = `Bearer ${token}`;

            jest.mocked(jwt.verify).mockReturnValueOnce(tokenPayload as any);

            authGuard.canActivate(mockExecutionContext);

            expect(mockRequest.user).toStrictEqual(tokenPayload);
        });

        it('should call getRequest from ExecutionContext to retrieve the request object', () => {
            const token = 'valid-jwt-token';
            mockRequest.headers.authorization = `Bearer ${token}`;
            jest.mocked(jwt.verify).mockReturnValueOnce({ userId: 1 } as any);

            authGuard.canActivate(mockExecutionContext);

            expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
        });
    });
});
