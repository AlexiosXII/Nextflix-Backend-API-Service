import { Inject, Injectable, Logger } from '@nestjs/common';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import {
    MovieRepository,
    providerName as movieRepositoryProviderName,
} from 'src/core/domain/movie/repository/movie.repository.interface';
import { Movie } from 'src/core/domain/movie/entities/movie.entity';
import { PaginationType } from 'src/common/type/pagination.type';

@MethodTracer()
@Injectable()
export class GetMoviesUseCase {
    static readonly providerName = 'GetMoviesUseCase';
    private readonly logger = new Logger(GetMoviesUseCase.name);

    constructor(
        @Inject(movieRepositoryProviderName)
        private readonly movieRepository: MovieRepository,
    ) {}

    /**
     * Retrieves now playing movies.
     * @returns {Promise<PaginationType<Movie>>}
     */
    async execute(page: number): Promise<PaginationType<Movie>> {
        const movies = await this.movieRepository.getNowPlayingMovies(page);
        return movies;
    }
}
