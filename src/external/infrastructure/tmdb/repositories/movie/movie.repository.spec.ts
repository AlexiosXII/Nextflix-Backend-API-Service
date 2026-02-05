import { Test, TestingModule } from '@nestjs/testing';
import { MovieRepositoryImpl } from './movie.repository';
import { TmdbService } from '../../tmdb.service';
import { EndpointConfig } from '../../tmdb.config';

describe('MovieRepositoryImpl', () => {
    let repository: MovieRepositoryImpl;
    let mockTmdbService: { getInstance: jest.Mock };
    let mockInstance: { get: jest.Mock };

    beforeEach(async () => {
        mockInstance = { get: jest.fn() };
        mockTmdbService = { getInstance: jest.fn().mockReturnValue(mockInstance) };

        const module: TestingModule = await Test.createTestingModule({
            providers: [MovieRepositoryImpl, { provide: TmdbService, useValue: mockTmdbService }],
        }).compile();

        repository = module.get<MovieRepositoryImpl>(MovieRepositoryImpl);
    });

    it('should fetch and map now playing movies with pagination', async () => {
        mockInstance.get.mockResolvedValue({
            data: {
                results: [
                    {
                        id: 10,
                        title: 'Now Playing',
                        poster_path: '/poster.png',
                        overview: 'Overview',
                        release_date: '2026-02-01',
                        popularity: 9.5,
                    },
                ],
                total_pages: 3,
                total_results: 25,
            },
        });

        const result = await repository.getNowPlayingMovies(2);

        expect(result).toEqual({
            page: 2,
            totalPages: 3,
            totalResults: 25,
            result: [
                {
                    id: 10,
                    title: 'Now Playing',
                    posterPath: '/poster.png',
                    overview: 'Overview',
                    releaseDate: '2026-02-01',
                    popularity: 9.5,
                },
            ],
        });
        expect(mockInstance.get).toHaveBeenCalledTimes(1);
        expect(mockInstance.get).toHaveBeenCalledWith(`${EndpointConfig.NowPlayingMoviesEndpoint}?page=2`);
    });

    it('should fetch and map trending movies', async () => {
        mockInstance.get.mockResolvedValue({
            data: {
                results: [
                    {
                        id: 20,
                        title: 'Trending',
                        poster_path: '/trending.png',
                        overview: 'Trending overview',
                        release_date: '2026-01-15',
                        popularity: 8.1,
                    },
                ],
            },
        });

        const result = await repository.getTrendingMovies('day');

        expect(result).toEqual([
            {
                id: 20,
                title: 'Trending',
                posterPath: '/trending.png',
                overview: 'Trending overview',
                releaseDate: '2026-01-15',
                popularity: 8.1,
            },
        ]);
        expect(mockInstance.get).toHaveBeenCalledTimes(1);
        expect(mockInstance.get).toHaveBeenCalledWith(
            EndpointConfig.TrendingMoviesEndpoint.replace('{time_window}', 'day'),
        );
    });

    it('should search and map movies with encoded query and pagination', async () => {
        mockInstance.get.mockResolvedValue({
            data: {
                results: [
                    {
                        id: 30,
                        title: 'Star Battles',
                        poster_path: '/search.png',
                        overview: 'Search overview',
                        release_date: '2025-12-01',
                        popularity: 7.2,
                    },
                ],
                total_pages: 1,
                total_results: 1,
            },
        });

        const result = await repository.searchMovies(1, 'star wars');

        expect(result).toEqual({
            page: 1,
            totalPages: 1,
            totalResults: 1,
            result: [
                {
                    id: 30,
                    title: 'Star Battles',
                    posterPath: '/search.png',
                    overview: 'Search overview',
                    releaseDate: '2025-12-01',
                    popularity: 7.2,
                },
            ],
        });
        expect(mockInstance.get).toHaveBeenCalledTimes(1);
        expect(mockInstance.get).toHaveBeenCalledWith(
            `${EndpointConfig.SearchMoviesEndpoint}?query=${encodeURIComponent('star wars')}&page=1`,
        );
    });

    it('should fetch and map movie details', async () => {
        mockInstance.get.mockResolvedValue({
            data: {
                id: 40,
                title: 'Details',
                poster_path: '/details.png',
                overview: 'Details overview',
                release_date: '2026-02-06',
                popularity: 6.4,
            },
        });

        const result = await repository.getMovieDetails(40);

        expect(result).toEqual({
            id: 40,
            title: 'Details',
            posterPath: '/details.png',
            overview: 'Details overview',
            releaseDate: '2026-02-06',
            popularity: 6.4,
        });
        expect(mockInstance.get).toHaveBeenCalledTimes(1);
        expect(mockInstance.get).toHaveBeenCalledWith(EndpointConfig.MovieDetailsEndpoint.replace('{movie_id}', '40'));
    });
});
