import { Test, TestingModule } from '@nestjs/testing';
import { GetMoviesUseCase } from './get-movies.usecase';
import {
    MovieRepository,
    providerName as movieRepositoryProviderName,
} from 'src/core/domain/movie/repository/movie.repository.interface';
import { Movie } from 'src/core/domain/movie/entities/movie.entity';
import { PaginationType } from 'src/common/type/pagination.type';

describe('GetMoviesUseCase', () => {
    let useCase: GetMoviesUseCase;
    let movieRepository: jest.Mocked<MovieRepository>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetMoviesUseCase,
                {
                    provide: movieRepositoryProviderName,
                    useValue: {
                        getNowPlayingMovies: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get<GetMoviesUseCase>(GetMoviesUseCase);
        movieRepository = module.get(movieRepositoryProviderName) as jest.Mocked<MovieRepository>;
    });

    describe('execute', () => {
        it('should retrieve now playing movies for given page', async () => {
            // Arrange
            const page = 1;
            const mockMovies: PaginationType<Movie> = {
                page: 1,
                totalPages: 10,
                totalResults: 100,
                result: [
                    {
                        id: 1,
                        title: 'Test Movie 1',
                        overview: 'Overview 1',
                        posterPath: '/poster1.jpg',
                        releaseDate: '2026-01-01',
                        popularity: 8.5,
                    },
                    {
                        id: 2,
                        title: 'Test Movie 2',
                        overview: 'Overview 2',
                        posterPath: '/poster2.jpg',
                        releaseDate: '2026-01-02',
                        popularity: 7.8,
                    },
                ],
            };

            movieRepository.getNowPlayingMovies.mockResolvedValue(mockMovies);

            // Act
            const result = await useCase.execute(page);

            // Assert
            expect(result).toEqual(mockMovies);
            expect(movieRepository.getNowPlayingMovies).toHaveBeenCalledWith(page);
            expect(movieRepository.getNowPlayingMovies).toHaveBeenCalledTimes(1);
        });

        it('should handle pagination correctly for different pages', async () => {
            // Arrange
            const page = 2;
            const mockMovies: PaginationType<Movie> = {
                page: 2,
                totalPages: 10,
                totalResults: 100,
                result: [
                    {
                        id: 11,
                        title: 'Test Movie 11',
                        overview: 'Overview 11',
                        posterPath: '/poster11.jpg',
                        releaseDate: '2026-02-01',
                        popularity: 8.2,
                    },
                ],
            };

            movieRepository.getNowPlayingMovies.mockResolvedValue(mockMovies);

            // Act
            const result = await useCase.execute(page);

            // Assert
            expect(result.page).toBe(2);
            expect(movieRepository.getNowPlayingMovies).toHaveBeenCalledWith(page);
        });

        it('should return empty data when no movies are available', async () => {
            // Arrange
            const page = 100;
            const mockEmptyMovies: PaginationType<Movie> = {
                page: 100,
                totalPages: 10,
                totalResults: 0,
                result: [],
            };

            movieRepository.getNowPlayingMovies.mockResolvedValue(mockEmptyMovies);

            // Act
            const result = await useCase.execute(page);

            // Assert
            expect(result.result).toHaveLength(0);
            expect(movieRepository.getNowPlayingMovies).toHaveBeenCalledWith(page);
        });

        it('should propagate repository errors', async () => {
            // Arrange
            const page = 1;
            const error = new Error('Database connection failed');
            movieRepository.getNowPlayingMovies.mockRejectedValue(error);

            // Act & Assert
            await expect(useCase.execute(page)).rejects.toThrow('Database connection failed');
            expect(movieRepository.getNowPlayingMovies).toHaveBeenCalledWith(page);
        });
    });

    describe('GetMoviesUseCase', () => {
        it('should be defined', () => {
            expect(useCase).toBeDefined();
        });

        it('should have providerName static property', () => {
            expect(GetMoviesUseCase.providerName).toBe('GetMoviesUseCase');
        });
    });
});
