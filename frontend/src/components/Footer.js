
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="learnhub-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            LearnHub
          </Link>

          <p>
            Learn new skills, explore exciting courses, and take
            the next step toward your future with LearnHub.
          </p>
        </div>

        <div className="footer-links">
          <h5>Quick Links</h5>
          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/about">About Us</Link>
          <div className="footer-contact">
  <h5>Contact Us</h5>
  <a href="mailto:learnhubacademy@gmail.com">
    learnhubacademy@gmail.com
  </a>
</div>
        </div>

        <div className="footer-links">
          <h5>For Learners</h5>
          <Link to="/login">Login</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/courses">Explore Courses</Link>
        </div>

        <div className="footer-contact">
          <h5>Stay Connected</h5>
          <p>Keep learning. Keep growing.</p>
          <p className="footer-highlight">
            Your learning journey starts here.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} LearnHub. All rights reserved.
        </p>
       
      </div>
    </footer>
  );
}

export default Footer;
