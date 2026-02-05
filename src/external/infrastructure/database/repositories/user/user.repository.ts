import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/core/domain/user/entities/user.entity';
import { UserRepository } from 'src/core/domain/user/repositories/user.repository.interface';
import { PrismaService } from '../../prisma.service';
import { ApplicationError } from 'src/common/errors/application.error';
import { UserError } from 'src/core/domain/user/user.error';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import { Prisma } from 'src/generated/prisma/client';

/**
 * Implementation of the UserRepository interface.
 * Provides methods to interact with the user data storage.
 */
@MethodTracer()
@Injectable()
export class UserRepositoryImpl implements UserRepository {
    private readonly logger = new Logger(UserRepositoryImpl.name);
    constructor(private prismaService: PrismaService) {}

    /**
     * Finds a user by their ID.
     *
     * @param id - The ID of the user to find.
     * @returns A promise that resolves to the user with the specified ID, or undefined if no user is found.
     */
    async findById(id: number): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new ApplicationError(UserError.USER_NOT_FOUND);
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }

    /**
     * Creates a new user and adds them to the storage.
     *
     * @param user - The user to create.
     * @returns A promise that resolves to the created user.
     */
    async create(user: User): Promise<User> {
        try {
            if (!user.password) {
                throw new ApplicationError(UserError.PASSWORD_REQUIRED);
            }
            const createdUser = await this.prismaService.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    updatedAt: new Date(),
                },
            });
            return {
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email,
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ApplicationError(UserError.EMAIL_ALREADY_EXISTS);
                }
            }
            throw error;
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });
        if (!user) {
            return null;
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
        };
    }
}
