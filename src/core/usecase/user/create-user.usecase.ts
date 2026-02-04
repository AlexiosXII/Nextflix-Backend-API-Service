import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/core/domain/user/entities/user.entity';
import {
    UserRepository,
    providerName as userRepositoryProviderName,
} from 'src/core/domain/user/repositories/user.repository.interface';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import * as bcrypt from 'bcrypt';

export type CreateUserUseCaseParam = {
    name: string;
    email: string;
    password: string;
};

/**
 * @class createUserUseCase
 * @description Use case for creating a new user.
 * @decorator `@MethodTracer()`
 * @decorator `@Injectable()`
 */
@MethodTracer()
@Injectable()
export class CreateUserUseCase {
    static readonly providerName = 'CreateUserUseCase';
    private readonly logger = new Logger(CreateUserUseCase.name);

    /**
     * @constructor
     * @param {UserRepository} userRepository - The repository instance for user data access.
     */
    constructor(
        @Inject(userRepositoryProviderName)
        private readonly userRepository: UserRepository,
    ) {}

    /**
     * Creates a new user.
     * @param {CreateUserUseCaseParam} param - Parameters for creating a new user.
     * @returns {Promise<User>} - The created user.
     */
    async execute(param: CreateUserUseCaseParam): Promise<User> {
        const { name, email, password } = param;
        const hashPassword = bcrypt.hashSync(password, 10); // Hash the password before storing
        const user = new User(1, name, email, hashPassword); // Simulate ID assignment
        return this.userRepository.create(user);
    }
}
