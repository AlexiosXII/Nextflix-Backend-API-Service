import { Module } from '@nestjs/common';
import { MovieController } from './controllers/movie.controller';
import { GetGenresUseCase } from 'src/core/usecase/movie/get-genres.usecase';
import { providerName as genreRepositoryProviderName } from 'src/core/domain/movie/repository/genre.repository.interface';
import { TmdbService } from 'src/external/infrastructure/tmdb/tmdb.service';
import { GenreRepositoryImpl } from 'src/external/infrastructure/tmdb/repositories/genre/genre.repository';

@Module({
    controllers: [MovieController],
    providers: [
        TmdbService,
        { provide: GetGenresUseCase.providerName, useClass: GetGenresUseCase },
        { provide: genreRepositoryProviderName, useClass: GenreRepositoryImpl },
    ],
})
export class MovieModule {}
