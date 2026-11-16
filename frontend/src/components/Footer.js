
import { ArrowUp, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="learnhub-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="LearnHub home">
            <span className="footer-logo-mark" aria-hidden="true">
              <BookOpen size={18} />
            </span>
            <span className="footer-logo-name">
              Learn<span>Hub</span>
            </span>
          </Link>
          <p>
            Learn new skills, explore exciting courses, and take the next step
            toward your future with LearnHub.
          </p>
        </div>

        <nav className="footer-links" aria-label="Explore LearnHub">
          <h2>Explore</h2>
          <Link to="/">Home</Link>
          <Link to="/about">About us</Link>
          <Link to="/courses">Courses</Link>
        </nav>

        <nav className="footer-links" aria-label="Learner links">
          <h2>For learners</h2>
          <Link to="/login">Log in</Link>
          <Link to="/register">Create account</Link>
          <Link to="/courses">Explore courses</Link>
        </nav>

        <div className="footer-contact">
          <h2>Contact</h2>
          <p>Questions about LearnHub? Get in touch by email.</p>
          <a href="mailto:learnhubacademy@gmail.com">
            learnhubacademy@gmail.com
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} LearnHub. All Rights Reserved.
        </p>
        <button
          type="button"
          className="footer-back-to-top"
          onClick={scrollToTop}
        >
          Back to top
          <ArrowUp size={15} aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}

export default Footer;
