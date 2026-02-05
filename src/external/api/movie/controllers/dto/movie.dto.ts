import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';

class GenreDto {
    @ApiProperty({
        description: 'Genre ID',
        example: 1,
        type: Number,
    })
    id: number;
    @ApiProperty({
        description: 'Genre name',
        example: 'Action',
        type: String,
    })
    name: string;
}

export class GenreSuccessResponseDto extends SuccessResponseDto {
    @ApiProperty({
        description: 'List of genres',
        type: [GenreDto],
    })
    data: GenreDto[];
}
