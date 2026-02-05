import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class IncomingRequestPaginationDto {
    @ApiProperty({
        description: 'Current page number',
        example: 1,
        type: Number,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number;
}

export class OutgoingResponsePaginationDto {
    @ApiProperty({
        description: 'Current page number',
        example: 1,
        type: Number,
    })
    page: number;

    @ApiProperty({
        description: 'Total number of pages',
        example: 10,
        type: Number,
    })
    totalPages: number;

    @ApiProperty({
        description: 'Total number of results',
        example: 100,
        type: Number,
    })
    totalResults: number;
}
