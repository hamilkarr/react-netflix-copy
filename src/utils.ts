
export const getImageUrl = (path: string, size: string = 'original') => {
    return `https://image.tmdb.org/t/p/${size}/${path}`;
}
