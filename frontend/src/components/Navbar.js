
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";

function AppNavbar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("learnhubUser")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const updateUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("learnhubUser")) || null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", updateUser);
    window.addEventListener("learnhub-auth-change", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("learnhub-auth-change", updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("learnhubToken");
    localStorage.removeItem("learnhubUser");
    setUser(null);
    setExpanded(false);
    window.dispatchEvent(new Event("learnhub-auth-change"));
    navigate("/");
  };

  const dashboardPath = {
    admin: "/admin-dashboard",
    instructor: "/instructor-dashboard",
    student: "/student-dashboard",
  }[user?.role];

  return (
    <Navbar
      expand="lg"
      className="learnhub-navbar"
      sticky="top"
      collapseOnSelect
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container className="learnhub-navbar-container">
        <Navbar.Brand as={Link} to="/" className="learnhub-brand">
          <span className="learnhub-brand-mark" aria-hidden="true">
            <BookOpen size={18} strokeWidth={2.1} />
          </span>
          <span className="learnhub-brand-name">
            Learn<span>Hub</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle
          className="learnhub-menu-toggle"
          aria-controls="learnhub-navbar"
          aria-label={expanded ? "Close navigation menu" : "Open navigation menu"}
        />

        <Navbar.Collapse id="learnhub-navbar">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={NavLink} to="/" end eventKey="home">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" eventKey="about">
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to="/courses" eventKey="courses">
              Courses
            </Nav.Link>

            {user ? (
              <>
                {dashboardPath && (
                  <Nav.Link
                    as={NavLink}
                    to={dashboardPath}
                    eventKey="dashboard"
                    className="navbar-dashboard-link"
                  >
                    Dashboard
                  </Nav.Link>
                )}
                <span className="navbar-welcome mx-lg-3 my-2 my-lg-0">
                  Welcome, <strong>{user.name}</strong>
                </span>
                <Button
                  type="button"
                  variant="outline-primary"
                  className="navbar-logout-button"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/login"
                  eventKey="login"
                  className="navbar-login-link"
                >
                  Log in
                </Nav.Link>
                <Button
                  as={NavLink}
                  to="/register"
                  eventKey="register"
                  className="navbar-register-button"
                  onClick={() => setExpanded(false)}
                >
                  Create account
                  <ArrowRight size={15} aria-hidden="true" />
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
