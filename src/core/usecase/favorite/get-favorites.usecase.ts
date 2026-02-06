import { Inject, Injectable, Logger } from '@nestjs/common';
import bluebird from 'bluebird';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import { PaginationType } from 'src/common/type/pagination.type';
import { Favorite } from 'src/core/domain/favorite/entities/favorite.entiry';
import {
    FavoriteRepository,
    providerName as favoriteRepositoryProviderName,
} from 'src/core/domain/favorite/repository/favorite.repository.interface';
import { Movie } from 'src/core/domain/movie/entities/movie.entity';
import {
    MovieRepository,
    providerName as movieRepositoryProviderName,
} from 'src/core/domain/movie/repository/movie.repository.interface';

@MethodTracer()
@Injectable()
export class GetFavoritesUseCase {
    static readonly providerName = 'GetFavoritesUseCase';
    private readonly logger = new Logger(GetFavoritesUseCase.name);

    constructor(
        @Inject(favoriteRepositoryProviderName)
        private readonly favoriteRepository: FavoriteRepository,
        @Inject(movieRepositoryProviderName)
        private readonly movieRepository: MovieRepository,
    ) {}

    /**
     * Retrieves favorites for a user.
     * @returns {Promise<PaginationType<Movie>>}
     * @param userId - The ID of the user retrieving the favorites.
     */
    async execute(userId: number, page: number, pageSize: number): Promise<PaginationType<Movie>> {
        const favorites = await this.favoriteRepository.getFavoritesByUser(userId, page, pageSize);

        const movies: Movie[] = await bluebird.map(
            favorites.result,
            async (favorite: Favorite) => {
                return this.movieRepository.getMovieDetails(favorite.itemId);
            },
            { concurrency: 5 },
        );

        return {
            page: favorites.page,
            totalPages: favorites.totalPages,
            totalResults: favorites.totalResults,
            result: movies,
        };
    }
}
