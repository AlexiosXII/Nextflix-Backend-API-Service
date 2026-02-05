import { Test, TestingModule } from '@nestjs/testing';
import { SearchMoviesUseCase } from './search-movies.usecase';
import {
    MovieRepository,
    providerName as movieRepositoryProviderName,
} from 'src/core/domain/movie/repository/movie.repository.interface';
import { Movie } from 'src/core/domain/movie/entities/movie.entity';
import { PaginationType } from 'src/common/type/pagination.type';

describe('SearchMoviesUseCase', () => {
    let useCase: SearchMoviesUseCase;
    let movieRepository: jest.Mocked<MovieRepository>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SearchMoviesUseCase,
                {
                    provide: movieRepositoryProviderName,
                    useValue: {
                        searchMovies: jest.fn(),
                    },
                },
            ],
        }).compile();

        useCase = module.get<SearchMoviesUseCase>(SearchMoviesUseCase);
        movieRepository = module.get(movieRepositoryProviderName) as jest.Mocked<MovieRepository>;
    });

    describe('execute', () => {
        it('should search movies for given page and keyword', async () => {
            // Arrange
            const page = 1;
            const keyword = 'action';
            const mockMovies: PaginationType<Movie> = {
                page: 1,
                totalPages: 3,
                totalResults: 30,
                result: [
                    {
                        id: 10,
                        title: 'Action Movie 1',
                        overview: 'Overview 1',
                        posterPath: '/poster1.jpg',
                        releaseDate: '2026-01-01',
                        popularity: 7.5,
                    },
                ],
            };

            movieRepository.searchMovies.mockResolvedValue(mockMovies);

            // Act
            const result = await useCase.execute(page, keyword);

            // Assert
            expect(result).toEqual(mockMovies);
            expect(movieRepository.searchMovies).toHaveBeenCalledWith(page, keyword);
            expect(movieRepository.searchMovies).toHaveBeenCalledTimes(1);
        });

        it('should handle pagination for different pages and keywords', async () => {
            // Arrange
            const page = 2;
            const keyword = 'drama';
            const mockMovies: PaginationType<Movie> = {
                page: 2,
                totalPages: 5,
                totalResults: 50,
                result: [
                    {
                        id: 20,
                        title: 'Drama Movie 2',
                        overview: 'Overview 2',
                        posterPath: '/poster2.jpg',
                        releaseDate: '2026-02-02',
                        popularity: 8.2,
                    },
                ],
            };

            movieRepository.searchMovies.mockResolvedValue(mockMovies);

            // Act
            const result = await useCase.execute(page, keyword);

            // Assert
            expect(result.page).toBe(2);
            expect(movieRepository.searchMovies).toHaveBeenCalledWith(page, keyword);
        });

        it('should return empty data when no movies match the keyword', async () => {
            // Arrange
            const page = 1;
            const keyword = 'nomatch';
            const mockEmptyMovies: PaginationType<Movie> = {
                page: 1,
                totalPages: 0,
                totalResults: 0,
                result: [],
            };

            movieRepository.searchMovies.mockResolvedValue(mockEmptyMovies);

            // Act
            const result = await useCase.execute(page, keyword);

            // Assert
            expect(result.result).toHaveLength(0);
            expect(movieRepository.searchMovies).toHaveBeenCalledWith(page, keyword);
        });

        it('should propagate repository errors', async () => {
            // Arrange
            const page = 1;
            const keyword = 'action';
            const error = new Error('Repository failure');
            movieRepository.searchMovies.mockRejectedValue(error);

            // Act & Assert
            await expect(useCase.execute(page, keyword)).rejects.toThrow('Repository failure');
            expect(movieRepository.searchMovies).toHaveBeenCalledWith(page, keyword);
        });
    });

    describe('SearchMoviesUseCase', () => {
        it('should be defined', () => {
            expect(useCase).toBeDefined();
        });

        it('should have providerName static property', () => {
            expect(SearchMoviesUseCase.providerName).toBe('SearchMoviesUseCase');
        });
    });
});
