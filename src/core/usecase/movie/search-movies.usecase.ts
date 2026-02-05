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
export class SearchMoviesUseCase {
    static readonly providerName = 'SearchMoviesUseCase';
    private readonly logger = new Logger(SearchMoviesUseCase.name);

    constructor(
        @Inject(movieRepositoryProviderName)
        private readonly movieRepository: MovieRepository,
    ) {}

    /**
     * Searches for movies based on a search keyword.
     * @returns {Promise<PaginationType<Movie>>}
     */
    async execute(page: number, searchKeyword: string): Promise<PaginationType<Movie>> {
        const movies = await this.movieRepository.searchMovies(page, searchKeyword);
        return movies;
    }
}
