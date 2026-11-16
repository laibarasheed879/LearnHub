import {
  ArrowRight,
  BookOpen,
  Compass,
  Eye,
  Mail,
  Target,
} from "lucide-react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: BookOpen,
    title: "Discover courses",
    description:
      "Explore learning opportunities that support your interests and goals.",
  },
  {
    icon: Compass,
    title: "Learn at your pace",
    description:
      "Build practical skills through digital learning that fits your journey.",
  },
  {
    icon: Target,
    title: "Keep making progress",
    description:
      "Track your learning and take steady steps toward what you want to achieve.",
  },
];

function AboutHero() {
  return (
    <section className="about-hero">
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={6} className="about-hero-copy">
            <span className="about-label">ABOUT LEARNHUB</span>
            <h1>
              Learn today.
              <span> Grow tomorrow.</span>
            </h1>
            <p>
              LearnHub helps students discover courses and strengthen their
              skills through accessible digital learning.
            </p>
            <Button
              as={Link}
              to="/courses"
              className="about-button"
            >
              Explore courses
              <ArrowRight size={17} aria-hidden="true" />
            </Button>
          </Col>
          <Col lg={6}>
            <div className="about-image-frame">
              <img
                className="about-hero-image"
                src="/images/learning-auth-panel.png"
                alt="A learner studying online with a laptop"
                decoding="async"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

function PurposeSection() {
  return (
    <section className="about-section about-purpose-section">
      <Container>
        <Row className="align-items-center g-4 g-lg-5">
          <Col lg={6}>
            <span className="about-section-kicker">WHY LEARNHUB</span>
            <h2>Learning for your next step</h2>
            <p>
              LearnHub is a digital learning platform where students can find
              courses, develop practical skills, and keep moving toward their
              goals. Whether you are starting something new or building on what
              you already know, we make it easier to take the next step.
            </p>
          </Col>
          <Col lg={6}>
            <div className="about-purpose-panel">
              <div className="about-purpose-icon" aria-hidden="true">
                <BookOpen size={22} />
              </div>
              <div>
                <h3>Built around learners</h3>
                <p>
                  A clear place to explore learning, follow your progress, and
                  build confidence one skill at a time.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

function DirectionSection() {
  const direction = [
    {
      icon: Target,
      title: "Our mission",
      description:
        "Make digital learning accessible and help students build useful skills for the future.",
    },
    {
      icon: Eye,
      title: "Our vision",
      description:
        "A future where every learner can discover new knowledge and grow with confidence.",
    },
  ];

  return (
    <section className="about-section about-direction-section">
      <Container>
        <div className="about-section-heading">
          <span className="about-section-kicker">OUR PURPOSE</span>
          <h2>A clear direction for better learning</h2>
          <p>
            We believe the right learning experience can open doors to new
            possibilities.
          </p>
        </div>
        <Row className="g-4">
          {direction.map(({ icon: Icon, title, description }) => (
            <Col md={6} key={title}>
              <Card className="about-card about-direction-card h-100">
                <Card.Body>
                  <span className="about-card-icon" aria-hidden="true">
                    <Icon size={21} />
                  </span>
                  <Card.Title as="h3">{title}</Card.Title>
                  <Card.Text>{description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="about-section about-benefits-section">
      <Container>
        <div className="about-section-heading">
          <span className="about-section-kicker">THE LEARNHUB EXPERIENCE</span>
          <h2>Tools for a more confident learning journey</h2>
          <p>
            Discover the parts of LearnHub designed to help you move forward.
          </p>
        </div>
        <Row className="g-4">
          {benefits.map(({ icon: Icon, title, description }) => (
            <Col md={4} key={title}>
              <Card className="about-card about-benefit-card h-100">
                <Card.Body>
                  <span className="about-card-icon" aria-hidden="true">
                    <Icon size={21} />
                  </span>
                  <Card.Title as="h3">{title}</Card.Title>
                  <Card.Text>{description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="about-contact-section">
      <Container>
        <div className="about-contact-card">
          <div>
            <span className="about-section-kicker">GET IN TOUCH</span>
            <h2>Questions about LearnHub?</h2>
            <p>
              We would be glad to hear from you. Reach us using the contact
              email below.
            </p>
          </div>
          <a
            className="about-contact-link"
            href="mailto:learnhubacademy@gmail.com"
          >
            <Mail size={18} aria-hidden="true" />
            learnhubacademy@gmail.com
          </a>
        </div>
      </Container>
    </section>
  );
}

function About() {
  return (
    <main className="about-page">
      <AboutHero />
      <PurposeSection />
      <DirectionSection />
      <BenefitsSection />
      <ContactSection />
    </main>
  );
}

export default About;
