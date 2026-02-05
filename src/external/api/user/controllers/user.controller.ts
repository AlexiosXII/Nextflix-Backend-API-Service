import { Controller, Post, Get, Param, Body, Inject, ParseIntPipe, UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiCreatedResponse,
    ApiHeader,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from 'src/core/domain/user/entities/user.entity';
import { ErrorResponseDto, InternalServerErrorResponseDto } from 'src/common/dto/error-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserUseCase } from 'src/core/usecase/user/get-user.usecase';
import { CreateUserUseCase } from 'src/core/usecase/user/create-user.usecase';
import { AuthGuard } from 'src/common/guard/auth.guard';

@ApiTags('Users')
@ApiHeader({
    name: 'x-language',
    description: 'Language header',
    required: false,
    schema: {
        type: 'string',
        example: 'en',
    },
})
@Controller('users')
export class UserController {
    constructor(
        @Inject(GetUserUseCase.providerName)
        private readonly getUserUseCase: GetUserUseCase,

        @Inject(CreateUserUseCase.providerName)
        private readonly createUserUseCase: CreateUserUseCase,
    ) {}

    @Post()
    @ApiOperation({
        summary: 'Create a new user',
        description: 'Creates a new user with the provided information',
    })
    @ApiBody({
        type: CreateUserDto,
        description: 'User creation data',
    })
    @ApiCreatedResponse({
        description: 'User created successfully',
        type: User,
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: InternalServerErrorResponseDto,
    })
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.createUserUseCase.execute(createUserDto);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get user by ID',
        description: 'Retrieves a user by their unique identifier',
    })
    @ApiParam({
        name: 'id',
        type: 'number',
        description: 'Unique identifier of the user',
        example: 1,
    })
    @ApiResponse({
        status: 200,
        description: 'User retrieved successfully',
        type: User,
    })
    @ApiBadRequestResponse({
        description: 'Invalid user ID format',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: InternalServerErrorResponseDto,
    })
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard)
    async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.getUserUseCase.execute(id);
    }
}
