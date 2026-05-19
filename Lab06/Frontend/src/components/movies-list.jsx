import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";
import MovieDataService from "../services/movies";

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchRating, setSearchRating] = useState("All Ratings");
  const [ratings, setRatings] = useState(["All Ratings"]);
  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [currentSearchMode, setCurrentSearchMode] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    retrieveRatings();
  }, []);

  useEffect(() => {
    retrieveNextPage();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 0) {
      retrieveNextPage();
      return;
    }

    setCurrentPage(0);
  }, [currentSearchMode]);

  const onChangeSearchTitle = (event) => {
    setSearchTitle(event.target.value);
  };

  const onChangeSearchRating = (event) => {
    setSearchRating(event.target.value);
  };

  const applyMoviesResponse = (response) => {
    const nextMovies = response.data.movies ?? [];
    setMovies(nextMovies);
    setCurrentPage(response.data.page ?? 0);
    const nextEntriesPerPage = response.data.entries_per_page ?? 0;
    setEntriesPerPage(nextEntriesPerPage);
    setHasNextPage(
      nextEntriesPerPage > 0 && nextMovies.length >= nextEntriesPerPage
    );
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
  const find = (query, by, page = currentPage) => {
    MovieDataService.find(query, by, page)
      .then((response) => {
        applyMoviesResponse(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const runTitleSearch = (page = currentPage) => {
    const value = searchTitle.trim();
    if (!value) {
      retrieveMovies(page);
      return;
    }

    find(value, "title", page);
  };

  const runRatingSearch = (page = currentPage) => {
    if (searchRating === "All Ratings") {
      retrieveMovies(page);
      return;
    }

    find(searchRating, "rated", page);
  };

  const retrieveNextPage = () => {
    if (currentSearchMode === "findByTitle") {
      runTitleSearch(currentPage);
    } else if (currentSearchMode === "findByRating") {
      runRatingSearch(currentPage);
    } else {
      retrieveMovies(currentPage);
    }
  };

  const retrieveMovies = (page = currentPage) => {
    MovieDataService.getAll(page)
      .then((response) => {
        applyMoviesResponse(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const findByTitle = () => {
    setCurrentSearchMode("findByTitle");

    if (currentPage === 0) {
      runTitleSearch(0);
    }
  };

  const findByRating = () => {
    setCurrentSearchMode("findByRating");

    if (currentPage === 0) {
      runRatingSearch(0);
    }
  };

  const showAllMovies = () => {
    setSearchTitle("");
    setSearchRating("All Ratings");
    setCurrentSearchMode("");

    if (currentPage === 0) {
      retrieveMovies(0);
    }
  };

  const goToPage = (page) => {
    if (page < 0 || page === currentPage) {
      return;
    }

    setCurrentPage(page);
  };

  const buildPaginationItems = () => {
    const pages = [];
    const maxKnownPage = hasNextPage ? currentPage + 1 : currentPage;
    const startPage = Math.max(0, currentPage - 1);
    const endPage = Math.min(maxKnownPage, currentPage + 1);

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => goToPage(page)}
        >
          {page + 1}
        </Pagination.Item>
      );
    }

    return pages;
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
            <Col md="auto">
              <Button variant="outline-primary" onClick={findByTitle}>
                Search Title
              </Button>
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
                Search Rating
              </Button>
            </Col>
            <Col md="auto">
              <Button variant="secondary" onClick={showAllMovies}>
                Show All
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
              <Card
                as={Link}
                to={`/movies/${movie._id}`}
                className="movie-card movie-card-link"
              >
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
                  <div className="mt-auto pt-2 movie-card-cta">View Details</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <div className="mt-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <span className="text-muted">
          Page {currentPage + 1}
          {entriesPerPage ? `, up to ${entriesPerPage} movies per page` : ""}
        </span>
        <Pagination className="mb-0">
          <Pagination.Prev
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
          />
          {buildPaginationItems()}
          <Pagination.Next
            onClick={() => goToPage(currentPage + 1)}
            disabled={!hasNextPage}
          />
        </Pagination>
      </div>
    </>
  );
}

export default MoviesList;
