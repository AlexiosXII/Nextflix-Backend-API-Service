import { PaginationType } from 'src/common/type/pagination.type';
import { Favorite } from '../entities/favorite.entiry';

export const providerName = 'FavoriteRepository';
/**
 * Interface representing a repository for managing favorites.
 */
export interface FavoriteRepository {
    /**
     * Adds a favorite item for a user.
     * @param userId - The ID of the user.
     * @param itemId - The ID of the item to be favorited.
     */
    addFavorite(userId: number, itemId: number): Promise<Favorite>;

    /**
     * Removes a favorite item for a user.
     * @param userId - The ID of the user.
     * @param itemId - The ID of the item to be removed from favorites.
     */
    removeFavorite(userId: number, itemId: number): Promise<void>;

    /**
     * Retrieves all favorite item IDs for a user.
     * @param userId - The ID of the user.
     * @returns A promise that resolves to an array of favorite items.
     */
    getFavoritesByUser(userId: number, page: number, pageSize: number): Promise<PaginationType<Favorite>>;
}
