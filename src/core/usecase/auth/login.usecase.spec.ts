import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from './login.usecase';
import { UserRepository } from 'src/core/domain/user/repositories/user.repository.interface';
import { User } from 'src/core/domain/user/entities/user.entity';
import { ApplicationError } from 'src/common/errors/application.error';
import { AuthError } from 'src/core/domain/auth/auth.error';
import { UserError } from 'src/core/domain/user/user.error';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

describe('LoginUseCase', () => {
    let loginUseCase: LoginUseCase;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginUseCase,
                {
                    provide: 'UserRepository',
                    useValue: {
                        findByEmail: jest.fn(),
                    },
                },
            ],
        }).compile();

        loginUseCase = module.get<LoginUseCase>(LoginUseCase);
        userRepository = module.get<UserRepository>('UserRepository');
    });

    afterEach(() => {
        jest.restoreAllMocks();
        delete process.env.JWT_SECRET;
    });

    it('throws when user not found', async () => {
        (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

        await expect(loginUseCase.execute('noone@example.com', 'pwd')).rejects.toMatchObject({
            message: AuthError.INVALID_CREDENTIALS,
        });
    });

    it('throws when user has no password', async () => {
        const user = new User(1, 'Name', 'n@example.com');
        (userRepository.findByEmail as jest.Mock).mockResolvedValue(user);

        await expect(loginUseCase.execute('n@example.com', 'pwd')).rejects.toMatchObject({
            message: UserError.PASSWORD_REQUIRED,
        });
    });

    it('throws when password is invalid', async () => {
        const user = new User(2, 'Name', 'x@example.com', 'hashed');
        (userRepository.findByEmail as jest.Mock).mockResolvedValue(user);

        jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

        await expect(loginUseCase.execute('x@example.com', 'wrongpwd')).rejects.toMatchObject({
            message: AuthError.INVALID_CREDENTIALS,
        });
    });

    it('returns a token when credentials are valid', async () => {
        const user = new User(42, 'Valid', 'valid@example.com', 'hashed');
        (userRepository.findByEmail as jest.Mock).mockResolvedValue(user);

        jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
        process.env.JWT_SECRET = 'test_secret';
        (jest.spyOn(jwt, 'sign') as jest.Mock).mockReturnValue('signed-token');

        const token = await loginUseCase.execute('valid@example.com', 'rightpwd');

        expect(token).toBe('signed-token');
        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: user.id },
            process.env.JWT_SECRET || 'default_secret',
            expect.any(Object),
        );
    });
});
