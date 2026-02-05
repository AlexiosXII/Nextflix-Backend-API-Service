import { Injectable, Logger } from '@nestjs/common';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import { Genre } from 'src/core/domain/movie/entities/genre.entity';
import { GenreRepository } from 'src/core/domain/movie/repository/genre.repository.interface';
import { TmdbService } from '../../tmdb.service';
import { AxiosInstance } from 'node_modules/axios/index.cjs';
import { TmdbGenre } from '../../type/genre';
import { EndpointConfig } from '../../tmdb.config';

@MethodTracer()
@Injectable()
export class GenreRepositoryImpl implements GenreRepository {
    private readonly logger = new Logger(GenreRepositoryImpl.name);

    private instance: AxiosInstance;
    constructor(private tmdbService: TmdbService) {
        this.instance = this.tmdbService.getInstance();
    }

    /**
     * Retrieves movies by genre.
     * @param genre - The genre of the movies.
     * @returns A promise that resolves to an array of genres.
     */
    async getGenres(): Promise<Genre[]> {
        const res: { data: { genres: TmdbGenre[] } } = await this.instance.get(EndpointConfig.GenresEndpoint);
        return res.data.genres.map((genre) => ({
            id: genre.id,
            name: genre.name,
        }));
    }
}
