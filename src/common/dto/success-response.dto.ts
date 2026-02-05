import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
    @ApiProperty({
        description: 'Request identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
    })
    requestId?: string;

    @ApiProperty({
        description: 'HTTP status code',
        example: 200,
        type: Number,
    })
    status: number;

    @ApiProperty({
        description: 'Success message',
        example: 'Operation completed successfully',
        type: String,
    })
    message: string;
}
