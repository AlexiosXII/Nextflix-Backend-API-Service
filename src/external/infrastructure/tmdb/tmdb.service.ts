import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TmdbService {
    private readonly apiKey: string;
    private readonly apiEndpoint: string;

    constructor() {
        this.apiKey = process.env.TMDB_API_READ || '';
        this.apiEndpoint = process.env.TMDB_API_ENDPOINT || 'https://api.themoviedb.org/3';
    }

    getInstance() {
        return axios.create({
            baseURL: this.apiEndpoint,
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
        });
    }
}
