const API_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMzJhNDQyNzE4YTg5YTRiM2M0NzFjODIyNjgxZmZiOCIsIm5iZiI6MTczNTc1MDg2My44NjYsInN1YiI6IjY3NzU3NGNmYmYxMGZmMTk4NDYyM2FmMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.u21NH3vP7KosGrbXkgn3iT20mGpNBrXpyFERq6Kpm_E';
const BASE_URL = 'https://api.themoviedb.org/3';

export interface IMovie {
    backdrop_path: string;
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
}
export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface IGenre {
    id: number;
    name: string;
}

export interface IGenreList {
    genres: IGenre[];
}

export const getMovies = async () => {
    const url = `${BASE_URL}/movie/now_playing?language=en&page=1`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_ACCESS_TOKEN}`
        }
    };  

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }
    return response.json();
};

export const getGenres = async () => {
    const url = `${BASE_URL}/genre/movie/list?language=en`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_ACCESS_TOKEN}`
        }
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error('Failed to fetch genres');
    }
    return response.json();
};

export const convertGenreIdsToNames = (genreIds: number[], genreList: IGenre[]): string[] => {
    return genreIds.map(id => 
        genreList.find(genre => genre.id === id)?.name ?? ''
    ).filter(name => name !== '');
};