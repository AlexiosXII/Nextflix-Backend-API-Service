import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    UserRepository,
    providerName as userRepositoryProviderName,
} from 'src/core/domain/user/repositories/user.repository.interface';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import { UserError } from 'src/core/domain/user/user.error';
import * as bcrypt from 'bcrypt';
import { AuthError } from 'src/core/domain/auth/auth.error';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedError } from 'src/common/errors/unauthorized.error';

/**
 * @class LoginUseCase
 * @description Use case for logging in a user with email and password.
 * @decorator `@MethodTracer()`
 * @decorator `@Injectable()`
 */
@MethodTracer()
@Injectable()
export class LoginUseCase {
    static readonly providerName = 'LoginUseCase';
    private readonly logger = new Logger(LoginUseCase.name);

    /**
     * @constructor
     * @param {UserRepository} userRepository - The repository instance for user data access.
     */
    constructor(
        @Inject(userRepositoryProviderName)
        private readonly userRepository: UserRepository,
    ) {}

    /**
     * Logs in a user by their email and password.
     * @param {string} email - The email of the user to log in.
     * @param {string} password - The password of the user to log in.
     * @returns {string} - The authentication token.
     */
    async execute(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedError(AuthError.INVALID_CREDENTIALS);
        }
        if (!user.password) {
            throw new UnauthorizedError(UserError.PASSWORD_REQUIRED);
        }
        // compare password (assuming user.password is hashed)
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError(AuthError.INVALID_CREDENTIALS);
        }
        // sign token with JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default_secret', {
            expiresIn: '1h',
        });

        return token;
    }
}
