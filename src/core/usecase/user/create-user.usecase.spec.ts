import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.usecase';
import { UserRepository } from 'src/core/domain/user/repositories/user.repository.interface';
import { User } from 'src/core/domain/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('CreateUserUseCase', () => {
    let createUserUseCase: CreateUserUseCase;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateUserUseCase,
                {
                    provide: 'UserRepository',
                    useValue: {
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
        userRepository = module.get<UserRepository>('UserRepository');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('hashes the password and creates a user', async () => {
        const param = { name: 'Alice', email: 'alice@example.com', password: 'plainpwd' };

        jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashed-pwd');

        const created = new User(1, param.name, param.email, 'hashed-pwd');
        (userRepository.create as jest.Mock).mockResolvedValue(created);

        const result = await createUserUseCase.execute(param);

        expect(bcrypt.hashSync).toHaveBeenCalledWith(param.password, 10);
        expect(userRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                name: param.name,
                email: param.email,
                password: 'hashed-pwd',
            }),
        );
        expect(result).toBe(created);
    });
});
