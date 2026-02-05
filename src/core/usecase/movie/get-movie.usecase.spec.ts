import { Test, TestingModule } from '@nestjs/testing';
import { GetMovieUseCase } from './get-movie.usecase';
import { providerName as movieRepositoryProviderName } from 'src/core/domain/movie/repository/movie.repository.interface';
import { Movie } from 'src/core/domain/movie/entities/movie.entity';

describe('GetMovieUseCase', () => {
    let useCase: GetMovieUseCase;
    let movieRepositoryMock: { getMovieDetails: jest.Mock };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetMovieUseCase,
                {
                    provide: movieRepositoryProviderName,
                    useValue: { getMovieDetails: jest.fn() },
                },
            ],
        }).compile();

        useCase = module.get<GetMovieUseCase>(GetMovieUseCase);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        movieRepositoryMock = module.get<any>(movieRepositoryProviderName);
    });

    it('should return movie details when repository returns data', async () => {
        const movieId = 123;
        const sampleMovie: Movie = {
            id: movieId,
            title: 'Test Movie',
            posterPath: '/test-poster.jpg',
            overview: 'A test movie overview',
            releaseDate: '2026-01-01',
            popularity: 8.5,
        };
        movieRepositoryMock.getMovieDetails.mockResolvedValue(sampleMovie);

        const result = await useCase.execute(movieId);

        expect(result).toBe(sampleMovie);
        expect(movieRepositoryMock.getMovieDetails).toHaveBeenCalledWith(movieId);
    });

    it('should pass the correct movieId to the repository', async () => {
        const movieId = 456;
        const sampleMovie: Movie = {
            id: movieId,
            title: 'Another Test Movie',
            posterPath: '/another-poster.jpg',
            overview: 'Another test movie overview',
            releaseDate: '2026-02-01',
            popularity: 7.8,
        };
        movieRepositoryMock.getMovieDetails.mockResolvedValue(sampleMovie);

        await useCase.execute(movieId);

        expect(movieRepositoryMock.getMovieDetails).toHaveBeenCalledTimes(1);
        expect(movieRepositoryMock.getMovieDetails).toHaveBeenCalledWith(movieId);
    });

    it('should propagate errors from the repository', async () => {
        const movieId = 999;
        const error = new Error('Movie not found');
        movieRepositoryMock.getMovieDetails.mockRejectedValue(error);

        await expect(useCase.execute(movieId)).rejects.toThrow('Movie not found');
        expect(movieRepositoryMock.getMovieDetails).toHaveBeenCalledWith(movieId);
    });
});
