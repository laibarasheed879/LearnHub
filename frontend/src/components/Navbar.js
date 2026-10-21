
import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function AppNavbar() {
  const navigate = useNavigate();
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
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="learnhub-navbar" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="learnhub-brand">
          Learn<span>Hub</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="learnhub-navbar" />

        <Navbar.Collapse id="learnhub-navbar">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/courses">
              Courses
            </Nav.Link>
             <Nav.Link as={Link} to="/about">
               About
              </Nav.Link>
            {user ? (
              <>
               <Nav.Link
  as={Link}
  to={
    user?.role === "admin"
      ? "/admin-dashboard"
      : "/student-dashboard"
  }
>
  Dashboard
</Nav.Link>

                <span className="navbar-welcome mx-lg-3 my-2 my-lg-0">
                Welcome {user.name}
                </span>

                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>

                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
