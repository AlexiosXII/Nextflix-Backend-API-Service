import { Test, TestingModule } from '@nestjs/testing';
import { GetUserUseCase } from './get-user.usecase';
import { UserRepository } from 'src/core/domain/user/repositories/user.repository.interface';
import { User } from 'src/core/domain/user/entities/user.entity';
import { ApplicationError } from 'src/common/errors/application.error';
import { UserError } from 'src/core/domain/user/user.error';

describe('GetUserUseCase', () => {
    let getUserUseCase: GetUserUseCase;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetUserUseCase,
                {
                    provide: 'UserRepository',
                    useValue: {
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        getUserUseCase = module.get<GetUserUseCase>(GetUserUseCase);
        userRepository = module.get<UserRepository>('UserRepository');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('returns a user when found', async () => {
        const expected = new User(1, 'Bob', 'bob@example.com', 'secret');
        (userRepository.findById as jest.Mock).mockResolvedValue(expected);

        const result = await getUserUseCase.execute(1);

        expect(userRepository.findById).toHaveBeenCalledWith(1);
        expect(result).toBe(expected);
    });

    it('throws ApplicationError when user not found', async () => {
        (userRepository.findById as jest.Mock).mockResolvedValue(null);

        await expect(getUserUseCase.execute(999)).rejects.toBeInstanceOf(ApplicationError);
        await expect(getUserUseCase.execute(999)).rejects.toMatchObject({ message: UserError.USER_NOT_FOUND });
    });
});
