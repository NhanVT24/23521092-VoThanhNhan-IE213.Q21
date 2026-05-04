import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import MovieDataService from "../services/movies";

function AddReview({ user }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const editingReview = location.state?.currentReview;
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (editingReview) {
      setReview(editingReview.review ?? "");
    }
  }, [editingReview]);

  const onChangeReview = (event) => {
    setReview(event.target.value);
  };

  const saveReview = () => {
    if (!user) {
      setErrorMessage("Please login before adding a review.");
      return;
    }

    const payload = editingReview
      ? {
          review_id: editingReview._id,
          user_id: user.id,
          review,
        }
      : {
          movie_id: id,
          user_id: user.id,
          name: user.name,
          review,
        };

    const request = editingReview
      ? MovieDataService.updateReview(payload)
      : MovieDataService.createReview(payload);

    request
      .then(() => {
        setSubmitted(true);
        setErrorMessage("");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Unable to save review. Please check the backend.");
      });
  };

  if (!user) {
    return (
      <Card className="login-card">
        <Card.Body>
          <Card.Title>Login required</Card.Title>
          <Card.Text>You need a user account in this demo to write reviews.</Card.Text>
          <Link to="/login" className="btn btn-warning">
            Go to Login
          </Link>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="review-card">
      <Card.Body>
        {submitted ? (
          <>
            <Card.Title>Review saved successfully</Card.Title>
            <Card.Text>Your review has been sent to the backend.</Card.Text>
            <Button variant="dark" onClick={() => navigate(`/movies/${id}`)}>
              Back to Movie
            </Button>
          </>
        ) : (
          <>
            <Card.Title>{editingReview ? "Edit Review" : "Add Review"}</Card.Title>
            <Card.Text className="text-muted">
              Movie ID: {id}
            </Card.Text>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>User</Form.Label>
                <Form.Control value={user.name} disabled />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={review}
                  onChange={onChangeReview}
                  placeholder="Write your review here"
                />
              </Form.Group>
              {errorMessage ? (
                <p className="text-danger">{errorMessage}</p>
              ) : null}
              <div className="d-flex gap-2">
                <Button variant="warning" onClick={saveReview}>
                  Submit
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </div>
            </Form>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default AddReview;
