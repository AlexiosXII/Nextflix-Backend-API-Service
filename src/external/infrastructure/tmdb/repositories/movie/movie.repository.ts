import { Injectable, Logger } from '@nestjs/common';
import { AxiosInstance } from 'node_modules/axios/index.cjs';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import { Movie } from 'src/core/domain/movie/entities/movie.entity';
import { MovieRepository } from 'src/core/domain/movie/repository/movie.repository.interface';
import { TmdbService } from '../../tmdb.service';
import { EndpointConfig } from '../../tmdb.config';
import { MovieDetailsResponse, MovieListResponse } from '../../type/movie';
import { PaginationType } from 'src/common/type/pagination.type';

export const providerName = 'MovieRepositoryInterface';

/**
 * Interface representing a repository for managing movies.
 */
@MethodTracer()
@Injectable()
export class MovieRepositoryImpl implements MovieRepository {
    private readonly logger = new Logger(MovieRepositoryImpl.name);

    private instance: AxiosInstance;
    constructor(private tmdbService: TmdbService) {
        this.instance = this.tmdbService.getInstance();
    }
    /**
     * Retrieves now playing movies.
     * @returns A promise that resolves to an array of movies.
     */
    async getNowPlayingMovies(page: number): Promise<PaginationType<Movie>> {
        const res: { data: MovieListResponse } = await this.instance.get(
            `${EndpointConfig.NowPlayingMoviesEndpoint}?page=${page}`,
        );
        const movies: Movie[] = res.data.results.map((tmdbMovie) => ({
            id: tmdbMovie.id,
            title: tmdbMovie.title,
            posterPath: tmdbMovie.poster_path,
            overview: tmdbMovie.overview,
            releaseDate: tmdbMovie.release_date,
            popularity: tmdbMovie.popularity,
        }));
        return {
            page: page,
            totalPages: res.data.total_pages,
            totalResults: res.data.total_results,
            result: movies,
        };
    }

    /**
     * Retrieves trending movies.
     * @returns A promise that resolves to an array of movies.
     */
    async getTrendingMovies(timeWindow: string): Promise<Movie[]> {
        const res: { data: MovieListResponse } = await this.instance.get(
            `${EndpointConfig.TrendingMoviesEndpoint.replace('{time_window}', timeWindow)}`,
        );
        const movies: Movie[] = res.data.results.map((tmdbMovie) => ({
            id: tmdbMovie.id,
            title: tmdbMovie.title,
            posterPath: tmdbMovie.poster_path,
            overview: tmdbMovie.overview,
            releaseDate: tmdbMovie.release_date,
            popularity: tmdbMovie.popularity,
        }));
        return movies;
    }

    /**
     * Searches for movies based on a query.
     * @param query - The search query.
     * @returns A promise that resolves to an array of movies.
     */
    async searchMovies(page: number, searchKeyword: string): Promise<PaginationType<Movie>> {
        const res: { data: MovieListResponse } = await this.instance.get(
            `${EndpointConfig.SearchMoviesEndpoint}?query=${encodeURIComponent(searchKeyword)}&page=${page}`,
        );
        const movies: Movie[] = res.data.results.map((tmdbMovie) => ({
            id: tmdbMovie.id,
            title: tmdbMovie.title,
            posterPath: tmdbMovie.poster_path,
            overview: tmdbMovie.overview,
            releaseDate: tmdbMovie.release_date,
            popularity: tmdbMovie.popularity,
        }));
        return {
            page: page,
            totalPages: res.data.total_pages,
            totalResults: res.data.total_results,
            result: movies,
        };
    }

    /**
     * Retrieves movie details by ID.
     * @param movieId - The ID of the movie.
     * @returns A promise that resolves to the movie details.
     */
    async getMovieDetails(movieId: number): Promise<Movie> {
        const res: { data: MovieDetailsResponse } = await this.instance.get(
            `${EndpointConfig.MovieDetailsEndpoint.replace('{movie_id}', movieId.toString())}`,
        );
        return {
            id: res.data.id,
            title: res.data.title,
            posterPath: res.data.poster_path,
            overview: res.data.overview,
            releaseDate: res.data.release_date,
            popularity: res.data.popularity,
        };
    }
}
