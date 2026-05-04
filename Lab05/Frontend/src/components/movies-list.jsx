import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import MovieDataService from "../services/movies";

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchRating, setSearchRating] = useState("All Ratings");
  const [ratings, setRatings] = useState(["All Ratings"]);

  useEffect(() => {
    retrieveMovies();
    retrieveRatings();
  }, []);

  const onChangeSearchTitle = (event) => {
    setSearchTitle(event.target.value);
  };

  const onChangeSearchRating = (event) => {
    setSearchRating(event.target.value);
  };

  const retrieveMovies = () => {
    MovieDataService.getAll()
      .then((response) => {
        setMovies(response.data.movies ?? []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const retrieveRatings = () => {
    MovieDataService.getRatings()
      .then((response) => {
        setRatings(["All Ratings", ...(response.data ?? [])]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const find = (query, by) => {
    MovieDataService.find(query, by)
      .then((response) => {
        setMovies(response.data.movies ?? []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const findByTitle = () => {
    const value = searchTitle.trim();
    if (!value) {
      retrieveMovies();
      return;
    }
    find(value, "title");
  };

  const findByRating = () => {
    if (searchRating === "All Ratings") {
      retrieveMovies();
      return;
    }
    find(searchRating, "rated");
  };

  return (
    <>
      <Card className="search-panel mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={6}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search by title"
                  value={searchTitle}
                  onChange={onChangeSearchTitle}
                />
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Select
                  value={searchRating}
                  onChange={onChangeSearchRating}
                >
                  {ratings.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md="auto">
              <Button variant="primary" onClick={findByRating}>
                Search
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {movies.length === 0 ? (
        <Card className="content-card">
          <Card.Body className="empty-state">
            No movies found for the current search.
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {movies.map((movie) => (
            <Col key={movie._id} sm={6} lg={4} xl={3} className="movie-list-col">
              <Card className="movie-card">
                <Card.Img
                  className="movie-poster"
                  variant="top"
                  src={movie.poster ? `${movie.poster}/100px180` : null}
                  alt={movie.title}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>Rating: {movie.rated || "N/A"}</Card.Text>
                  <Card.Text>
                    {movie.plot || "No plot available for this movie."}
                  </Card.Text>
                  <div className="mt-auto pt-2">
                    <Link to={`/movies/${movie._id}`}>View Reviews</Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}

export default MoviesList;
