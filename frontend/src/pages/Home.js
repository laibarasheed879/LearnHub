
import { useEffect, useState } from "react";
import { getCourses } from "../services/courseService";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Clock3,
  Compass,
  GraduationCap,
  MonitorPlay,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import { Link } from "react-router-dom";
import "./Home.css";

const categories = [
  { title: "Web Development", description: "Build modern websites and web apps.", icon: MonitorPlay },
  { title: "Programming", description: "Develop coding and problem-solving skills.", icon: Zap },
  { title: "Data Science", description: "Explore data, analytics and technology.", icon: TrendingUp },
  { title: "Design", description: "Learn creative and user-focused design.", icon: Compass },
];

const learningBenefits = [
  {
    title: "Learn at your pace",
    description: "Make room for learning in a schedule that works for you.",
    icon: Clock3,
  },
  {
    title: "Build practical skills",
    description: "Turn new ideas into abilities you can use with confidence.",
    icon: Target,
  },
  {
    title: "See your progress",
    description: "Keep your learning journey moving, one lesson at a time.",
    icon: Trophy,
  },
];

function SectionHeading({ eyebrow, title, description, action, titleId }) {
  return (
    <div className="lh-home-section-heading">
      <div>
        <span className="lh-home-eyebrow">{eyebrow}</span>
        <h2 id={titleId}>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function CourseCard({ course }) {
  return (
    <Card className="lh-home-course-card h-100">
      {course.image ? (
        <Card.Img
          variant="top"
          src={course.image}
          alt={course.title}
          className="lh-home-course-image"
        />
      ) : (
        <div className="lh-home-course-placeholder" aria-hidden="true">
          <BookOpen size={34} strokeWidth={1.6} />
          <span>LEARNHUB COURSE</span>
        </div>
      )}
      <Card.Body className="d-flex flex-column">
        <div className="lh-home-course-meta">
          <Badge bg="light" text="primary">
            {course.category || "Learning"}
          </Badge>
          {course.level && <span>{course.level}</span>}
        </div>
        <Card.Title>{course.title}</Card.Title>
        <Card.Text className="lh-home-course-description">
          {course.description
            ? course.description.length > 105
              ? `${course.description.slice(0, 105)}...`
              : course.description
            : "Build your knowledge and develop new skills with LearnHub."}
        </Card.Text>
        <div className="lh-home-course-instructor">
          <span className="lh-home-instructor-avatar" aria-hidden="true">
            <GraduationCap size={16} />
          </span>
          <span>{course.instructor || "LearnHub Instructor"}</span>
        </div>
        <div className="lh-home-course-bottom">
          <strong>
            {Number(course.price || 0) === 0
              ? "Free"
              : `Rs. ${Number(course.price).toLocaleString()}`}
          </strong>
          <Button as={Link} to="/courses" variant="outline-primary" size="sm">
            View course <ArrowRight size={15} aria-hidden="true" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

function Home() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [courseError, setCourseError] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(Array.isArray(data) ? data : []);
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
      block: "start",
    });
  };

  const selectCategory = (category) => {
    setSearch(category);
    scrollToCourses();
  };

  return (
    <main className="lh-home">
      <section className="lh-home-hero" aria-labelledby="lh-home-title">
        <Container>
          <Row className="align-items-center gy-5">
            <Col md={6} className="lh-home-hero-copy">
              <div className="lh-home-hero-kicker">
                <span className="lh-home-kicker-icon"><Sparkles size={15} /></span>
                Learning that moves you forward
              </div>
              <h1 id="lh-home-title">
                Build skills for a <span>future</span> that keeps moving.
              </h1>
              <p className="lh-home-hero-description">
                Learn from thoughtfully designed courses, grow practical skills,
                and make progress on your own terms.
              </p>
              <div className="lh-home-hero-actions">
                <Button as={Link} to="/courses" className="lh-home-primary-button">
                  Explore courses <ArrowRight size={17} aria-hidden="true" />
                </Button>
                <Button as={Link} to="/register" className="lh-home-secondary-button">
                  Get started <ArrowUpRight size={17} aria-hidden="true" />
                </Button>
              </div>
              <Form
                className="lh-home-search"
                role="search"
                aria-label="Search LearnHub courses"
                onSubmit={(event) => {
                  event.preventDefault();
                  scrollToCourses();
                }}
              >
                <InputGroup>
                  <InputGroup.Text><Search size={18} aria-hidden="true" /></InputGroup.Text>
                  <Form.Control
                    type="search"
                    placeholder="What would you like to learn?"
                    aria-label="Search courses"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <Button type="submit" aria-label="Show matching courses">
                    <ArrowRight size={18} aria-hidden="true" />
                  </Button>
                </InputGroup>
              </Form>
              <div className="lh-home-hero-proof">
                <span><Check size={15} aria-hidden="true" /> Learn at your pace</span>
                <span><Check size={15} aria-hidden="true" /> Track your progress</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="lh-home-hero-visual">
                <div className="lh-home-hero-photo-wrap">
                  <img
                    src="/images/learnhub-student-learning.png"
                    alt="A student learning at a laptop in a bright, comfortable study space"
                    className="lh-home-hero-photo"
                  />
                </div>
                <div className="lh-home-photo-label">
                  <span className="lh-home-photo-label-icon"><BookOpen size={19} /></span>
                  <span><strong>Make learning yours</strong><small>One focused lesson at a time</small></span>
                </div>
                <div className="lh-home-photo-mark" aria-hidden="true">
                  <GraduationCap size={22} />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="lh-home-courses lh-home-section" id="popular-courses" aria-labelledby="lh-home-courses-title">
        <Container>
          <SectionHeading
            eyebrow="FIND YOUR NEXT COURSE"
            title="Popular courses"
            titleId="lh-home-courses-title"
            description="Explore topics that help turn curiosity into real-world skills."
            action={(
              <Button as={Link} to="/courses" className="lh-home-link-button">
                Browse all courses <ArrowRight size={16} aria-hidden="true" />
              </Button>
            )}
          />
          <div className="lh-home-category-filters" aria-label="Filter courses by category">
            <button
              type="button"
              className={!search ? "active" : ""}
              aria-pressed={!search}
              onClick={() => setSearch("")}
            >
              All courses
            </button>
            {categories.map(({ title, icon: Icon }) => (
              <button
                type="button"
                className={search === title ? "active" : ""}
                aria-pressed={search === title}
                onClick={() => selectCategory(title)}
                key={title}
              >
                <Icon size={15} aria-hidden="true" /> {title}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="lh-home-status" role="status" aria-live="polite">
              <Spinner animation="border" variant="primary" />
              <p>Finding courses for you...</p>
            </div>
          ) : courseError ? (
            <div className="lh-home-status lh-home-empty" role="status">
              <span className="lh-home-status-icon"><BookOpen size={24} /></span>
              <h3>Courses could not be loaded</h3>
              <p>Please check that the LearnHub backend is running, then refresh this page.</p>
              <Button as={Link} to="/courses" className="lh-home-primary-button">
                Open courses page <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </div>
          ) : popularCourses.length === 0 ? (
            <div className="lh-home-status lh-home-empty" role="status">
              <span className="lh-home-status-icon"><Search size={24} /></span>
              <h3>{search ? "No matching courses found" : "Courses coming soon"}</h3>
              <p>
                {search
                  ? "Try another search term, or browse all available courses."
                  : "Your administrator can add courses from the admin dashboard."}
              </p>
              {search && (
                <Button className="lh-home-secondary-button" onClick={() => setSearch("")}>
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <Row className="g-4 align-items-stretch">
              {popularCourses.map((course) => (
                <Col sm={6} lg={4} key={course._id}>
                  <CourseCard course={course} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      <section className="lh-home-why lh-home-section" aria-labelledby="lh-home-why-title">
        <Container>
          <div className="lh-home-centered-heading">
            <span className="lh-home-eyebrow">WHY LEARNHUB</span>
            <h2 id="lh-home-why-title">A clearer path from learning to doing.</h2>
            <p>Good learning fits your life, builds confidence, and helps you take the next step.</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <ValueCard
                icon={BookOpen}
                number="01"
                title="Practical by design"
                description="Explore focused courses built around useful knowledge and skills."
              />
            </Col>
            <Col md={4}>
              <ValueCard
                icon={Clock3}
                number="02"
                title="Flexible for real life"
                description="Keep learning on a schedule that feels sustainable for you."
              />
            </Col>
            <Col md={4}>
              <ValueCard
                icon={ShieldCheck}
                number="03"
                title="Progress that stays yours"
                description="Return to your learning journey and keep building from where you left off."
              />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="lh-home-benefits lh-home-section" aria-labelledby="lh-home-benefits-title">
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg={4}>
              <span className="lh-home-eyebrow">LEARNING, YOUR WAY</span>
              <h2 id="lh-home-benefits-title">Small steps make meaningful progress.</h2>
              <p className="lh-home-benefits-intro">
                Build a rhythm that works for you and make every lesson count.
              </p>
              <Button as={Link} to="/about" className="lh-home-text-link">
                Discover LearnHub <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </Col>
            <Col lg={8}>
              <Row className="g-3">
                {learningBenefits.map(({ title, description, icon: Icon }, index) => (
                  <Col md={4} key={title}>
                    <div className="lh-home-benefit-card">
                      <span className="lh-home-benefit-icon"><Icon size={21} aria-hidden="true" /></span>
                      <span className="lh-home-benefit-index">0{index + 1}</span>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="lh-home-cta-section" aria-labelledby="lh-home-cta-title">
        <Container>
          <div className="lh-home-cta">
            <div className="lh-home-cta-symbol" aria-hidden="true"><GraduationCap size={30} /></div>
            <div className="lh-home-cta-copy">
              <span className="lh-home-cta-eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
              <h2 id="lh-home-cta-title">Ready to make your next move?</h2>
              <p>Choose a course, build your skills, and keep moving toward your goals.</p>
            </div>
            <Button as={Link} to="/register" className="lh-home-cta-button">
              Get started <ArrowRight size={17} aria-hidden="true" />
            </Button>
          </div>
        </Container>
      </section>

      <section className="lh-home-faq lh-home-section" aria-labelledby="lh-home-faq-title">
        <Container>
          <div className="lh-home-centered-heading">
            <span className="lh-home-eyebrow">HERE TO HELP</span>
            <h2 id="lh-home-faq-title">A few things you may be wondering.</h2>
            <p>Quick answers to common questions about getting started with LearnHub.</p>
          </div>
          <Accordion flush className="lh-home-accordion">
            <Accordion.Item eventKey="0">
              <Accordion.Header>What is LearnHub?</Accordion.Header>
              <Accordion.Body>LearnHub is an online learning platform where students can explore courses and follow their learning journey.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>How can I enroll in a course?</Accordion.Header>
              <Accordion.Body>Register for an account, log in as a student, open the Courses page, and select the course you want to join.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Can I track my learning progress?</Accordion.Header>
              <Accordion.Body>Your Student Dashboard shows your enrolled courses and the progress information available for them.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Is LearnHub suitable for beginners?</Accordion.Header>
              <Accordion.Body>Explore the available courses and choose topics that match your interests and current skill level.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>How do I create an account?</Accordion.Header>
              <Accordion.Body>Open the Register page, enter your details, and submit the form to create your LearnHub account.</Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Container>
      </section>
    </main>
  );
}

function ValueCard({ icon: Icon, number, title, description }) {
  return (
    <article className="lh-home-value-card">
      <div className="lh-home-value-top">
        <span className="lh-home-value-icon"><Icon size={22} aria-hidden="true" /></span>
        <span>{number}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

export default Home;
