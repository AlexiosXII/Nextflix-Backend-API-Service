import { Module } from '@nestjs/common';
import { MovieController } from './controllers/movie.controller';
import { GetGenresUseCase } from 'src/core/usecase/movie/get-genres.usecase';
import { providerName as genreRepositoryProviderName } from 'src/core/domain/movie/repository/genre.repository.interface';
import { providerName as movieRepositoryProviderName } from 'src/core/domain/movie/repository/movie.repository.interface';
import { TmdbService } from 'src/external/infrastructure/tmdb/tmdb.service';
import { GenreRepositoryImpl } from 'src/external/infrastructure/tmdb/repositories/genre/genre.repository';
import { GetMoviesUseCase } from 'src/core/usecase/movie/get-movies.usecase';
import { MovieRepositoryImpl } from 'src/external/infrastructure/tmdb/repositories/movie/movie.repository';
import { GetMovieUseCase } from 'src/core/usecase/movie/get-movie.usecase';
import { GetTrendingMoviesUseCase } from 'src/core/usecase/movie/get-trending-movies.usecase';
import { SearchMoviesUseCase } from 'src/core/usecase/movie/search-movies.usecase';

@Module({
    controllers: [MovieController],
    providers: [
        TmdbService,
        { provide: GetGenresUseCase.providerName, useClass: GetGenresUseCase },
        { provide: GetMoviesUseCase.providerName, useClass: GetMoviesUseCase },
        { provide: GetMovieUseCase.providerName, useClass: GetMovieUseCase },
        { provide: GetTrendingMoviesUseCase.providerName, useClass: GetTrendingMoviesUseCase },
        { provide: SearchMoviesUseCase.providerName, useClass: SearchMoviesUseCase },
        { provide: genreRepositoryProviderName, useClass: GenreRepositoryImpl },
        { provide: movieRepositoryProviderName, useClass: MovieRepositoryImpl },
    ],
})
export class MovieModule {}
