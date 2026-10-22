
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  InputGroup,
  Badge,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";

const categories = [
  {  title: "Web Development", description: "Build modern websites and web apps." },
  {  title: "Programming", description: "Develop coding and problem-solving skills." },
  {  title: "Data Science", description: "Explore data, analytics and technology." },
  { title: "Design", description: "Learn creative and user-focused design." },
];

function Home() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [courseError, setCourseError] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
  `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/courses`
);
        setCourses(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Unable to load courses:", error);
        setCourseError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const searchText = search.toLowerCase().trim();

    return [
      course.title,
      course.description,
      course.category,
      course.instructor,
      course.level,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(searchText));
  });

  const popularCourses = filteredCourses.slice(0, 6);

  const scrollToCourses = () => {
    document.getElementById("popular-courses")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main className="home-page">

      

{/* HERO */}
<section className="home-hero">
  <Container>
    <Row className="justify-content-center">
      <Col
        xs={12}
        md={10}
        lg={9}
        xl={8}
        className="home-hero-content text-center"
      >
        <Badge bg="primary" className="home-hero-badge">
          YOUR JOURNEY STARTS HERE
        </Badge>

        <h1 className="home-hero-title">
         Transform Your Learning
          <br />
         Unlock Your  <span>Potential</span>
        </h1>

        <p className="home-hero-description mx-auto">
          Unlock your potential with expert-led courses, industry-relevant skills,
  and flexible learning designed to help you grow with confidence.
        </p>

        <Form
          className="home-search mx-auto"
          onSubmit={(event) => {
            event.preventDefault();
            scrollToCourses();
          }}
        >
          <InputGroup>
            <Form.Control
              type="search"
              placeholder="What do you want to learn?"
              aria-label="Search courses"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <Button type="submit" variant="primary">
              Search
            </Button>
          </InputGroup>
        </Form>

        <div className="home-hero-actions justify-content-center">
          <Button as={Link} to="/courses" variant="primary" size="lg">
            Explore Courses
          </Button>

          <Button
            as={Link}
            to="/register"
            variant="outline-primary"
            size="lg"
          >
            Join LearnHub
          </Button>
        </div>

        <div className="home-hero-note justify-content-center">
          <span>✓</span> Learn at your own pace
          <span>✓</span> Track your progress
        </div>
      </Col>
    </Row>
  </Container>
</section>

      {/* LEARNING CATEGORIES */}
      <section className="home-categories section-padding">
        <Container>
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow">EXPLORE YOUR INTERESTS</span>
              <h2>Find your learning path</h2>
              <p>Start with a topic you love and discover where it takes you.</p>
            </div>
            <Link to="/courses" className="home-text-link">
              Browse all courses →
            </Link>
          </div>

          <Row className="g-4">
            {categories.map((category) => (
              <Col sm={6} xl={3} key={category.title}>
                <button
                  type="button"
                  className="category-card"
                  onClick={() => {
                    setSearch(category.title);
                    scrollToCourses();
                  }}
                >
                  
                  <strong>{category.title}</strong>
                  <span className="category-description">
                    {category.description}
                  </span>
                  <span className="category-arrow">Explore topic ↗</span>
                </button>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* POPULAR COURSES */}
      <section
        className="home-popular section-padding"
        id="popular-courses"
      >
        <Container>
          <div className="home-section-heading">
            <div>
              <span className="home-eyebrow">LEARN SOMETHING NEW</span>
              <h2>Explore our courses</h2>
              <p>
                Discover courses to help you develop useful, real-world skills.
              </p>
            </div>
            <Button as={Link} to="/courses" variant="outline-primary">
              View all courses →
            </Button>
          </div>

          {loading ? (
            <div className="home-loading">
              <Spinner animation="border" variant="primary" />
              <p>Finding courses for you...</p>
            </div>
          ) : courseError ? (
            <div className="home-empty-state">
              <div className="home-empty-icon">↻</div>
              <h3>Courses could not be loaded</h3>
              <p>
                Please check that the LearnHub backend is running, then refresh
                this page.
              </p>
              <Button as={Link} to="/courses" variant="primary">
                Open Courses Page
              </Button>
            </div>
          ) : popularCourses.length === 0 ? (
            <div className="home-empty-state">
              <div className="home-empty-icon">⌕</div>
              <h3>{search ? "No matching courses found" : "Courses coming soon"}</h3>
              <p>
                {search
                  ? "Try another search term, or browse all available courses."
                  : "Your administrator can add courses from the admin dashboard."}
              </p>
              {search && (
                <Button
                  variant="outline-primary"
                  onClick={() => setSearch("")}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <Row className="g-4">
              {popularCourses.map((course) => (
                <Col sm={6} lg={4} key={course._id}>
                  <Card className="home-course-card h-100">
                    {course.image ? (
                      <Card.Img
                        variant="top"
                        src={course.image}
                        alt={course.title}
                        className="home-course-image"
                      />
                    ) : (
                      <div className="home-course-placeholder">
                        <span>▤</span>
                        <small>LEARNHUB COURSE</small>
                      </div>
                    )}

                    <Card.Body className="d-flex flex-column">
                      <div className="home-course-meta">
                        <Badge bg="light" text="primary">
                          {course.category || "Learning"}
                        </Badge>
                        {course.level && (
                          <span>{course.level}</span>
                        )}
                      </div>

                      <Card.Title>{course.title}</Card.Title>

                      <Card.Text className="home-course-description">
                        {course.description
                          ? course.description.length > 105
                            ? `${course.description.slice(0, 105)}...`
                            : course.description
                          : "Build your knowledge and develop new skills with LearnHub."}
                      </Card.Text>

                      <div className="home-course-instructor">
                        <span className="instructor-avatar">✦</span>
                        <span>{course.instructor || "LearnHub Instructor"}</span>
                      </div>

                      <div className="home-course-bottom">
                        <strong>
                          {Number(course.price || 0) === 0
                            ? "Free"
                            : `Rs. ${Number(course.price).toLocaleString()}`}
                        </strong>
                        <Button
                          as={Link}
                          to="/courses"
                          variant="outline-primary"
                          size="sm"
                        >
                          View course →
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* WHY LEARNHUB */}
      <section className="home-benefits section-padding">
        <Container>
          <div className="home-centered-heading">
            <span className="home-eyebrow">WHY LEARNHUB</span>
            <h2>A better way to keep growing</h2>
            <p>
              A learning experience designed to help you move forward with
              confidence.
            </p>
          </div>

          <Row className="g-4 mt-2">
            <Col md={4}>
              <Card className="home-benefit-card h-100">
                <Card.Body>
                  <div className="benefit-icon benefit-blue">▤</div>
                  <h3>Learn useful skills</h3>
                  <p>
                    Explore organized courses and build knowledge one lesson
                    at a time.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="home-benefit-card h-100">
                <Card.Body>
                  <div className="benefit-icon benefit-purple">◷</div>
                  <h3>Learn at your pace</h3>
                  <p>
                    Continue your learning journey when it suits your schedule.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="home-benefit-card h-100">
                <Card.Body>
                  <div className="benefit-icon benefit-green">↗</div>
                  <h3>See your progress</h3>
                  <p>
                    Use your student dashboard to revisit courses and follow
                    your learning progress.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CALL TO ACTION */}
      <section className="home-cta-section">
        <Container>
          <div className="home-cta">
            <div>
              <span className="home-cta-eyebrow">YOUR NEXT STEP STARTS HERE</span>
              <h2>Ready to learn something new?</h2>
              <p>
                Choose a course, build your skills and take the next step
                towards your goals.
              </p>
            </div>
            <Button
              as={Link}
              to="/register"
              variant="light"
              size="lg"
            >
              Start learning <span aria-hidden="true">→</span>
            </Button>
          </div>
        </Container>
      </section>

      {/* FAQ — KEEP NEAR THE BOTTOM */}
      <section className="faq-section home-faq-section section-padding">
        <Container>
          <div className="home-centered-heading">
            <span className="home-eyebrow">NEED A HAND?</span>
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions about LearnHub.</p>
          </div>

          <Accordion flush className="home-faq-accordion">
            <Accordion.Item eventKey="0">
              <Accordion.Header>What is LearnHub?</Accordion.Header>
              <Accordion.Body>
                LearnHub is an online learning platform where students can
                explore courses and follow their learning journey.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>How can I enroll in a course?</Accordion.Header>
              <Accordion.Body>
                Register for an account, log in as a student, open the Courses
                page and select the course you want to join.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>Can I track my learning progress?</Accordion.Header>
              <Accordion.Body>
                Yes. Your Student Dashboard shows your enrolled courses and
                the progress information available for them.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Is LearnHub suitable for beginners?</Accordion.Header>
              <Accordion.Body>
                Yes. You can explore the available courses and choose topics
                that match your interests and current skill level.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>How do I create an account?</Accordion.Header>
              <Accordion.Body>
                Open the Register page, enter your details and submit the form
                to create your LearnHub account.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Container>
      </section>

    </main>
  );
}

export default Home;
