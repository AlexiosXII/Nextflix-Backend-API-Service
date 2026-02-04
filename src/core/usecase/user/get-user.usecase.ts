import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/core/domain/user/entities/user.entity';
import {
    UserRepository,
    providerName as userRepositoryProviderName,
} from 'src/core/domain/user/repositories/user.repository.interface';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import { ApplicationError } from 'src/common/errors/application.error';
import { UserError } from 'src/core/domain/user/user.error';

/**
 * @class getUserUseCase
 * @description Use case for retrieving a user by their ID.
 * @decorator `@MethodTracer()`
 * @decorator `@Injectable()`
 */
@MethodTracer()
@Injectable()
export class GetUserUseCase {
    static readonly providerName = 'GetUserUseCase';
    private readonly logger = new Logger(GetUserUseCase.name);

    /**
     * @constructor
     * @param {UserRepository} userRepository - The repository instance for user data access.
     */
    constructor(
        @Inject(userRepositoryProviderName)
        private readonly userRepository: UserRepository,
    ) {}

    /**
     * Retrieves a user by their ID.
     * @param {number} id - The ID of the user to retrieve.
     * @returns {Promise<User>} - The user with the specified ID.
     */
    async execute(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new ApplicationError(UserError.USER_NOT_FOUND);
        }
        return user;
    }
}
