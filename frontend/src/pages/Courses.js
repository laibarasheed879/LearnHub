
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { getCourses } from "../services/courseService";
import { enrollInCourse } from "../services/enrollmentService";
import { toast } from "react-toastify";
import {  Clock3, UserRound, ArrowRight } from "lucide-react";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollingId, setEnrollingId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        setError("Courses load nahi ho sake. Backend server check karein.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    const token = localStorage.getItem("learnhubToken");
    const user = JSON.parse(localStorage.getItem("learnhubUser") || "null");

    if (!token || !user) {
      toast.info("Please login first to enroll in a course.");
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      toast.warning("Course enrollment is available for student accounts.");
      return;
    }

    try {
      setEnrollingId(courseId);
      const result = await enrollInCourse(courseId);
      toast.success(result.message || "Successfully enrolled!");
      navigate("/student-dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Enrollment failed. Please try again."
      );
    } finally {
      setEnrollingId("");
    }
  };

  if (loading) {
    return (
      <Container className="courses-status text-center">
        <Spinner animation="border" variant="success" />
        <h5 className="mt-3">Finding your next learning opportunity...</h5>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="courses-status">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <main className="courses-page">
      <section className="courses-heading">
        <Container>
          <div className="courses-heading-content">
            <Badge className="courses-eyebrow">
             YOUR LEARNING JOURNEY
            </Badge>
            <h1>Explore Our <span>Courses</span></h1>
            <p>
              Discover new skills, learn from expert instructors, and turn
              your ambitions into achievements.
            </p>
            <div className="courses-heading-stats">
              <div>
                <strong>{courses.length}+</strong>
                <span>Learning opportunities</span>
              </div>
              <div>
                <strong>Learn</strong>
                <span>At your own pace</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="courses-list-section" id="all-courses">
        <Container>
          <div className="courses-list-heading">
            <div>
              <span className="courses-section-label">START LEARNING</span>
              <h2>Find your next course</h2>
              <p>Choose a course and take the next step in your journey.</p>
            </div>
            <Badge bg="light" text="dark" className="courses-count">
              {courses.length} {courses.length === 1 ? "Course" : "Courses"}
            </Badge>
          </div>

          {courses.length === 0 ? (
            <Alert variant="info">No courses available yet.</Alert>
          ) : (
            <Row className="g-4">
              {courses.map((course) => (
                <Col key={course._id} xs={12} sm={6} lg={4}>
                  <Card className="course-card-premium h-100">
                    <div className="course-image-wrap">
                      <Card.Img
                        variant="top"
                        src={
                          course.image ||
                          "https://placehold.co/600x400/e8f0eb/285943?text=LearnHub"
                        }
                        alt={course.title}
                        className="course-card-image"
                      />
                      <Badge className="course-category-badge">
                        {course.category || "General"}
                      </Badge>
                    </div>

                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="course-card-title">
                        {course.title}
                      </Card.Title>

                      <Card.Text className="course-card-description">
                        {course.description || "Explore this course and start building useful new skills."}
                      </Card.Text>

                      <div className="course-meta">
                        <span>
                          <UserRound size={16} />
                          {course.instructor || "LearnHub Academy"}
                        </span>
                        <span>
                          <Clock3 size={16} />
                          {course.duration || "Flexible"}
                        </span>
                      </div>

                      {course.level && (
                        <div className="course-level-row">
                          <Badge className="course-level-badge">
                            {course.level}
                          </Badge>
                        </div>
                      )}

                      <div className="course-card-bottom mt-auto">
                        <div className="course-price">
                          <span>Course fee</span>
                          <strong>
                            {Number(course.price) === 0
                              ? "Free"
                              : `Rs. ${Number(course.price).toLocaleString("en-PK")}`}
                          </strong>
                        </div>

                        <div className="course-card-actions">
                          <Button
                            className="course-enroll-btn"
                            onClick={() => handleEnroll(course._id)}
                            disabled={enrollingId === course._id}
                          >
                            {enrollingId === course._id
                              ? "Enrolling..."
                              : "Enroll Now"}
                          </Button>

                          <Button
                            as={Link}
                            to={`/courses/${course._id}`}
                            className="course-details-btn"
                          >
                            View Details <ArrowRight size={16} />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </main>
  );
}

export default Courses;
