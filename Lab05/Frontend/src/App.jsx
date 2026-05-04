import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import AddReview from "./components/add-review";
import Login from "./components/login";
import Movie from "./components/movie";
import MoviesList from "./components/movies-list";

function App() {
  const [user, setUser] = useState(null);

  const login = (nextUser) => {
    setUser(nextUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <div className="app-shell">
      <Navbar bg="light" expand="lg" className="site-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-mark">
            Movie Reviews
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="movie-nav" />
          <Navbar.Collapse id="movie-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/movies">
                Movies
              </Nav.Link>
              {user ? (
                <>
                  <Nav.Link onClick={logout} style={{ cursor: "pointer" }}>
                    Logout User
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="page-shell">
        <Container>
          <Routes>
            <Route path="/" element={<MoviesList />} />
            <Route path="/movies" element={<MoviesList />} />
            <Route path="/movies/:id" element={<Movie user={user} />} />
            <Route
              path="/movies/:id/review"
              element={<AddReview user={user} />}
            />
            <Route path="/login" element={<Login login={login} />} />
          </Routes>
        </Container>
      </main>
    </div>
  );
}

export default App;
