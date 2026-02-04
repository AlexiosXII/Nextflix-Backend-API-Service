import { Injectable } from '@nestjs/common';
import { User } from 'src/core/domain/user/entities/user.entity';
import { UserRepository } from 'src/core/domain/user/repositories/user.repository.interface';

/**
 * Implementation of the UserRepository interface.
 * Provides methods to interact with the user data storage.
 */
@Injectable()
export class UserRepositoryImpl implements UserRepository {
    /**
     * Array to store user data.
     */
    private readonly users: User[] = [];

    /**
     * Finds a user by their ID.
     *
     * @param id - The ID of the user to find.
     * @returns A promise that resolves to the user with the specified ID, or undefined if no user is found.
     */
    async findById(id: number): Promise<User> {
        return this.users.find((user) => user.id === id);
    }

    /**
     * Creates a new user and adds them to the storage.
     *
     * @param user - The user to create.
     * @returns A promise that resolves to the created user.
     */
    async create(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }
}
