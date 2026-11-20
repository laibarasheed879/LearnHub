import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  deleteInstructorCourse,
  getInstructorCourses,
  getInstructorEnrollments,
  saveInstructorCourse,
} from "../services/courseService";
import {
  deleteCourseLesson,
  downloadCourseLesson,
  getCourseLessons,
  uploadCourseLesson,
} from "../services/lessonService";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  price: "0",
  image: "",
  duration: "4 weeks",
  level: "Beginner",
};

function InstructorDashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("learnhubUser")) || null;
    } catch {
      return null;
    }
  });
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [lessonCourse, setLessonCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonFile, setLessonFile] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonSaving, setLessonSaving] = useState(false);
  const [lessonError, setLessonError] = useState("");
  const [form, setForm] = useState({ ...emptyForm });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const courseData = await getInstructorCourses();
      setCourses(courseData);

      try {
        const enrollmentData = await getInstructorEnrollments();
        setEnrollments(enrollmentData);
      } catch (err) {
        setEnrollments([]);
        setError(
          err.response?.data?.message ||
            "Unable to load enrolled students."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      await saveInstructorCourse(
        { ...form, price: Number(form.price) },
        editingId
      );
      setMessage(editingId ? "Course updated successfully." : "Course created successfully.");
      resetForm();
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save this course."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    setForm({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      price: String(course.price ?? 0),
      image: course.image || "",
      duration: course.duration || "4 weeks",
      level: course.level || "Beginner",
    });
    setMessage("");
    setError("");
    document.getElementById("instructor-course-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.title}"?`)) return;
    setMessage("");
    setError("");
    try {
      await deleteInstructorCourse(course._id);
      setMessage("Course deleted successfully.");
      if (editingId === course._id) resetForm();
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete this course."
      );
    }
  };

  const selectLessonCourse = async (course) => {
    setLessonCourse(course);
    setLessons([]);
    setLessonError("");
    setLessonLoading(true);
    try {
      setLessons(await getCourseLessons(course._id));
    } catch (err) {
      setLessonError(
        err.response?.data?.message || "Unable to load course lessons."
      );
    } finally {
      setLessonLoading(false);
    }
  };

  const handleLessonSubmit = async (event) => {
    event.preventDefault();
    if (!lessonCourse || !lessonFile) return;
    setLessonError("");
    setLessonSaving(true);
    try {
      const result = await uploadCourseLesson(
        lessonCourse._id,
        lessonTitle,
        lessonFile
      );
      setMessage(result.message);
      setLessonTitle("");
      setLessonFile(null);
      event.target.reset();
      await selectLessonCourse(lessonCourse);
    } catch (err) {
      setLessonError(
        err.response?.data?.message || "Unable to upload this lesson."
      );
    } finally {
      setLessonSaving(false);
    }
  };

  const handleLessonDownload = async (lesson) => {
    try {
      const file = await downloadCourseLesson(lessonCourse._id, lesson._id);
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = lesson.fileName;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setLessonError(
        err.response?.data?.message || "Unable to download this lesson."
      );
    }
  };

  const handleLessonDelete = async (lesson) => {
    if (!window.confirm(`Delete lesson "${lesson.title}"?`)) return;
    setLessonError("");
    try {
      await deleteCourseLesson(lessonCourse._id, lesson._id);
      setLessons((currentLessons) =>
        currentLessons.filter((current) => current._id !== lesson._id)
      );
      setMessage("Lesson deleted successfully.");
    } catch (err) {
      setLessonError(
        err.response?.data?.message || "Unable to delete this lesson."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("learnhubToken");
    localStorage.removeItem("learnhubUser");
    window.dispatchEvent(new Event("learnhub-auth-change"));
    navigate("/");
  };

  return (
    <div className="admin-dashboard-page">
      <Container fluid className="py-4 px-3 px-lg-4">
        <Row className="g-4">
          <Col lg={3} xl={2}>
            <Card className="dashboard-sidebar admin-sidebar">
              <Card.Body className="d-flex flex-column">
                <Link to="/" className="admin-sidebar-brand">
                  Learn<span>Hub</span>
                </Link>
                <p className="sidebar-label mt-4">INSTRUCTOR WORKSPACE</p>
                <a className="sidebar-link active" href="#overview">
                  <span>▦</span> Overview
                </a>
                <a className="sidebar-link" href="#my-courses">
                  <span>▣</span> My Courses
                </a>
                <a className="sidebar-link" href="#students">
                  <span>♙</span> Enrolled Students
                </a>
                <a
                  className="sidebar-link"
                  href="#instructor-course-form"
                  onClick={() => {
                    resetForm();
                    setMessage("");
                    setError("");
                  }}
                >
                  <span>＋</span> Create Course
                </a>
                <Link to="/courses" className="sidebar-link">
                  <span>⌕</span> View Website
                </Link>

                <div className="sidebar-bottom">
                  <div className="admin-profile">
                    <div className="admin-avatar">
                      {(user?.name || "I").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{user?.name || "Instructor"}</strong>
                      <small>Instructor account</small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="sidebar-link logout-link"
                    onClick={logout}
                  >
                    <span>↪</span> Logout
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9} xl={10}>
            <section id="overview" className="admin-main-content">
              <div className="dashboard-welcome admin-welcome mb-4">
                <div>
                  <p className="dashboard-eyebrow">INSTRUCTOR WORKSPACE</p>
                  <h1>Welcome, {user?.name || "Instructor"}!</h1>
                  <p>Create and manage your courses and follow your students.</p>
                </div>
                <div className="admin-total">
                  <small>My Courses</small>
                  <h2>{loading ? "…" : courses.length}</h2>
                  <span>Courses assigned to you</span>
                </div>
              </div>

              {message && (
                <Alert variant="success" dismissible onClose={() => setMessage("")}>
                  {message}
                </Alert>
              )}
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              <Card
                className="dashboard-panel admin-form-panel mb-4"
                id="instructor-course-form"
              >
                <Card.Body className="p-3 p-md-4">
                  <div className="admin-section-heading mb-4">
                    <div>
                      <p className="dashboard-eyebrow">COURSE MANAGEMENT</p>
                      <h4>{editingId ? "Edit Course" : "Create Course"}</h4>
                    </div>
                    <Badge bg={editingId ? "warning" : "primary"}>
                      {editingId ? "EDIT MODE" : "NEW COURSE"}
                    </Badge>
                  </div>
                  <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>Course Title</Form.Label>
                        <Form.Control
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          placeholder="e.g. React Development"
                          required
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          placeholder="e.g. Web Development"
                          required
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          min="0"
                          value={form.price}
                          onChange={handleChange}
                          required
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Duration</Form.Label>
                        <Form.Control
                          name="duration"
                          value={form.duration}
                          onChange={handleChange}
                          placeholder="e.g. 6 weeks"
                          required
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Course Level</Form.Label>
                        <Form.Select
                          name="level"
                          value={form.level}
                          onChange={handleChange}
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </Form.Select>
                      </Col>
                      <Col md={6}>
                        <Form.Label>Image URL (optional)</Form.Label>
                        <Form.Control
                          name="image"
                          type="url"
                          value={form.image}
                          onChange={handleChange}
                          placeholder="https://..."
                        />
                      </Col>
                      <Col xs={12}>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          placeholder="What will students learn?"
                          required
                        />
                      </Col>
                      <Col xs={12} className="d-flex flex-wrap gap-2">
                        <Button type="submit" disabled={saving}>
                          {saving ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Saving...
                            </>
                          ) : editingId ? (
                            "Save Changes"
                          ) : (
                            "+ Create Course"
                          )}
                        </Button>
                        {editingId && (
                          <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={resetForm}
                          >
                            Cancel Edit
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>

              <Card className="dashboard-panel admin-courses-panel mb-4" id="my-courses">
                <Card.Body className="p-3 p-md-4">
                  <div className="admin-section-heading mb-3">
                    <div>
                      <p className="dashboard-eyebrow">YOUR CATALOGUE</p>
                      <h4>My Courses</h4>
                    </div>
                    <Badge bg="secondary">{courses.length} total</Badge>
                  </div>
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" />
                      <p className="mt-2">Loading your courses...</p>
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="admin-empty-state">
                      <h5>No courses yet</h5>
                      <p>Create your first course using the form above.</p>
                    </div>
                  ) : (
                    <Table responsive hover className="admin-course-table">
                      <thead>
                        <tr>
                          <th>Course</th>
                          <th>Category</th>
                          <th>Level</th>
                          <th>Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course) => (
                          <tr key={course._id}>
                            <td>
                              <strong>{course.title}</strong>
                              <small className="d-block text-secondary">
                                {course.duration}
                              </small>
                            </td>
                            <td>{course.category}</td>
                            <td>
                              <Badge bg="info" text="dark">{course.level}</Badge>
                            </td>
                            <td>{Number(course.price || 0).toLocaleString()}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => handleEdit(course)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleDelete(course)}
                                >
                                  Delete
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  onClick={() => selectLessonCourse(course)}
                                >
                                  Lessons
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>

              {lessonCourse && (
                <Card className="dashboard-panel mb-4" id="course-lessons">
                  <Card.Body className="p-3 p-md-4">
                    <div className="admin-section-heading mb-3">
                      <div>
                        <p className="dashboard-eyebrow">COURSE CONTENT</p>
                        <h4>Lessons: {lessonCourse.title}</h4>
                      </div>
                      <Button
                        variant="outline-secondary"
                        onClick={() => setLessonCourse(null)}
                      >
                        Close
                      </Button>
                    </div>
                    {lessonError && (
                      <Alert variant="danger">{lessonError}</Alert>
                    )}
                    <Form onSubmit={handleLessonSubmit} className="mb-4">
                      <Row className="g-3 align-items-end">
                        <Col md={4}>
                          <Form.Label>Lesson title</Form.Label>
                          <Form.Control
                            value={lessonTitle}
                            onChange={(event) =>
                              setLessonTitle(event.target.value)
                            }
                            required
                          />
                        </Col>
                        <Col md={5}>
                          <Form.Label>Lesson file (max 4 MB)</Form.Label>
                          <Form.Control
                            type="file"
                            accept=".pdf,.txt,.mp4,.mov,.webm,application/pdf,text/plain,video/mp4,video/quicktime,video/webm"
                            onChange={(event) =>
                              setLessonFile(event.target.files?.[0] || null)
                            }
                            required
                          />
                        </Col>
                        <Col md={3}>
                          <Button
                            type="submit"
                            className="w-100"
                            disabled={lessonSaving}
                          >
                            {lessonSaving ? "Uploading..." : "Upload Lesson"}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                    {lessonLoading ? (
                      <div className="text-center py-3">
                        <Spinner animation="border" />
                      </div>
                    ) : lessons.length === 0 ? (
                      <p className="text-secondary mb-0">
                        No lessons uploaded for this course yet.
                      </p>
                    ) : (
                      <Table responsive hover className="admin-course-table">
                        <thead>
                          <tr>
                            <th>Lesson</th>
                            <th>File</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lessons.map((lesson) => (
                            <tr key={lesson._id}>
                              <td>{lesson.title}</td>
                              <td>{lesson.fileName}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline-primary"
                                    onClick={() => handleLessonDownload(lesson)}
                                  >
                                    Download
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => handleLessonDelete(lesson)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              )}

              <Card className="dashboard-panel" id="students">
                <Card.Body className="p-3 p-md-4">
                  <div className="admin-section-heading mb-3">
                    <div>
                      <p className="dashboard-eyebrow">LEARNER ACTIVITY</p>
                      <h4>Enrolled Students</h4>
                    </div>
                    <Badge bg="secondary">{enrollments.length} enrollments</Badge>
                  </div>
                  {loading ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" />
                    </div>
                  ) : enrollments.length === 0 ? (
                    <div className="admin-empty-state">
                      <h5>No students enrolled yet</h5>
                      <p>Students enrolled in your courses will appear here.</p>
                    </div>
                  ) : (
                    <Table responsive hover className="admin-course-table">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Email</th>
                          <th>Course</th>
                          <th>Status</th>
                          <th>Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollments.map((enrollment) => (
                          <tr key={enrollment._id}>
                            <td>{enrollment.student?.name || "Unknown student"}</td>
                            <td>{enrollment.student?.email || "Unavailable"}</td>
                            <td>{enrollment.course?.title || "Unavailable"}</td>
                            <td>{enrollment.status || "active"}</td>
                            <td>{enrollment.progress || 0}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </section>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default InstructorDashboard;
