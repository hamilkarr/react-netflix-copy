import { useQuery } from "@tanstack/react-query";
import { getMovies, getGenres, IGetMoviesResult, IMovie, IGenre, IGenreList, convertGenreIdsToNames } from "../api";
import Loader from "../components/Loader";
import { getImageUrl } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const sliderVariants = {
  normal: {
    scale: 1
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.5,
      type: 'tween'
    }
  }
}
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
    }
  },
  normal: {
    opacity: 0,
  }
}
const SliderMovie = ({ movie, index, getGenreNames }: { 
  movie: IMovie;
  index: number;
  getGenreNames: (ids: number[]) => string[];
}) => {
  const navigate = useNavigate();
  const onMovieClicked = () => {
    navigate(`/movies/${movie.id}`);
  }
  return (
    <motion.li
      onClick={onMovieClicked}
      className={`w-full  ${index === 0
          ? 'origin-left'
          : index === 5
            ? 'origin-right'
            : ''
        }`}
      variants={sliderVariants}
      initial='normal'
      whileHover='hover'
      transition={{ type: 'tween' }}
    >
      <motion.img src={getImageUrl(movie.backdrop_path, 'w500')} alt={movie.title} className="w-full h-40 object-cover object-top" />

      <motion.div
        className="bg-zinc-900 h-32 w-full px-4 opacity-0"
        variants={infoVariants}
      >
        <h4 className="text-white text-center text-lg">{movie.title}</h4>
        <p className="text-white text-sm">{movie.overview.slice(0, 50)}...</p>
        <p className="text-white text-sm mt-2">{getGenreNames(movie.genre_ids).join(", ")}</p>
      </motion.div>
    </motion.li>
  )
}

let scrollWidth = 0;
if (window.outerHeight > window.innerHeight) {
  scrollWidth = 17;
}

const rowVariants = {
  hidden: {
    x: window.outerWidth - scrollWidth + 4
  },
  visible: {
    x: 0
  },
  exit: {
    x: -window.outerWidth + scrollWidth - 4
  }
}

const offset = 6;

const Home = () => {
  const { data: moviesData, isLoading: isLoadingMovies } = useQuery<IGetMoviesResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovies
  });

  const { data: genresData } = useQuery<IGenreList>({
    queryKey: ["genres"],
    queryFn: getGenres
  });

  const getGenreNames = (genreIds: number[]) => {
    if (!genresData?.genres) return [];
    return convertGenreIdsToNames(genreIds, genresData.genres);
  };

  const [sliderMoving, setSliderMoving] = useState(false);
  const [index, setIndex] = useState(0);
  const increaseIndex = () => {
    if (!moviesData?.results) return;
    if (sliderMoving) return;
    setSliderMoving(true);
    const maxIndex = Math.floor((moviesData.results.length - 1) / offset) - 1;
    setIndex(prev => prev === maxIndex ? 0 : prev + 1);
  }

  console.log(moviesData?.results);
  return (
    <main className='h-[200vh]'>
      {isLoadingMovies ? <Loader /> : (
        <>
          <section
            className='h-screen px-20 flex flex-col justify-center bg-cover bg-center'
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${getImageUrl(moviesData?.results[0].backdrop_path ?? '')})`
            }}
            onClick={increaseIndex}
          >
            <h1 className='text-5xl font-bold mb-4'>{moviesData?.results[0].title}</h1>
            <p className='w-1/2'>{moviesData?.results[0].overview}</p>
          </section>

          <section className='relative -mt-52'>
            <AnimatePresence onExitComplete={() => setSliderMoving(false)} initial={false}>
              <motion.ul
                className='grid grid-cols-6 gap-[4px] absolute w-full'
                variants={rowVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
                transition={{ type: "linear", duration: 1 }}
                key={index}
              >
                {moviesData?.results.slice(1).slice(offset * index, offset * index + offset).map((movie, num) => (
                  <SliderMovie
                    key={movie.id}
                    index={num}
                    movie={movie}
                    getGenreNames={getGenreNames}
                  />
                ))}
              </motion.ul>
            </AnimatePresence>
          </section>
        </>
      )}
    </main>
  )
}

export default Home;