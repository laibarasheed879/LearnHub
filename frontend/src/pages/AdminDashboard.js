
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/courses`;

const emptyForm = {
  title: "",
  description: "",
  instructor: "",
  category: "",
  price: "0",
  image: "",
  duration: "4 weeks",
  level: "Beginner",
};

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ ...emptyForm });

  const loadCourses = async () => {
    try {
      const response = await axios.get(API_URL);
      setCourses(response.data);
    } catch {
      setError("Courses are not available . Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("learnhubToken");

      if (!token) {
        throw new Error("Please login to your admin account.");
      }

      const courseData = {
        ...form,
        price: Number(form.price),
      };

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (editingId) {
        await axios.put(
          `${API_URL}/${editingId}`,
          courseData,
          config
        );
        setMessage("Course updated successfully!");
      } else {
        await axios.post(API_URL, courseData, config);
        setMessage("Course added successfully!");
      }

      resetForm();
      await loadCourses();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Operation failed. Check your admin access."
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
      instructor: course.instructor || "",
      category: course.category || "",
      price: String(course.price ?? 0),
      image: course.image || "",
      duration: course.duration || "4 weeks",
      level: course.level || "Beginner",
    });

    setMessage("");
    setError("");
    document.getElementById("add-course")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleDelete = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"?`
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("learnhubToken");

      await axios.delete(`${API_URL}/${course._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Course deleted successfully!");

      if (editingId === course._id) {
        resetForm();
      }

      await loadCourses();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Course is not deleted. check admin access."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("learnhubToken");
    localStorage.removeItem("learnhubUser");
    window.dispatchEvent(new Event("learnhub-auth-change"));
    window.location.href = "/";
  };

  return (
    <div className="dashboard-page admin-dashboard-page">
      <Container fluid className="py-4 px-3 px-lg-4">
        <Row className="g-4">
          <Col lg={3} xl={2}>
            <Card className="dashboard-sidebar admin-sidebar">
              <Card.Body className="d-flex flex-column">
                <Link to="/" className="admin-sidebar-brand">
                  Learn<span>Hub</span>
                </Link>

                <p className="sidebar-label mt-4">ADMIN WORKSPACE</p>

                <a className="sidebar-link active" href="#overview">
                  <span>▦</span> Overview
                </a>
                <a className="sidebar-link" href="#manage-courses">
                  <span>▣</span> Manage Courses
                </a>
                <a
                  className="sidebar-link"
                  href="#add-course"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ ...emptyForm });
                  }}
                >
                  <span>＋</span> Add Course
                </a>
                <Link to="/" className="sidebar-link">
                  <span>⌂</span> View Website
                </Link>

                <div className="sidebar-bottom">
                  <div className="admin-profile">
                    <div className="admin-avatar">A</div>
                    <div>
                      <strong>Administrator</strong>
                      <small>Manage your platform</small>
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
                  <p className="dashboard-eyebrow">
                    ADMIN CONTROL CENTER
                  </p>
                  <h1>Admin Dashboard</h1>
                  <p>
                    Manage your courses and keep LearnHub up to date.
                  </p>
                </div>

                <div className="admin-total">
                  <small>Total Courses</small>
                  <h2>{courses.length}</h2>
                  <span>Courses in your catalogue</span>
                </div>
              </div>

              {message && (
                <Alert
                  variant="success"
                  dismissible
                  onClose={() => setMessage("")}
                >
                  {message}
                </Alert>
              )}

              {error && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              <Card
                className="dashboard-panel admin-form-panel mb-4"
                id="add-course"
              >
                <Card.Body className="p-3 p-md-4">
                  <div className="admin-section-heading mb-4">
                    <div>
                      <p className="dashboard-eyebrow">
                        COURSE MANAGEMENT
                      </p>
                      <h4>
                        {editingId ? "Edit Course" : "Add New Course"}
                      </h4>
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
                        <Form.Label>Instructor</Form.Label>
                        <Form.Control
                          name="instructor"
                          value={form.instructor}
                          onChange={handleChange}
                          placeholder="Instructor name"
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
                        <Form.Label>Price (PKR)</Form.Label>
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

                      <Col xs={12}>
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
                              <Spinner
                                size="sm"
                                className="me-2"
                              />
                              Saving...
                            </>
                          ) : editingId ? (
                            "Save Changes"
                          ) : (
                            "+ Add Course"
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

              <Card
                className="dashboard-panel admin-courses-panel"
                id="manage-courses"
              >
                <Card.Body className="p-3 p-md-4">
                  <div className="admin-section-heading mb-3">
                    <div>
                      <p className="dashboard-eyebrow">
                        YOUR CATALOGUE
                      </p>
                      <h4>Manage Courses</h4>
                    </div>
                    <Badge bg="secondary">{courses.length} total</Badge>
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" />
                      <p className="mt-2">Loading courses...</p>
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="admin-empty-state">
                      <h5>No courses yet</h5>
                      <p>Add your first course using the form above.</p>
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
                                {course.instructor}
                              </small>
                            </td>
                            <td>{course.category}</td>
                            <td>
                              <Badge bg="info" text="dark">
                                {course.level}
                              </Badge>
                            </td>
                            <td>
                              PKR{" "}
                              {Number(course.price || 0).toLocaleString()}
                            </td>
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
                              </div>
                            </td>
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

export default AdminDashboard;
