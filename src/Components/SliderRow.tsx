import React, { useState } from "react"
import styled from "styled-components";
import {motion, AnimatePresence, useViewportScroll} from "framer-motion"
import { useQuery } from "react-query";
import { getPopularMovies, getTopRatedMovies, getUpComingMovies, IGetMoviesResult } from "../api.ts";
import { makeImagePath } from "../utils.ts";
import { useHistory, useRouteMatch } from "react-router-dom";


interface Iprops{
  title : string
}

const Slider = styled.div<Iprops>`

  position: relative;
  top : ${(props) =>{ switch (props.title){
    case "Popular" :
      return "100px";
    case "Top Rated" :
      return "300px";
    default :
      return "500px";}}} 
`;

const RowTitle = styled.div<Iprops>`
  position: relative;
  height: 50px;
  font-size : 36px;
  margin-left : 30px;
  top : ${(props) =>{ switch (props.title){
    case "Popular" :
      return "100px";
    case "Top Rated" :
      return "300px";
    default :
      return "500px";}}} 
`

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;


const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

interface ISliderRow
{
  videoType : string
  sliderTitle : string;
}

function SliderRow({sliderTitle, videoType}:ISliderRow)
{
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useViewportScroll();

  const { data, isLoading } = useQuery<IGetMoviesResult>(
    [videoType, sliderTitle],
    sliderTitle === "Popular" ? getPopularMovies : sliderTitle === "Top Rated" ? getTopRatedMovies : getUpComingMovies
  );

  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
const [leaving, setLeaving] = useState(false);
const [index, setIndex] = useState(0);

const toggleLeaving = () => setLeaving((prev) => !prev);

const onBoxClicked = (movieId: number) => {
  history.push(`/movies/${movieId}`);
};

const onOverlayClick = () => history.push("/");

const clickedMovie =
  bigMovieMatch?.params.movieId &&
  data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);

    return <>
      <RowTitle  onClick={incraseIndex} title = {sliderTitle}>
            {sliderTitle}
      </RowTitle>
      <Slider title = {sliderTitle}>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={`${sliderTitle}` + movie.id+`` }
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={ sliderTitle + bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
    </>;
}

export default SliderRow;