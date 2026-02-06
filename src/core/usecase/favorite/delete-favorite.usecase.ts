import { Inject, Injectable, Logger } from '@nestjs/common';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import {
    FavoriteRepository,
    providerName as favoriteRepositoryProviderName,
} from 'src/core/domain/favorite/repository/favorite.repository.interface';

@MethodTracer()
@Injectable()
export class DeleteFavoriteUseCase {
    static readonly providerName = 'DeleteFavoriteUseCase';
    private readonly logger = new Logger(DeleteFavoriteUseCase.name);

    constructor(
        @Inject(favoriteRepositoryProviderName)
        private readonly favoriteRepository: FavoriteRepository,
    ) {}

    /**
     * Deletes a favorite.
     * @returns {Promise<boolean>}
     * @param userId - The ID of the user deleting the favorite.
     * @param favoriteId - The ID of the item to be unfavorited.
     */
    async execute(userId: number, favoriteId: number): Promise<boolean> {
        await this.favoriteRepository.removeFavorite(userId, favoriteId);
        return true;
    }
}
