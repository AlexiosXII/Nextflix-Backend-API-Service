import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserRepositoryImpl } from 'src/external/infrastructure/database/repositories/user/user.repository';
import { providerName as userRepositoryProviderName } from 'src/core/domain/user/repositories/user.repository.interface';
import { CreateUserUseCase } from 'src/core/usecase/user/create-user.usecase';
import { GetUserUseCase } from 'src/core/usecase/user/get-user.usecase';

@Module({
    controllers: [UserController],
    providers: [
        { provide: CreateUserUseCase.providerName, useClass: CreateUserUseCase },
        { provide: GetUserUseCase.providerName, useClass: GetUserUseCase },
        { provide: userRepositoryProviderName, useClass: UserRepositoryImpl },
    ],
})
export class UserModule {}
