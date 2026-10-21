import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { getCourses } from "../services/courseService";
import { getMyEnrollments } from "../services/enrollmentService";

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("learnhubUser") || "null");
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollmentError, setEnrollmentError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        setError("Courses are not loaded. Please check backend server.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        const data = await getMyEnrollments();
        setEnrollments(data);
      } catch (err) {
        setEnrollmentError(
          "your enrolled courses are not loaded. Please login again."
        );
      } finally {
        setEnrollmentLoading(false);
      }
    };

    if (localStorage.getItem("learnhubToken")) {
      loadEnrollments();
    } else {
      setEnrollmentLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("learnhubToken");
    localStorage.removeItem("learnhubUser");
    window.dispatchEvent(new Event("learnhub-auth-change"));
    navigate("/");
  };

  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce(
            (total, enrollment) => total + (enrollment.progress || 0),
            0
          ) / enrollments.length
        )
      : 0;

  return (
    <div className="dashboard-page">
      <Container fluid className="py-4 px-lg-4">
        <Row className="g-4">
          <Col lg={3} xl={2}>
            <Card className="dashboard-sidebar h-100">
              <Card.Body>
                <h4 className="mb-4">
                  Learn<span>Hub</span>
                </h4>

                <p className="sidebar-label">LEARNING MENU</p>

                <a href="#overview" className="sidebar-link active">
                   Overview
                </a>

                <a href="#my-courses" className="sidebar-link">
                   My Courses
                </a>

                <a href="#progress" className="sidebar-link">
                   My Progress
                </a>

                <Link to="/courses" className="sidebar-link">
                  Explore Courses
                </Link>

                <Link to="/" className="sidebar-link">
                   Back to Home
                </Link>

                <hr />

                <button
                  type="button"
                  className="sidebar-link logout-link"
                  onClick={logout}
                >
                  ↪ Logout
                </button>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9} xl={10}>
            <div className="dashboard-welcome mb-4" id="overview">
              <div>
                <p className="dashboard-eyebrow">STUDENT DASHBOARD</p>
                <h1>Welcome back, {user?.name || "Student"}! 👋</h1>
                <p>Keep learning, keep growing. Your next skill starts here.</p>
              </div>

              <Link to="/courses">
                <Button variant="light">Explore Courses →</Button>
              </Link>
            </div>

            <Row className="g-3 mb-4">
              <Col sm={6} xl={4}>
                <Card className="dashboard-stat h-100">
                  <Card.Body>
                    <div className="stat-icon">📚</div>
                    <p>Available Courses</p>
                    <h2>{loading ? "…" : courses.length}</h2>
                    <small>Courses in LearnHub</small>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={6} xl={4}>
                <Card className="dashboard-stat h-100">
                  <Card.Body>
                    <div className="stat-icon">🎯</div>
                    <p>My Enrolled Courses</p>
                    <h2>{enrollmentLoading ? "…" : enrollments.length}</h2>
                    <small>Courses you have joined</small>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={6} xl={4}>
                <Card className="dashboard-stat h-100">
                  <Card.Body>
                    <div className="stat-icon">👤</div>
                    <p>My Profile</p>
                    <h5>{user?.name || "Student"}</h5>
                    <small>{user?.email || "Email unavailable"}</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="dashboard-panel mb-4" id="my-courses">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                  <div>
                    <h4>My Learning</h4>
                    <p className="text-secondary mb-0">
                      Your enrolled courses appear here.
                    </p>
                  </div>

                  <Link to="/courses">Browse all →</Link>
                </div>

                {loading && (
                  <div className="text-center py-3">
                    <Spinner animation="border" />
                  </div>
                )}

                {error && <Alert variant="danger">{error}</Alert>}

                {enrollmentLoading && (
                  <div className="text-center py-3">
                    <Spinner animation="border" />
                    <p className="mt-2">Loading your courses...</p>
                  </div>
                )}

                {enrollmentError && (
                  <Alert variant="danger">{enrollmentError}</Alert>
                )}

                {!enrollmentLoading &&
                  !enrollmentError &&
                  enrollments.length === 0 && (
                    <Alert variant="info">
                      You have not enrolled in any courses yet. Explore
                      LearnHub courses and click Enroll Now to start learning.
                      <div className="mt-3">
                        <Button as={Link} to="/courses" variant="primary">
                          Explore Courses
                        </Button>
                      </div>
                    </Alert>
                  )}

                <Row className="g-3">
                  {enrollments.map((enrollment) => {
                    const course = enrollment.course;

                    if (!course) return null;

                    return (
                      <Col md={6} xl={4} key={enrollment._id}>
                        <Card className="dashboard-course h-100">
                          <Card.Img
                            variant="top"
                            src={
                              course.image ||
                              "https://placehold.co/600x400/172554/FFFFFF?text=LearnHub"
                            }
                            alt={course.title}
                            style={{
                              height: "190px",
                              objectFit: "cover",
                            }}
                          />

                          <Card.Body className="d-flex flex-column">
                            <small className="course-category">
                              {course.category}
                            </small>

                            <h5 className="mt-2">{course.title}</h5>

                            <p className="text-secondary">
                              Instructor: {course.instructor}
                            </p>

                            <p className="mb-2">
                              Status:{" "}
                              <strong>
                                {enrollment.status || "active"}
                              </strong>
                            </p>

                            <ProgressBar
                              now={enrollment.progress || 0}
                              label={`${enrollment.progress || 0}%`}
                              className="mb-3"
                            />

                            <Button
                              as={Link}
                              to={`/courses/${course._id}`}
                              variant="primary"
                              className="w-100 mt-auto"
                            >
                              View Course →
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </Card.Body>
            </Card>

            <Row className="g-3" id="progress">
              <Col lg={7}>
                <Card className="dashboard-panel h-100">
                  <Card.Body className="p-4">
                    <h4>Learning Progress</h4>
                    <p className="text-secondary">
                      Your average progress across enrolled courses.
                    </p>

                    <ProgressBar
                      now={averageProgress}
                      label={`${averageProgress}%`}
                    />

                    <small className="text-secondary d-block mt-2">
                      Progress will increase when lesson tracking is added.
                    </small>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={5}>
                <Card className="dashboard-panel h-100">
                  <Card.Body className="p-4">
                    <h4>Recent Activity</h4>
                    <p className="text-secondary mb-2">
                      <span className="activity-dot" /> Welcome to LearnHub
                    </p>
                    <p className="text-secondary mb-0">
                      <span className="activity-dot" /> Enrolled courses:
                      {" "}{enrollmentLoading ? "…" : enrollments.length}
                    </p>
                    <small className="text-secondary d-block mt-3">
                      Lesson completion tracking can be added in the next stage.
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default StudentDashboard;