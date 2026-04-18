import React, { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'

import AddReview from './components/add-review'
import MoviesList from './components/movies-list'
import Movie from './components/movie'
import Login from './components/login'

function App() {
  const [user, setUser] = useState(null)

  async function login(user = null) {
    setUser(user)
  }

  async function logout() {
    setUser(null)
  }

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Movie Reviews
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/movies">
                Movies
              </Nav.Link>

              {user ? (
                <Nav.Link onClick={logout} style={{ cursor: 'pointer' }}>
                  Logout User
                </Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-3">
        <Routes>
          <Route path="/" element={<MoviesList />} />
          <Route path="/movies" element={<MoviesList />} />
          <Route path="/movies/:id/review" element={<AddReview user={user} />} />
          <Route path="/movies/:id" element={<Movie user={user} />} />
          <Route path="/login" element={<Login login={login} />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App