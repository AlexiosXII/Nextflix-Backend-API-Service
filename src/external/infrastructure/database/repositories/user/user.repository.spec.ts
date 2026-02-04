import { UserRepositoryImpl } from './user.repository';
import { User } from 'src/core/domain/user/entities/user.entity';

describe('UserRepositoryImpl', () => {
    let userRepository: UserRepositoryImpl;

    beforeEach(() => {
        userRepository = new UserRepositoryImpl();
    });

    describe('findById', () => {
        it('should return a user by ID', async () => {
            const user = new User(1, 'John Doe', 'john.doe@example.com', 'password123');
            await userRepository.create(user);

            const foundUser = await userRepository.findById(1);
            expect(foundUser).toEqual(user);
        });

        it('should return undefined if user is not found', async () => {
            const foundUser = await userRepository.findById(999);
            expect(foundUser).toBeUndefined();
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const user = new User(1, 'John Doe', 'john.doe@example.com', 'password123');
            const createdUser = await userRepository.create(user);

            expect(createdUser).toEqual(user);
            expect(await userRepository.findById(1)).toEqual(user);
        });
    });
});
