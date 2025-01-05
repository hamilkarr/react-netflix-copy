import { useSearchParams } from 'react-router-dom';
import { getSearchMovies } from '../api';
import { useQuery } from '@tanstack/react-query';
import Loader from '../components/Loader';

const Search = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const { data, isLoading } = useQuery({
    queryKey: ['search', keyword],
    queryFn: () => getSearchMovies(keyword || ''),
  });
  return (
    <div>
      {isLoading ? <Loader /> : (
        <main className='h-[200vh] pt-20'>
          {data && <p>{data.results.map((movie: any) => movie.title).join(', ')}</p>}
        </main>
      )}
    </div>
  )
}

export default Search;