
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { getCourseById } from "../services/courseService";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id);
        setCourse(data);
      } catch (err) {
        setError("Course load nahi ho saka.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading course details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/courses">Back to Courses</Button>
      </Container>
    );
  }

  if (!course) return null;

  return (
    <Container className="py-5">
      <Row className="g-4 align-items-center">
        <Col md={6}>
          <img
            src={course.image || "https://placehold.co/600x400?text=LearnHub"}
            alt={course.title}
            className="img-fluid rounded shadow"
          />
        </Col>

        <Col md={6}>
          <p className="text-primary fw-bold">{course.category}</p>
          <h1>{course.title}</h1>
          <p className="text-secondary">{course.description}</p>

          <p><strong>Instructor:</strong> {course.instructor}</p>
          <p><strong>Duration:</strong> {course.duration}</p>
          <p><strong>Level:</strong> {course.level}</p>
          <h3 className="mb-4">Rs. {course.price}</h3>

          <Button variant="primary" as={Link} to="/courses">
            Back to Courses
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default CourseDetail;
