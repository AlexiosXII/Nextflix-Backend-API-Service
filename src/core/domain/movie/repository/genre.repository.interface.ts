import { Genre } from '../entities/genre.entity';

export const providerName = 'GenreRepository';
/**
 * Interface representing a repository for managing movies.
 */
export interface GenreRepository {
    /**
     * Retrieves movies by genre.
     * @param genre - The genre of the movies.
     * @returns A promise that resolves to an array of genres.
     */
    getGenres(): Promise<Genre[]>;
}
