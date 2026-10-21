
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaGraduationCap, FaBullseye, FaUsers } from "react-icons/fa";

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <Container>
          <span className="about-label">ABOUT LEARNHUB</span>
          <h1>Learn Today. Grow Tomorrow.</h1>
          <p>
            Your journey to new skills and better opportunities starts here.
          </p>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="align-items-center g-4 mb-5">
          <Col md={6}>
            <h2>Welcome to LearnHub</h2>
            <p>
              LearnHub is an online learning platform designed to help
              students develop practical skills through accessible,
              beginner-friendly courses.
            </p>
            <p>
              Whether you are starting your learning journey or improving
              your existing skills, LearnHub helps you take the next step
              with confidence.
            </p>
          </Col>

          <Col md={6}>
            <div className="about-highlight">
              <FaGraduationCap className="about-main-icon" />
              <h3>Learning Made Simple</h3>
              <p>
                Explore courses, track your learning and build skills
                at your own pace.
              </p>
            </div>
          </Col>
        </Row>

        <div className="text-center mb-4">
          <h2>What Makes LearnHub Special?</h2>
          <p>Designed to support your learning journey.</p>
        </div>

        <Row className="g-4">
          <Col md={4}>
            <Card className="about-card h-100">
              <Card.Body>
                <FaBullseye className="about-icon" />
                <Card.Title>Our Mission</Card.Title>
                <Card.Text>
                  To make learning accessible and help students develop
                  useful skills for their future.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="about-card h-100">
              <Card.Body>
                <FaGraduationCap className="about-icon" />
                <Card.Title>Quality Learning</Card.Title>
                <Card.Text>
                  Provide an organised learning experience with courses
                  for different interests and skill levels.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="about-card h-100">
              <Card.Body>
                <FaUsers className="about-icon" />
                <Card.Title>Student Focused</Card.Title>
                <Card.Text>
                  Help learners discover courses, monitor progress and
                  keep moving towards their goals.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="about-cta text-center mt-5">
          <h2>Ready to Start Learning?</h2>
          <p>Explore our courses and find your next learning opportunity.</p>
          <a href="/courses" className="btn about-button">
            Explore Courses
          </a>
        </div>
      </Container>
    </div>
  );
}

export default About;
