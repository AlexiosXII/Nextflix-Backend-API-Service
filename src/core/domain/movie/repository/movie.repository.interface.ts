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
    getTrendingMovies(timeWindow: string): Promise<Movie[]>;

    /**
     * Searches for movies based on a search keyword.
     * @param page - The page number.
     * @param searchKeyword - The search keyword.
     * @returns A promise that resolves to an array of movies.
     */
    searchMovies(page: number, searchKeyword: string): Promise<PaginationType<Movie>>;

    /**
     * Retrieves movie details by ID.
     * @param movieId - The ID of the movie.
     * @returns A promise that resolves to the movie details.
     */
    getMovieDetails(movieId: number): Promise<Movie>;
}
