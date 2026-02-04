import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({
        description: 'HTTP status code',
        example: 400,
        type: Number,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Error message or array of validation errors',
        oneOf: [
            { type: 'string', example: 'Bad Request' },
            {
                type: 'array',
                items: { type: 'string' },
                example: ['username should not be empty', 'password should not be empty'],
            },
        ],
    })
    message: string | string[];

    @ApiProperty({
        description: 'Error type',
        example: 'Bad Request',
        type: String,
    })
    error: string;
}

export class NotFoundResponseDto {
    @ApiProperty({
        description: 'HTTP status code',
        example: 404,
        type: Number,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Error message',
        example: 'Resource not found',
        type: String,
    })
    message: string;

    @ApiProperty({
        description: 'Error type',
        example: 'Not Found',
        type: String,
    })
    error: string;
}

export class UnauthorizedResponseDto {
    @ApiProperty({
        description: 'HTTP status code',
        example: 401,
        type: Number,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Error message',
        example: 'Unauthorized',
        type: String,
    })
    message: string;

    @ApiProperty({
        description: 'Error type',
        example: 'Unauthorized',
        type: String,
    })
    error: string;
}

export class InternalServerErrorResponseDto {
    @ApiProperty({
        description: 'HTTP status code',
        example: 500,
        type: Number,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Error message',
        example: 'Internal server error',
        type: String,
    })
    message: string;

    @ApiProperty({
        description: 'Error type',
        example: 'Internal Server Error',
        type: String,
    })
    error: string;
}
