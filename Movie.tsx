import * as React from "react";
import { PropertyControls, ControlType } from "framer";
import styled from "styled-components";
import Axios from "axios";

const Container = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Poster = styled.div`
  width: 95px;
  height: 140px;
  background-color: #95a5a6;
  background-image: url(${props => props.src});
  background-size: 100%;
  background-position: center center;
  margin-bottom: 10px;
`;

const Title = styled.span`
  font-size: 14px;
  margin-bottom: 5px;
  text-align: center;
`;

const Rating = styled.span`
  font-size: 10px;
  color: #bdc3c7;
  display: flex;
  align-items: center;
`;

interface IMovie {
  posterPath: string;
  title: string;
  rating: number;
}

// Define type of property
interface Props {
  title: boolean;
  rating: boolean;
  poster: boolean;
}

interface IState {
  movie: IMovie | null;
}

export class Movie extends React.Component<Props, IState> {
  state = {
    movie: null
  };
  static defaultProps = {
    title: true,
    rating: true,
    poster: true
  };
  static propertyControls: PropertyControls<Props> = {
    title: { type: ControlType.Boolean, title: "Show Title" },
    rating: { type: ControlType.Boolean, title: "Show Rating" },
    poster: { type: ControlType.Boolean, title: "Show Poster" }
  };

  componentDidMount = () => {
    this.getMovie();
  };
  render() {
    const { movie } = this.state;
    const { title, rating, poster } = this.props;
    return (
      <Container>
        {poster && <Poster src={movie ? movie.posterPath : null} />}
        {title && <Title>{!movie ? "..." : movie.title}</Title>}
        {rating && (
          <Rating>
            {"  "}
            {!movie ? "..." : `⭐ ${movie.rating}/10`}
          </Rating>
        )}
      </Container>
    );
  }
  public getRandomID = (): number => {
    return Math.floor(Math.random() * 5558);
  };
  public getMovie = async () => {
    try {
      const randomId = this.getRandomID();
      const { data } = await Axios.get(
        `https://api.themoviedb.org/3/movie/${randomId}?api_key=10923b261ba94d897ac6b81148314a3f&language=en-US`
      );
      if (!data.poster_path) {
        this.getMovie();
      } else {
        this.setState({
          movie: {
            posterPath: `https://image.tmdb.org/t/p/w200${data.poster_path}`,
            title: data.title,
            rating: data.vote_average
          }
        });
      }
    } catch (error) {
      this.getMovie();
    }
  };
}
