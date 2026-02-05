import { Controller, Get, Inject, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiInternalServerErrorResponse, ApiHeader } from '@nestjs/swagger';
import { User } from 'src/core/domain/user/entities/user.entity';
import { InternalServerErrorResponseDto } from 'src/common/dto/error-response.dto';
import { GetGenresUseCase } from 'src/core/usecase/movie/get-genres.usecase';
import { Genre } from 'src/core/domain/movie/entities/genre.entity';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { GenreSuccessResponseDto } from './dto/movie.dto';

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
    ) {}

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
