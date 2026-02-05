import { Test, TestingModule } from '@nestjs/testing';
import { MovieRepositoryImpl } from './movie.repository';
import { TmdbService } from '../../tmdb.service';
import { AxiosInstance } from 'axios';
import { Movie } from 'src/core/domain/movie/entities/movie.entity';
import { PaginationType } from 'src/common/type/pagination.type';

describe('MovieRepositoryImpl', () => {
    let repository: MovieRepositoryImpl;
    let tmdbService: TmdbService;
    let axiosInstance: jest.Mocked<AxiosInstance>;

    const mockMovie = {
        id: 1,
        title: 'Test Movie',
        poster_path: '/test-poster.jpg',
        overview: 'Test overview',
        release_date: '2024-01-01',
        popularity: 100.5,
    };

    const mockTmdbResponse = {
        page: 1,
        results: [mockMovie],
        total_pages: 10,
        total_results: 200,
    };

    const expectedMovie: Movie = {
        id: 1,
        title: 'Test Movie',
        posterPath: '/test-poster.jpg',
        overview: 'Test overview',
        releaseDate: '2024-01-01',
        popularity: 100.5,
    };

    beforeEach(async () => {
        axiosInstance = {
            get: jest.fn(),
        } as any;

        const mockTmdbService = {
            getInstance: jest.fn().mockReturnValue(axiosInstance),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MovieRepositoryImpl,
                {
                    provide: TmdbService,
                    useValue: mockTmdbService,
                },
            ],
        }).compile();

        repository = module.get<MovieRepositoryImpl>(MovieRepositoryImpl);
        tmdbService = module.get<TmdbService>(TmdbService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getNowPlayingMovies', () => {
        it('should return paginated now playing movies', async () => {
            axiosInstance.get.mockResolvedValue({ data: mockTmdbResponse });

            const result: PaginationType<Movie> = await repository.getNowPlayingMovies(1);

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('now_playing'));
            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('page=1'));
            expect(result).toEqual({
                page: 1,
                totalPages: 10,
                totalResults: 200,
                result: [expectedMovie],
            });
        });

        it('should handle multiple movies in response', async () => {
            const multipleMockResponse = {
                ...mockTmdbResponse,
                results: [mockMovie, { ...mockMovie, id: 2, title: 'Test Movie 2' }],
            };
            axiosInstance.get.mockResolvedValue({ data: multipleMockResponse });

            const result = await repository.getNowPlayingMovies(2);

            expect(result.result).toHaveLength(2);
            expect(result.page).toBe(2);
            expect(result.result[0]).toEqual(expectedMovie);
            expect(result.result[1].id).toBe(2);
        });

        it('should handle empty results', async () => {
            const emptyResponse = {
                page: 1,
                results: [],
                total_pages: 0,
                total_results: 0,
            };
            axiosInstance.get.mockResolvedValue({ data: emptyResponse });

            const result = await repository.getNowPlayingMovies(1);

            expect(result.result).toEqual([]);
            expect(result.totalResults).toBe(0);
        });

        it('should throw error when API call fails', async () => {
            axiosInstance.get.mockRejectedValue(new Error('API Error'));

            await expect(repository.getNowPlayingMovies(1)).rejects.toThrow('API Error');
        });
    });

    describe('getTrendingMovies', () => {
        it('should return trending movies for day time window', async () => {
            axiosInstance.get.mockResolvedValue({ data: mockTmdbResponse });

            const result = await repository.getTrendingMovies('day');

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('trending'));
            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('day'));
            expect(result).toEqual([expectedMovie]);
        });

        it('should return trending movies for week time window', async () => {
            axiosInstance.get.mockResolvedValue({ data: mockTmdbResponse });

            const result = await repository.getTrendingMovies('week');

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('week'));
            expect(result).toEqual([expectedMovie]);
        });

        it('should handle multiple trending movies', async () => {
            const multipleMockResponse = {
                ...mockTmdbResponse,
                results: [
                    mockMovie,
                    { ...mockMovie, id: 2, title: 'Trending Movie 2' },
                    { ...mockMovie, id: 3, title: 'Trending Movie 3' },
                ],
            };
            axiosInstance.get.mockResolvedValue({ data: multipleMockResponse });

            const result = await repository.getTrendingMovies('day');

            expect(result).toHaveLength(3);
            expect(result[0]).toEqual(expectedMovie);
        });

        it('should throw error when API call fails', async () => {
            axiosInstance.get.mockRejectedValue(new Error('Network Error'));

            await expect(repository.getTrendingMovies('day')).rejects.toThrow('Network Error');
        });
    });

    describe('searchMovies', () => {
        it('should return paginated search results', async () => {
            axiosInstance.get.mockResolvedValue({ data: mockTmdbResponse });

            const result = await repository.searchMovies(1, 'test query');

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('search'));
            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('query=test%20query'));
            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('page=1'));
            expect(result).toEqual({
                page: 1,
                totalPages: 10,
                totalResults: 200,
                result: [expectedMovie],
            });
        });

        it('should encode special characters in search query', async () => {
            axiosInstance.get.mockResolvedValue({ data: mockTmdbResponse });

            await repository.searchMovies(1, 'test & special');

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('test%20%26%20special'));
        });

        it('should handle different page numbers', async () => {
            axiosInstance.get.mockResolvedValue({
                data: { ...mockTmdbResponse, page: 3 },
            });

            const result = await repository.searchMovies(3, 'avengers');

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('page=3'));
            expect(result.page).toBe(3);
        });

        it('should return empty results for no matches', async () => {
            const emptyResponse = {
                page: 1,
                results: [],
                total_pages: 0,
                total_results: 0,
            };
            axiosInstance.get.mockResolvedValue({ data: emptyResponse });

            const result = await repository.searchMovies(1, 'nonexistent');

            expect(result.result).toEqual([]);
            expect(result.totalResults).toBe(0);
        });

        it('should throw error when API call fails', async () => {
            axiosInstance.get.mockRejectedValue(new Error('Search Failed'));

            await expect(repository.searchMovies(1, 'test')).rejects.toThrow('Search Failed');
        });
    });

    describe('getMovieDetails', () => {
        const mockMovieDetails = {
            id: 1,
            title: 'Test Movie',
            poster_path: '/test-poster.jpg',
            overview: 'Test overview',
            release_date: '2024-01-01',
            popularity: 100.5,
        };

        it('should return movie details by ID', async () => {
            axiosInstance.get.mockResolvedValue({ data: mockMovieDetails });

            const result = await repository.getMovieDetails(1);

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('movie/1'));
            expect(result).toEqual(expectedMovie);
        });

        it('should handle different movie IDs', async () => {
            const differentMovie = { ...mockMovieDetails, id: 999 };
            axiosInstance.get.mockResolvedValue({ data: differentMovie });

            const result = await repository.getMovieDetails(999);

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('999'));
            expect(result.id).toBe(999);
        });

        it('should properly transform TMDB response to Movie entity', async () => {
            axiosInstance.get.mockResolvedValue({ data: mockMovieDetails });

            const result = await repository.getMovieDetails(1);

            expect(result).toHaveProperty('posterPath');
            expect(result).toHaveProperty('releaseDate');
            expect(result).not.toHaveProperty('poster_path');
            expect(result).not.toHaveProperty('release_date');
        });

        it('should throw error when movie not found', async () => {
            axiosInstance.get.mockRejectedValue(new Error('Movie not found'));

            await expect(repository.getMovieDetails(99999)).rejects.toThrow('Movie not found');
        });

        it('should throw error when API call fails', async () => {
            axiosInstance.get.mockRejectedValue(new Error('API Error'));

            await expect(repository.getMovieDetails(1)).rejects.toThrow('API Error');
        });
    });

    describe('constructor and initialization', () => {
        it('should initialize with TmdbService instance', () => {
            expect(repository).toBeDefined();
            expect(tmdbService.getInstance).toHaveBeenCalled();
        });
    });
});
