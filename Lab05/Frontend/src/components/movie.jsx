import { useEffect, useState } from "react";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import MovieDataService from "../services/movies";

function Movie({ user }) {
  const { id } = useParams();
  const [movie, setMovie] = useState({
    _id: null,
    title: "",
    rated: "",
    poster: "",
    plot: "",
    reviews: [],
  });

  useEffect(() => {
    getMovie(id);
  }, [id]);

  const getMovie = (movieId) => {
    MovieDataService.get(movieId)
      .then((response) => {
        setMovie({
          ...response.data,
          reviews: response.data.reviews ?? [],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteReview = (reviewId) => {
    if (!user) {
      return;
    }

    MovieDataService.deleteReview(reviewId, user.id)
      .then(() => {
        getMovie(id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container className="px-0 movie-detail-wrap">
      <Row className="g-4">
        <Col md={4} className="text-center text-md-start">
          <Image
            src={movie.poster ? `${movie.poster}/100px250` : null}
            alt={movie.title}
            fluid
            className="movie-detail-poster"
          />
        </Col>
        <Col md={8}>
          <Card className="movie-detail-card">
            <Card.Header as="h5">{movie.title}</Card.Header>
            <Card.Body>
              <Card.Text>{movie.plot || "No plot available."}</Card.Text>
              {user && (
                <Link to={`/movies/${id}/review`}>
                  Add Review
                </Link>
              )}
            </Card.Body>
          </Card>

          <br />
          <h2>Reviews</h2>
          <br />

          {movie.reviews.map((review) => (
            <div key={review._id} className="review-entry">
              <h5>
                {review.name} reviewed on{" "}
                {moment(review.date).format("Do MMMM YYYY")}
              </h5>
              <p>{review.review}</p>
              {user && user.id === review.user_id && (
                <Row>
                  <Col>
                    <Link
                      to={`/movies/${id}/review`}
                      state={{ currentReview: review }}
                    >
                      Edit
                    </Link>
                  </Col>
                  <Col>
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={() => deleteReview(review._id)}
                    >
                      Delete
                    </button>
                  </Col>
                </Row>
              )}
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default Movie;
