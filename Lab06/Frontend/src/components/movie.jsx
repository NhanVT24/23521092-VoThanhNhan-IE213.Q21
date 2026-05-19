import { useEffect, useState } from "react";
import moment from "moment";
import { Link, useLocation, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import MovieDataService from "../services/movies";

function Movie({ user }) {
  const { id } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState({
    _id: null,
    title: "",
    rated: "",
    poster: "",
    plot: "",
    reviews: [],
  });
  const [reviewText, setReviewText] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getMovie(id);
  }, [id]);

  useEffect(() => {
    const nextReview = location.state?.currentReview ?? null;
    const shouldOpenComposer = location.state?.openComposer;

    if (nextReview) {
      openEditReview(nextReview);
      return;
    }

    if (shouldOpenComposer) {
      openAddReview();
    }
  }, [location.state]);

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

  const openAddReview = () => {
    setEditingReview(null);
    setReviewText("");
    setErrorMessage("");
    setIsReviewFormOpen(true);
  };

  const openEditReview = (review) => {
    setEditingReview(review);
    setReviewText(review.review ?? "");
    setErrorMessage("");
    setIsReviewFormOpen(true);
  };

  const closeReviewForm = () => {
    setEditingReview(null);
    setReviewText("");
    setErrorMessage("");
    setIsReviewFormOpen(false);
  };

  const saveReview = (event) => {
    event.preventDefault();

    if (!user) {
      setErrorMessage("Please login before adding a review.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const data = {
      review: reviewText,
      name: user.name,
      user_id: user.id,
      movie_id: id,
    };

    const request = editingReview
      ? MovieDataService.updateReview({
          ...data,
          review_id: editingReview._id,
        })
      : MovieDataService.createReview(data);

    request
      .then(() => {
        closeReviewForm();
        getMovie(id);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Unable to save review.");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const deleteReview = (reviewId, index) => {
    if (!user) {
      return;
    }

    MovieDataService.deleteReview(reviewId, user.id)
      .then(() => {
        setMovie((prevState) => {
          const nextReviews = [...(prevState.reviews ?? [])];
          nextReviews.splice(index, 1);

          return {
            ...prevState,
            reviews: nextReviews,
          };
        });
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
              <Card.Text className="text-muted mb-3">
                Rating: {movie.rated || "N/A"}
              </Card.Text>
              {user && (
                <Button variant="warning" onClick={openAddReview}>
                  Add Review
                </Button>
              )}
              {!user && (
                <Link to="/login" className="btn btn-outline-warning">
                  Login to Review
                </Link>
              )}
            </Card.Body>
          </Card>

          {isReviewFormOpen && (
            <Card className="review-card mt-4">
              <Card.Body>
                <Card.Title>
                  {editingReview ? "Edit Review" : "Add Review"}
                </Card.Title>
                <Form onSubmit={saveReview}>
                  <Form.Group className="mb-3">
                    <Form.Label>User</Form.Label>
                    <Form.Control value={user?.name ?? ""} disabled />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      {editingReview ? "Edit" : "Create"} Review
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={reviewText}
                      onChange={(event) => setReviewText(event.target.value)}
                      placeholder="Write your review here"
                      required
                    />
                  </Form.Group>
                  {errorMessage ? (
                    <p className="text-danger">{errorMessage}</p>
                  ) : null}
                  <div className="d-flex gap-2">
                    <Button type="submit" variant="warning" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Submit"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={closeReviewForm}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}

          <br />
          <h2>Reviews</h2>
          <br />

          {movie.reviews.map((review, index) => (
            <div key={review._id} className="review-entry">
              <h5>
                {review.name} reviewed on{" "}
                {moment(review.date).format("Do MMMM YYYY")}
              </h5>
              <p>{review.review}</p>
              {user && user.id === review.user_id && (
                <Row>
                  <Col>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => openEditReview(review)}
                    >
                      Edit
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => deleteReview(review._id, index)}
                    >
                      Delete
                    </Button>
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
