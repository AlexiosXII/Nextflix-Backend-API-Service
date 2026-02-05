import { Controller, Get, Inject, UseGuards, Req, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiInternalServerErrorResponse, ApiHeader } from '@nestjs/swagger';
import { InternalServerErrorResponseDto } from 'src/common/dto/error-response.dto';
import { GetGenresUseCase } from 'src/core/usecase/movie/get-genres.usecase';
import { Genre } from 'src/core/domain/movie/entities/genre.entity';
import {
    GenreSuccessResponseDto,
    MovieDetailSuccessResponseDto,
    MovieSuccessResponseDto,
    SearchMovieDto,
    TrendingMovieDto,
} from './dto/movie.dto';
import { Movie } from 'src/core/domain/movie/entities/movie.entity';
import { PaginationType } from 'src/common/type/pagination.type';
import { GetMoviesUseCase } from 'src/core/usecase/movie/get-movies.usecase';
import { IncomingRequestPaginationDto } from 'src/common/dto/pagination.dto';
import { GetMovieUseCase } from 'src/core/usecase/movie/get-movie.usecase';
import { GetTrendingMoviesUseCase } from 'src/core/usecase/movie/get-trending-movies.usecase';
import { SearchMoviesUseCase } from 'src/core/usecase/movie/search-movies.usecase';

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
        @Inject(GetMovieUseCase.providerName)
        private readonly getMovieUseCase: GetMovieUseCase,
        @Inject(GetTrendingMoviesUseCase.providerName)
        private readonly getTrendingMoviesUseCase: GetTrendingMoviesUseCase,
        @Inject(SearchMoviesUseCase.providerName)
        private readonly searchMoviesUseCase: SearchMoviesUseCase,
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

    @Get('trending')
    @ApiOperation({
        summary: 'Get trending movies',
        description: 'Retrieves a list of trending movies',
    })
    @ApiResponse({
        status: 200,
        description: 'Trending movies retrieved successfully',
        type: MovieSuccessResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: InternalServerErrorResponseDto,
    })
    async getTrendingMovies(@Query() trendingMovieDto: TrendingMovieDto): Promise<Movie[]> {
        return this.getTrendingMoviesUseCase.execute(trendingMovieDto.timeWindow);
    }

    @Get('search')
    @ApiOperation({
        summary: 'Search movies',
        description: 'Searches for movies based on a search keyword',
    })
    @ApiResponse({
        status: 200,
        description: 'Movies retrieved successfully',
        type: MovieSuccessResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: InternalServerErrorResponseDto,
    })
    async searchMovies(@Query() paginationDto: SearchMovieDto): Promise<PaginationType<Movie>> {
        return this.searchMoviesUseCase.execute(paginationDto.page, paginationDto.searchKeyword);
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

    @Get(':id')
    @ApiOperation({
        summary: 'Get movie details',
        description: 'Retrieves movie details by ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Movie details retrieved successfully',
        type: MovieDetailSuccessResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: InternalServerErrorResponseDto,
    })
    async getMovie(@Param('id') movieId: number): Promise<Movie> {
        return this.getMovieUseCase.execute(movieId);
    }
}
