import { Test, TestingModule } from '@nestjs/testing';
import { GenreRepositoryImpl } from './genre.repository';
import { TmdbService } from '../../tmdb.service';

describe('GenreRepositoryImpl', () => {
    let repository: GenreRepositoryImpl;
    let mockTmdbService: any;
    let mockInstance: any;

    beforeEach(async () => {
        mockInstance = { get: jest.fn() };
        mockTmdbService = { getInstance: jest.fn().mockReturnValue(mockInstance) };

        const module: TestingModule = await Test.createTestingModule({
            providers: [GenreRepositoryImpl, { provide: TmdbService, useValue: mockTmdbService }],
        }).compile();

        repository = module.get<GenreRepositoryImpl>(GenreRepositoryImpl);
    });

    it('should fetch and map genres from TMDB', async () => {
        const tmdbGenres = [
            { id: 1, name: 'Action' },
            { id: 2, name: 'Comedy' },
        ];
        mockInstance.get.mockResolvedValue({ data: { genres: tmdbGenres } });

        const result = await repository.getGenres();

        expect(result).toEqual([
            { id: 1, name: 'Action' },
            { id: 2, name: 'Comedy' },
        ]);
        expect(mockInstance.get).toHaveBeenCalledTimes(1);
        expect(mockInstance.get).toHaveBeenCalledWith('/genre/movie/list');
    });
});
