import { Inject, Injectable, Logger } from '@nestjs/common';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import {
    FavoriteRepository,
    providerName as favoriteRepositoryProviderName,
} from 'src/core/domain/favorite/repository/favorite.repository.interface';

@MethodTracer()
@Injectable()
export class AddFavoriteUseCase {
    static readonly providerName = 'AddFavoriteUseCase';
    private readonly logger = new Logger(AddFavoriteUseCase.name);

    constructor(
        @Inject(favoriteRepositoryProviderName)
        private readonly favoriteRepository: FavoriteRepository,
    ) {}

    /**
     * Adds a favorite.
     * @returns {Promise<boolean>}
     * @param userId - The ID of the user adding the favorite.
     * @param favoriteId - The ID of the item to be favorited.
     */
    async execute(userId: number, favoriteId: number): Promise<boolean> {
        const result = await this.favoriteRepository.addFavorite(userId, favoriteId);
        return !!result;
    }
}
