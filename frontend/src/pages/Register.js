import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { registerUser } from "../services/authService";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

    const name = formData.name.trim();
    const email = formData.email.trim();

    // Validate required fields
    if (!name || !email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser({
        name,
        email,
        password: formData.password,
      });

      toast.success(data.message || "Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create an account. Keep growing."
      description="Join LearnHub and find your next opportunity to learn."
      visualTitle="Build skills for what’s next."
      visualDescription="Start with a subject that interests you and grow from there."
    >
      <Form onSubmit={handleSubmit} className="auth-form">
        <Form.Group className="auth-field">
          <Form.Label htmlFor="register-name">Full name</Form.Label>
          <div className="auth-input-wrap">
            <UserRound className="auth-input-icon" size={18} aria-hidden="true" />
            <Form.Control
              id="register-name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>
        </Form.Group>

        <Form.Group className="auth-field">
          <Form.Label htmlFor="register-email">Email address</Form.Label>
          <div className="auth-input-wrap">
            <Mail className="auth-input-icon" size={18} aria-hidden="true" />
            <Form.Control
              id="register-email"
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
          <Form.Label htmlFor="register-password">Password</Form.Label>
          <div className="auth-input-wrap auth-password-control">
            <LockKeyhole className="auth-input-icon" size={18} aria-hidden="true" />
            <Form.Control
              id="register-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              aria-describedby="register-password-help"
              minLength={8}
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              aria-controls="register-password"
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
          <Form.Text id="register-password-help" className="auth-help">
            Use at least 8 characters for your password.
          </Form.Text>
        </Form.Group>

        <Button type="submit" className="auth-submit" disabled={loading}>
          <span>{loading ? "Creating Account..." : "Create Account"}</span>
          {!loading && <ArrowRight size={18} aria-hidden="true" />}
        </Button>
      </Form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
