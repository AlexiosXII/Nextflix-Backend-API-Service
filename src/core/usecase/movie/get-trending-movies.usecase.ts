import { Inject, Injectable, Logger } from '@nestjs/common';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import {
    MovieRepository,
    providerName as movieRepositoryProviderName,
} from 'src/core/domain/movie/repository/movie.repository.interface';
import { Movie } from 'src/core/domain/movie/entities/movie.entity';

@MethodTracer()
@Injectable()
export class GetTrendingMoviesUseCase {
    static readonly providerName = 'GetTrendingMoviesUseCase';
    private readonly logger = new Logger(GetTrendingMoviesUseCase.name);

    constructor(
        @Inject(movieRepositoryProviderName)
        private readonly movieRepository: MovieRepository,
    ) {}

    /**
     * Retrieves trending movies.
     * @returns {Promise<Movie[]>}
     */
    async execute(timeWindow: string): Promise<Movie[]> {
        const movies = await this.movieRepository.getTrendingMovies(timeWindow);
        return movies;
    }
}
