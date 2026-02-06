import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteDto {
    @ApiProperty({
        description: 'Favorite Item ID',
        example: 101,
        type: Number,
    })
    favoriteId: number;
}
