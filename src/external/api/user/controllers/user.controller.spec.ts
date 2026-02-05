import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { GetUserUseCase } from 'src/core/usecase/user/get-user.usecase';
import { CreateUserUseCase } from 'src/core/usecase/user/create-user.usecase';
import { User } from 'src/core/domain/user/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
    let userController: UserController;
    let createUserUseCase: CreateUserUseCase;
    let getUserUseCase: GetUserUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: CreateUserUseCase.providerName,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
                {
                    provide: GetUserUseCase.providerName,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
        createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase.providerName);
        getUserUseCase = module.get<GetUserUseCase>(GetUserUseCase.providerName);
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'strongpassword123',
            };
            const result: User = { id: 1, ...createUserDto };

            jest.spyOn(createUserUseCase, 'execute').mockResolvedValue(result);

            expect(await userController.createUser(createUserDto)).toBe(result);
            expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
        });
    });

    describe('getUserInfo', () => {
        it('should return a user by id', async () => {
            const result: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
            };

            jest.spyOn(getUserUseCase, 'execute').mockResolvedValue(result);

            expect(await userController.getUserInfo({ user: { userId: 1 } })).toBe(result);
            expect(getUserUseCase.execute).toHaveBeenCalledWith(1);
        });
    });
});
