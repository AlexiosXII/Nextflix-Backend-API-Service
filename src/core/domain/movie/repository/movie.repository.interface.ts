import { PaginationType } from 'src/common/type/pagination.type';
import { Movie } from '../entities/movie.entity';

export const providerName = 'MovieRepositoryInterface';

/**
 * Interface representing a repository for managing movies.
 */
export interface MovieRepository {
    /**
     * Retrieves now playing movies.
     * @returns A promise that resolves to an array of movies.
     */
    getNowPlayingMovies(page: number): Promise<PaginationType<Movie>>;

    /**
     * Retrieves trending movies.
     * @returns A promise that resolves to an array of movies.
     */
    getTrendingMovies(): Promise<PaginationType<Movie>>;

    /**
     * Searches for movies based on a query.
     * @param query - The search query.
     * @returns A promise that resolves to an array of movies.
     */
    searchMovies(query: string): Promise<PaginationType<Movie>>;

    /**
     * Retrieves movie details by ID.
     * @param movieId - The ID of the movie.
     * @returns A promise that resolves to the movie details.
     */
    getMovieDetails(movieId: number): Promise<Movie>;
}
