import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";

function AddReview() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/movies/${id}`, {
      replace: true,
      state: {
        currentReview: location.state?.currentReview,
        openComposer: !location.state?.currentReview,
      },
    });
  }, [id, location.state, navigate]);

  return (
    <Card className="review-card">
      <Card.Body>
        <Card.Title>Redirecting to movie details...</Card.Title>
        <Card.Text>The review form now lives directly on the movie detail page.</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default AddReview;
