import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { loginUser } from "../services/authService";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();
    const password = formData.password;

    // Validate required fields
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        email,
        password,
      });

      if (!data.token || !data.user) {
        toast.error("Invalid response from server. Please try again.");
        return;
      }

      // Save login information
      localStorage.setItem("learnhubToken", data.token);
      localStorage.setItem("learnhubUser", JSON.stringify(data.user));

      // Update navbar login state
      window.dispatchEvent(new Event("learnhub-auth-change"));

      toast.success("Login successful! Welcome to LearnHub.");

      // Navigate according to account role
      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin-dashboard", { replace: true });
        } else {
          navigate("/student-dashboard", { replace: true });
        }
      }, 800);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Card
        className="mx-auto shadow-lg p-4"
        style={{ maxWidth: "500px" }}
      >
        <Card.Body>
          <h2 className="text-center mb-2">
            Welcome Back!
          </h2>

          <p className="text-center text-muted mb-4">
            Login to continue your LearnHub journey.
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login to LearnHub"}
            </Button>
          </Form>

          <p className="text-center mt-4 mb-0">
            Don't have an account?{" "}
            <Link to="/register">Create Account</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;