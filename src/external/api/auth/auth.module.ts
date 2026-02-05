import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from 'src/external/infrastructure/database/repositories/user/user.repository';
import { providerName as userRepositoryProviderName } from 'src/core/domain/user/repositories/user.repository.interface';
import { PrismaService } from 'src/external/infrastructure/database/prisma.service';
import { AuthController } from './controllers/auth.controller';
import { LoginUseCase } from 'src/core/usecase/auth/login.usecase';

@Module({
    controllers: [AuthController],
    providers: [
        PrismaService,
        { provide: LoginUseCase.providerName, useClass: LoginUseCase },
        { provide: userRepositoryProviderName, useClass: UserRepositoryImpl },
    ],
})
export class AuthModule {}
