import { Inject, Injectable, Logger } from '@nestjs/common';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import {
    MovieRepository,
    providerName as movieRepositoryProviderName,
} from 'src/core/domain/movie/repository/movie.repository.interface';
import { Movie } from 'src/core/domain/movie/entities/movie.entity';

@MethodTracer()
@Injectable()
export class GetMovieUseCase {
    static readonly providerName = 'GetMovieUseCase';
    private readonly logger = new Logger(GetMovieUseCase.name);

    constructor(
        @Inject(movieRepositoryProviderName)
        private readonly movieRepository: MovieRepository,
    ) {}

    /**
     * Retrieves now playing movies.
     * @returns {Promise<PaginationType<Movie>>}
     */
    async execute(movieId: number): Promise<Movie> {
        const movie = await this.movieRepository.getMovieDetails(movieId);
        return movie;
    }
}
