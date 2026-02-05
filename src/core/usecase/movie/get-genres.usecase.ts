import { Inject, Injectable, Logger } from '@nestjs/common';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import { ApplicationError } from 'src/common/errors/application.error';
import { GenreError } from 'src/core/domain/movie/error/genre.error';
import {
    GenreRepository,
    providerName as genreRepositoryProviderName,
} from 'src/core/domain/movie/repository/genre.repository.interface';
import { Genre } from 'src/core/domain/movie/entities/genre.entity';

@MethodTracer()
@Injectable()
export class GetGenresUseCase {
    static readonly providerName = 'GetGenresUseCase';
    private readonly logger = new Logger(GetGenresUseCase.name);

    constructor(
        @Inject(genreRepositoryProviderName)
        private readonly genreRepository: GenreRepository,
    ) {}

    /**
     * Retrieves all genres.
     * @returns {Promise<Genre[]>}
     */
    async execute(): Promise<Genre[]> {
        const genres = await this.genreRepository.getGenres();
        if (!genres || genres.length === 0) {
            throw new ApplicationError(GenreError.GENRES_NOT_FOUND);
        }
        return genres;
    }
}
