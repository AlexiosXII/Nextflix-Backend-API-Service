import { User } from '../entities/user.entity';

export const providerName = 'UserRepository';
/**
 * Interface representing a repository for managing users.
 */
export interface UserRepository {
    /**
     * Finds a user by their unique identifier.
     *
     * @param id - The unique identifier of the user.
     * @returns A promise that resolves to the user if found, or rejects if not found.
     */
    findById(id: number): Promise<User>;

    /**
     * Creates a new user in the repository.
     *
     * @param user - The user to be created.
     * @returns A promise that resolves to the created user.
     */
    create(user: User): Promise<User>;
}
