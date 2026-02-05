// src/core/usecase/movie/get-genres.usecase.test.ts
import { Test, TestingModule } from '@nestjs/testing';
import { GetGenresUseCase } from './get-genres.usecase';
import { providerName as genreRepositoryProviderName } from 'src/core/domain/movie/repository/genre.repository.interface';
import { Genre } from 'src/core/domain/movie/entities/genre.entity';
import { ApplicationError } from 'src/common/errors/application.error';
import { GenreError } from 'src/core/domain/movie/error/genre.error';

describe('GetGenresUseCase', () => {
    let useCase: GetGenresUseCase;
    let genreRepositoryMock: { getGenres: jest.Mock };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetGenresUseCase,
                {
                    provide: genreRepositoryProviderName,
                    useValue: { getGenres: jest.fn() },
                },
            ],
        }).compile();

        useCase = module.get<GetGenresUseCase>(GetGenresUseCase);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        genreRepositoryMock = module.get<any>(genreRepositoryProviderName);
    });

    it('should return genres when repository returns data', async () => {
        const sampleGenres: Genre[] = [{ id: 1, name: 'Action' } as any];
        genreRepositoryMock.getGenres.mockResolvedValue(sampleGenres);

        await expect(useCase.execute()).resolves.toBe(sampleGenres);
        expect(genreRepositoryMock.getGenres).toHaveBeenCalled();
    });

    it('should throw ApplicationError when no genres found (empty array)', async () => {
        genreRepositoryMock.getGenres.mockResolvedValue([]);

        try {
            await useCase.execute();
            // if no error thrown, fail the test
            throw new Error('Expected ApplicationError to be thrown');
        } catch (err) {
            expect(err).toBeInstanceOf(ApplicationError);
            expect((err as Error).message).toBe(GenreError.GENRES_NOT_FOUND);
            expect(genreRepositoryMock.getGenres).toHaveBeenCalled();
        }
    });

    it('should throw ApplicationError when no genres found (null)', async () => {
        genreRepositoryMock.getGenres.mockResolvedValue(null);

        try {
            await useCase.execute();
            throw new Error('Expected ApplicationError to be thrown');
        } catch (err) {
            expect(err).toBeInstanceOf(ApplicationError);
            expect((err as Error).message).toBe(GenreError.GENRES_NOT_FOUND);
            expect(genreRepositoryMock.getGenres).toHaveBeenCalled();
        }
    });
});
