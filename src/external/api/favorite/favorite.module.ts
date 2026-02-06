import { Module } from '@nestjs/common';
import { FavoriteController } from './controllers/favorite.controller';
import { PrismaService } from 'src/external/infrastructure/database/prisma.service';
import { AddFavoriteUseCase } from 'src/core/usecase/favorite/add-favorite.usecase';
import { FavoriteRepositoryImpl } from 'src/external/infrastructure/database/repositories/favorite/favorite.repository';
import { providerName as favoriteRepositoryProviderName } from 'src/core/domain/favorite/repository/favorite.repository.interface';
import { DeleteFavoriteUseCase } from 'src/core/usecase/favorite/delete-favorite.usecase';
import { GetFavoritesUseCase } from 'src/core/usecase/favorite/get-favorites.usecase';
import { MovieRepositoryImpl } from 'src/external/infrastructure/tmdb/repositories/movie/movie.repository';
import { providerName as movieRepositoryProviderName } from 'src/core/domain/movie/repository/movie.repository.interface';
import { TmdbService } from 'src/external/infrastructure/tmdb/tmdb.service';

@Module({
    controllers: [FavoriteController],
    providers: [
        PrismaService,
        TmdbService,
        { provide: AddFavoriteUseCase.providerName, useClass: AddFavoriteUseCase },
        { provide: DeleteFavoriteUseCase.providerName, useClass: DeleteFavoriteUseCase },
        { provide: GetFavoritesUseCase.providerName, useClass: GetFavoritesUseCase },
        { provide: favoriteRepositoryProviderName, useClass: FavoriteRepositoryImpl },
        { provide: movieRepositoryProviderName, useClass: MovieRepositoryImpl },
    ],
})
export class FavoriteModule {}
