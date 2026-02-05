import { ApiProperty } from '@nestjs/swagger';

class ErrorDetail {
    @ApiProperty({
        description: 'Error code',
        example: 'error.user.E0001',
        type: String,
    })
    code: string;

    @ApiProperty({
        description: 'Error message',
        example: 'User not found',
        type: String,
    })
    message: string;
}

export class ErrorResponseDto {
    @ApiProperty({
        description: 'HTTP status code',
        example: 400,
        type: Number,
    })
    status: number;

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
        example: {
            code: 'error.common.E0001',
            message: 'Bad Request',
        },
        type: ErrorDetail,
    })
    error: ErrorDetail;
}

export class NotFoundResponseDto {
    @ApiProperty({
        description: 'HTTP status code',
        example: 404,
        type: Number,
    })
    status: number;

    @ApiProperty({
        description: 'Error message',
        example: 'Resource not found',
        type: String,
    })
    message: string;

    @ApiProperty({
        description: 'Error type',
        example: {
            code: 'error.common.E0002',
            message: 'Not Found',
        },
        type: ErrorDetail,
    })
    error: ErrorDetail;
}

export class UnauthorizedResponseDto {
    @ApiProperty({
        description: 'HTTP status code',
        example: 401,
        type: Number,
    })
    status: number;

    @ApiProperty({
        description: 'Error message',
        example: 'Unauthorized',
        type: String,
    })
    message: string;

    @ApiProperty({
        description: 'Error type',
        example: {
            code: 'error.common.E0003',
            message: 'Unauthorized',
        },
        type: ErrorDetail,
    })
    error: ErrorDetail;
}

export class InternalServerErrorResponseDto {
    @ApiProperty({
        description: 'HTTP status code',
        example: 500,
        type: Number,
    })
    status: number;

    @ApiProperty({
        description: 'Error message',
        example: 'Internal server error',
        type: String,
    })
    message: string;

    @ApiProperty({
        description: 'Error type',
        example: {
            code: 'error.common.E0004',
            message: 'Internal Server Error',
        },
        type: ErrorDetail,
    })
    error: ErrorDetail;
}
