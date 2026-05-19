import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

function Login({ login }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "",
    name: "",
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
    navigate("/");
  };

  return (
    <Card className="login-card mx-auto" style={{ maxWidth: "480px" }}>
      <Card.Body>
        <Card.Title>Login</Card.Title>
        <Card.Text>
          Enter your username and id to simulate authentication for the review
          flow.
        </Card.Text>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="name"
              value={user.name}
              onChange={onChangeUser}
              placeholder="Enter username"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>ID</Form.Label>
            <Form.Control
              name="id"
              value={user.id}
              onChange={onChangeUser}
              placeholder="Enter id"
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
