import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

function Login({ login }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "123",
    name: "Demo User",
  });

  const onChangeUser = (event) => {
    const { name, value } = event.target;
    setUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  };

  const handleLogin = (event) => {
    event.preventDefault();
    login(user);
    navigate("/movies");
  };

  return (
    <Card className="login-card mx-auto" style={{ maxWidth: "480px" }}>
      <Card.Body>
        <Card.Title>Demo Login</Card.Title>
        <Card.Text>
          Enter any user id and name to simulate authentication for the review
          flow.
        </Card.Text>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              name="id"
              value={user.id}
              onChange={onChangeUser}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={user.name}
              onChange={onChangeUser}
              required
            />
          </Form.Group>
          <Button type="submit" variant="dark">
            Login
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Login;
