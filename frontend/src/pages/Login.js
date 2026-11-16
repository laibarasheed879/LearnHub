import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { loginUser } from "../services/authService";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <AuthLayout
      eyebrow="Welcome back"
      title="Keep your learning moving."
      description="Sign in to continue building the skills that take you further."
      visualTitle="Make room for what’s next."
      visualDescription="Pick up where you left off and keep moving toward your next goal."
    >
      <Form onSubmit={handleSubmit} className="auth-form">
        <Form.Group className="auth-field">
          <Form.Label htmlFor="login-email">Email address</Form.Label>
          <div className="auth-input-wrap">
            <Mail className="auth-input-icon" size={18} aria-hidden="true" />
            <Form.Control
              id="login-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
        </Form.Group>

        <Form.Group className="auth-field">
          <Form.Label htmlFor="login-password">Password</Form.Label>
          <div className="auth-input-wrap auth-password-control">
            <LockKeyhole className="auth-input-icon" size={18} aria-hidden="true" />
            <Form.Control
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              aria-controls="login-password"
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
        </Form.Group>

        <Button type="submit" className="auth-submit" disabled={loading}>
          <span>{loading ? "Logging in..." : "Login to LearnHub"}</span>
          {!loading && <ArrowRight size={18} aria-hidden="true" />}
        </Button>
      </Form>

      <p className="auth-switch">
        Don&apos;t have an account? <Link to="/register">Create account</Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
