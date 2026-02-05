import { Controller, Get, Inject, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiInternalServerErrorResponse, ApiHeader } from '@nestjs/swagger';
import { InternalServerErrorResponseDto } from 'src/common/dto/error-response.dto';
import { GetGenresUseCase } from 'src/core/usecase/movie/get-genres.usecase';
import { Genre } from 'src/core/domain/movie/entities/genre.entity';
import { GenreSuccessResponseDto, MovieSuccessResponseDto } from './dto/movie.dto';
import { Movie } from 'src/core/domain/movie/entities/movie.entity';
import { PaginationType } from 'src/common/type/pagination.type';
import { GetMoviesUseCase } from 'src/core/usecase/movie/get-movies.usecase';
import { IncomingRequestPaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Movies')
@ApiHeader({
    name: 'x-language',
    description: 'Language header',
    required: false,
    schema: {
        type: 'string',
        example: 'en',
    },
})
@Controller('movies')
export class MovieController {
    constructor(
        @Inject(GetGenresUseCase.providerName)
        private readonly getGenresUseCase: GetGenresUseCase,
        @Inject(GetMoviesUseCase.providerName)
        private readonly getMoviesUseCase: GetMoviesUseCase,
    ) {}

    @Get()
    @ApiOperation({
        summary: 'Get now playing movies',
        description: 'Retrieves a list of now playing movies',
    })
    @ApiResponse({
        status: 200,
        description: 'Now playing movies retrieved successfully',
        type: MovieSuccessResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: InternalServerErrorResponseDto,
    })
    async getMovies(@Query() paginationDto: IncomingRequestPaginationDto): Promise<PaginationType<Movie>> {
        return this.getMoviesUseCase.execute(paginationDto.page);
    }

    @Get('genres')
    @ApiOperation({
        summary: 'Get genres',
        description: 'Retrieves a list of movie genres',
    })
    @ApiResponse({
        status: 200,
        description: 'Genres retrieved successfully',
        type: GenreSuccessResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: InternalServerErrorResponseDto,
    })
    async getGenres(): Promise<Genre[]> {
        return this.getGenresUseCase.execute();
    }
}
