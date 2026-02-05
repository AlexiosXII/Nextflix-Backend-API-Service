import { Controller, Post, Get, Param, Body, Inject, ParseIntPipe } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiUnauthorizedResponse,
    ApiHeader,
} from '@nestjs/swagger';
import {
    ErrorResponseDto,
    InternalServerErrorResponseDto,
    UnauthorizedResponseDto,
} from 'src/common/dto/error-response.dto';
import { LoginDto } from './dto/login.dto';
import { LoginUseCase } from 'src/core/usecase/auth/login.usecase';

@ApiTags('Auth')
@ApiHeader({
    name: 'x-language',
    description: 'Language header',
    required: false,
    schema: {
        type: 'string',
        example: 'en',
    },
})
@Controller('auth')
export class AuthController {
    constructor(
        @Inject(LoginUseCase.providerName)
        private readonly loginUseCase: LoginUseCase,
    ) {}

    @Post()
    @ApiOperation({
        summary: 'User login',
        description: 'Authenticates a user with the provided credentials',
    })
    @ApiBody({
        type: LoginDto,
        description: 'User login data',
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: InternalServerErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized access',
        type: UnauthorizedResponseDto,
    })
    async login(@Body() loginDto: LoginDto): Promise<string> {
        return this.loginUseCase.execute(loginDto.email, loginDto.password);
    }
}
