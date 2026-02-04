import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from 'src/core/domain/user/repositories/user.repository.interface';
import { User } from 'src/core/domain/user/entities/user.entity';
import { CreateUserUseCase } from '../user/create-user.usecase';
import { GetUserUseCase } from '../user/get-user.usecase';

describe('User UseCases', () => {
    let createUseCase: CreateUserUseCase;
    let getUseCase: GetUserUseCase;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateUserUseCase,
                GetUserUseCase,
                {
                    provide: 'UserRepository',
                    useValue: {
                        create: jest.fn(),
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        createUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
        getUseCase = module.get<GetUserUseCase>(GetUserUseCase);
        userRepository = module.get<UserRepository>('UserRepository');
    });

    describe('CreateUserUseCase', () => {
        it('should create a user and return it', async () => {
            const params = { name: 'Alice', email: 'alice@example.com', password: 'securepassword' };
            const returned = new User(Date.now(), params.name, params.email, params.password);

            jest.spyOn(userRepository, 'create').mockResolvedValue(returned);

            const result = await createUseCase.execute(params as any);

            expect(result).toEqual(returned);
            expect(userRepository.create).toHaveBeenCalledWith(expect.any(User));
            expect((userRepository.create as jest.Mock).mock.calls[0][0]).toMatchObject({
                name: params.name,
                email: params.email,
            });
        });
    });

    describe('GetUserUseCase', () => {
        it('should return a user by id', async () => {
            const user = new User(1, 'Bob', 'bob@example.com', 'anotherpassword');

            jest.spyOn(userRepository, 'findById').mockResolvedValue(user);

            const result = await getUseCase.execute(1);

            expect(result).toEqual(user);
            expect(userRepository.findById).toHaveBeenCalledWith(1);
        });
    });
});
