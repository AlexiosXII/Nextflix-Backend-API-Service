import { ApiProperty } from '@nestjs/swagger';
import { IncomingRequestPaginationDto, OutgoingResponsePaginationDto } from 'src/common/dto/pagination.dto';
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

class MovieDto {
    @ApiProperty({
        description: 'Movie ID',
        example: 101,
        type: Number,
    })
    id: number;

    @ApiProperty({
        description: 'Movie title',
        example: 'Inception',
        type: String,
    })
    @ApiProperty({
        description: 'Movie title',
        example: 'Inception',
        type: String,
    })
    title: string;

    @ApiProperty({
        description: 'Poster path',
        example: '/posterpath.jpg',
        type: String,
    })
    posterPath: string;

    @ApiProperty({
        description: 'Movie overview',
        example: 'A mind-bending thriller about dream invasion.',
        type: String,
    })
    overview: string;

    @ApiProperty({
        description: 'Release date',
        example: '2010-07-16',
        type: String,
    })
    releaseDate: string;

    @ApiProperty({
        description: 'Popularity score',
        example: 87.65,
        type: Number,
    })
    popularity: number;
}

export class GenreSuccessResponseDto extends SuccessResponseDto {
    @ApiProperty({
        description: 'List of genres',
        type: [GenreDto],
    })
    data: GenreDto[];
}

class MoviePaginationDataDto extends OutgoingResponsePaginationDto {
    @ApiProperty({
        description: 'List of movies',
        type: [MovieDto],
    })
    result: MovieDto[];
}

export class MovieSuccessResponseDto extends SuccessResponseDto {
    @ApiProperty({
        description: 'List of movies',
        type: MoviePaginationDataDto,
    })
    data: MoviePaginationDataDto;
}

export class MovieDetailSuccessResponseDto extends SuccessResponseDto {
    @ApiProperty({
        description: 'Movie details',
        type: MovieDto,
    })
    data: MovieDto;
}

export class TrendingMovieDto {
    @ApiProperty({
        description: 'Time window for trending movies',
        example: 'day',
        type: String,
    })
    timeWindow: string;
}

export class SearchMovieDto extends IncomingRequestPaginationDto {
    @ApiProperty({
        description: 'Search keyword for movies',
        example: 'Inception',
        type: String,
    })
    searchKeyword: string;
}
