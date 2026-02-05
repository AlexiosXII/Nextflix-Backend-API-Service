import { Test, TestingModule } from '@nestjs/testing';
import { GetTrendingMoviesUseCase } from './get-trending-movies.usecase';
import {
    MovieRepository,
    providerName as movieRepositoryProviderName,
} from 'src/core/domain/movie/repository/movie.repository.interface';
import { Movie } from 'src/core/domain/movie/entities/movie.entity';

describe('GetTrendingMoviesUseCase', () => {
    let useCase: GetTrendingMoviesUseCase;
    let movieRepository: jest.Mocked<MovieRepository>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetTrendingMoviesUseCase,
                {
                    provide: movieRepositoryProviderName,
                    useValue: {
                        getTrendingMovies: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get<GetTrendingMoviesUseCase>(GetTrendingMoviesUseCase);
        movieRepository = module.get<jest.Mocked<MovieRepository>>(movieRepositoryProviderName);
    });

    describe('execute', () => {
        it('should retrieve trending movies with given time window', async () => {
            const timeWindow = 'week';
            const mockMovies: Movie[] = [
                {
                    id: 1,
                    title: 'Movie 1',
                    overview: 'Overview 1',
                    posterPath: '/path/1.jpg',
                    releaseDate: '2026-01-01',
                    popularity: 8.5,
                } as Movie,
                {
                    id: 2,
                    title: 'Movie 2',
                    overview: 'Overview 2',
                    posterPath: '/path/2.jpg',
                    releaseDate: '2026-01-02',
                    popularity: 8.2,
                } as Movie,
            ];

            movieRepository.getTrendingMovies.mockResolvedValue(mockMovies);

            const result = await useCase.execute(timeWindow);

            expect(result).toEqual(mockMovies);
            expect(movieRepository.getTrendingMovies).toHaveBeenCalledWith(timeWindow);
            expect(movieRepository.getTrendingMovies).toHaveBeenCalledTimes(1);
        });

        it('should return empty array when no trending movies found', async () => {
            const timeWindow = 'month';
            movieRepository.getTrendingMovies.mockResolvedValue([]);

            const result = await useCase.execute(timeWindow);

            expect(result).toEqual([]);
            expect(movieRepository.getTrendingMovies).toHaveBeenCalledWith(timeWindow);
        });

        it('should propagate repository errors', async () => {
            const timeWindow = 'day';
            const error = new Error('Database connection failed');
            movieRepository.getTrendingMovies.mockRejectedValue(error);

            await expect(useCase.execute(timeWindow)).rejects.toThrow('Database connection failed');
            expect(movieRepository.getTrendingMovies).toHaveBeenCalledWith(timeWindow);
        });
    });
});
