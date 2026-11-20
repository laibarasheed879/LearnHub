
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Globe,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plus,
  Tags,
  Trash2,
} from "lucide-react";
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
import { API_BASE_URL } from "../services/apiConfig";
import {
  deleteAdminUser,
  getAdminAnalytics,
  getAdminUsers,
  updateAdminUserRole,
} from "../services/adminService";

const API_URL = `${API_BASE_URL}/courses`;

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
  const [adminUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("learnhubUser") || "null");
    } catch {
      return null;
    }
  });
  const [activeSection, setActiveSection] = useState("overview");
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userActionId, setUserActionId] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ ...emptyForm });
  const adminName =
    adminUser?.name?.trim() ||
    adminUser?.email?.split("@")[0] ||
    "Administrator";
  const categoryCount = new Set(
    courses.map((course) => course.category?.trim()).filter(Boolean)
  ).size;

  const loadCourses = async () => {
    try {
      const response = await axios.get(API_URL);
      setCourses(response.data);
    } catch {
      setError("Courses could not be loaded. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    setUsersLoading(true);
    try {
      const [userData, analyticsData] = await Promise.all([
        getAdminUsers(),
        getAdminAnalytics(),
      ]);
      setUsers(userData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load users and platform analytics."
      );
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    loadAdminData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  const handleAddCourse = () => {
    resetForm();
    setActiveSection("add-course");
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
    setActiveSection("add-course");
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

  const handleRoleChange = async (user, role) => {
    setMessage("");
    setError("");
    setUserActionId(user._id);
    try {
      const result = await updateAdminUserRole(user._id, role);
      setUsers((currentUsers) =>
        currentUsers.map((current) =>
          current._id === user._id ? result.user : current
        )
      );
      setMessage(result.message);
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update user role.");
    } finally {
      setUserActionId("");
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete the account for ${user.name}?`)) return;
    setMessage("");
    setError("");
    setUserActionId(user._id);
    try {
      const result = await deleteAdminUser(user._id);
      setMessage(result.message);
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete this user.");
    } finally {
      setUserActionId("");
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
      <Container fluid className="admin-dashboard-container py-3 py-xl-4 px-3 px-xl-4">
        <Row className="g-4 admin-layout-row">
          <Col lg={3} xl={2} className="admin-sidebar-column">
            <aside className="admin-sidebar">
              <Link to="/" className="admin-sidebar-brand" aria-label="LearnHub home">
                Learn<span>Hub</span>
              </Link>
              <p className="admin-workspace-label">ADMIN WORKSPACE</p>

              <nav className="admin-sidebar-nav" aria-label="Admin workspace">
                <a
                  className={`sidebar-link ${activeSection === "overview" ? "active" : ""}`}
                  href="#overview"
                  aria-current={activeSection === "overview" ? "page" : undefined}
                  onClick={() => setActiveSection("overview")}
                >
                  <LayoutDashboard size={18} aria-hidden="true" />
                  <span>Overview</span>
                </a>
                <a className="sidebar-link" href="#manage-users">
                  <span>♙</span> Manage Users
                </a>
                <a className="sidebar-link" href="#analytics">
                  <span>▤</span> Analytics
                </a>
                <a
                  className={`sidebar-link ${activeSection === "manage-courses" ? "active" : ""}`}
                  href="#manage-courses"
                  aria-current={activeSection === "manage-courses" ? "page" : undefined}
                  onClick={() => setActiveSection("manage-courses")}
                >
                  <BookOpen size={18} aria-hidden="true" />
                  <span>Manage courses</span>
                </a>
                <a
                  className={`sidebar-link ${activeSection === "add-course" ? "active" : ""}`}
                  href="#add-course"
                  aria-current={activeSection === "add-course" ? "page" : undefined}
                  onClick={handleAddCourse}
                >
                  <Plus size={18} aria-hidden="true" />
                  <span>Add course</span>
                </a>
                <Link to="/" className="sidebar-link">
                  <Globe size={18} aria-hidden="true" />
                  <span>View website</span>
                </Link>
              </nav>

              <div className="sidebar-bottom">
                <div className="admin-profile">
                  <div className="admin-avatar" aria-hidden="true">
                    {adminName.charAt(0).toUpperCase()}
                  </div>
                  <div className="admin-profile-copy">
                    <strong>{adminName}</strong>
                    <small>Administrator</small>
                  </div>
                </div>
                <button
                  type="button"
                  className="sidebar-link logout-link"
                  onClick={logout}
                >
                  <LogOut size={18} aria-hidden="true" />
                  <span>Sign out</span>
                </button>
              </div>
            </aside>
          </Col>

          <Col lg={9} xl={10} className="admin-content-column">
            <section id="overview" className="admin-main-content">
              <div className="admin-topbar">
                <div className="admin-breadcrumb">
                  <span>Workspace</span>
                  <ChevronRight size={15} aria-hidden="true" />
                  <strong>Overview</strong>
                </div>
                <Link to="/" className="admin-topbar-link">
                  <Globe size={16} aria-hidden="true" />
                  <span>View website</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>

              <div className="admin-welcome mb-4">
                <div>
                  <p className="dashboard-eyebrow">LEARNHUB ADMIN</p>
                  <h1>Welcome back, {adminName.split(" ")[0]}</h1>
                  <p>Manage your course catalogue and learning content.</p>
                </div>
                <div className="admin-welcome-note">
                  <BookOpen size={18} aria-hidden="true" />
                  <span>Course operations</span>
                </div>
              </div>

              <section className="admin-stats-grid" aria-label="Catalogue statistics">
                <Card className="admin-stat-card">
                  <Card.Body>
                    <div className="admin-stat-icon" aria-hidden="true">
                      <BookOpen size={19} />
                    </div>
                    <div className="admin-stat-copy">
                      <span>Total courses</span>
                      <strong>{loading ? "—" : courses.length}</strong>
                      <small>Courses in your catalogue</small>
                    </div>
                  </Card.Body>
                </Card>
                <Card className="admin-stat-card">
                  <Card.Body>
                    <div className="admin-stat-icon admin-stat-icon-muted" aria-hidden="true">
                      <Tags size={19} />
                    </div>
                    <div className="admin-stat-copy">
                      <span>Course categories</span>
                      <strong>{loading ? "—" : categoryCount}</strong>
                      <small>Distinct categories in the catalogue</small>
                    </div>
                  </Card.Body>
                </Card>
              </section>

              <section className="admin-quick-actions" aria-labelledby="quick-actions-title">
                <div>
                  <p className="admin-section-kicker">QUICK ACTIONS</p>
                  <h2 id="quick-actions-title">Keep your catalogue moving</h2>
                </div>
                <div className="admin-action-links">
                  <a href="#add-course" className="admin-action-link" onClick={handleAddCourse}>
                    <span className="admin-action-icon" aria-hidden="true">
                      <Plus size={18} />
                    </span>
                    <span className="admin-action-copy">
                      <strong>Add a course</strong>
                      <small>Create a new catalogue entry</small>
                    </span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                  <a
                    href="#manage-courses"
                    className="admin-action-link"
                    onClick={() => setActiveSection("manage-courses")}
                  >
                    <span className="admin-action-icon admin-action-icon-muted" aria-hidden="true">
                      <BookOpen size={18} />
                    </span>
                    <span className="admin-action-copy">
                      <strong>Manage courses</strong>
                      <small>Review and update your catalogue</small>
                    </span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                </div>
              </section>

              <Row className="g-3 mb-4" id="analytics">
                {[
                  ["Users", analytics?.users],
                  ["Courses", analytics?.courses],
                  ["Students", analytics?.usersByRole?.student],
                  ["Instructors", analytics?.usersByRole?.instructor],
                  ["Enrollments", analytics?.enrollments],
                  [
                    "Average Progress",
                    analytics ? `${analytics.averageProgress}%` : null,
                  ],
                ].map(([label, value]) => (
                  <Col key={label} sm={6} xl>
                    <Card className="dashboard-stat h-100">
                      <Card.Body>
                        <p>{label}</p>
                        <h2>{value ?? (usersLoading ? "…" : 0)}</h2>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {message && (
                <Alert
                  variant="success"
                  dismissible
                  role="status"
                  onClose={() => setMessage("")}
                >
                  {message}
                </Alert>
              )}

              {error && (
                <Alert
                  variant="danger"
                  dismissible
                  role="alert"
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
                      <p className="admin-section-kicker">COURSE MANAGEMENT</p>
                      <h2>
                        {editingId ? "Edit course" : "Add a course"}
                      </h2>
                      <p className="admin-section-description">
                        {editingId
                          ? "Update the details for this catalogue entry."
                          : "Add course details to your LearnHub catalogue."}
                      </p>
                    </div>
                    <Badge bg={editingId ? "warning" : "primary"}>
                      {editingId ? "EDITING" : "NEW COURSE"}
                    </Badge>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label htmlFor="admin-course-title">Course Title</Form.Label>
                        <Form.Control
                          id="admin-course-title"
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          placeholder="e.g. React Development"
                          required
                        />
                      </Col>

                      <Col md={6}>
                        <Form.Label htmlFor="admin-course-instructor">Instructor</Form.Label>
                        <Form.Control
                          id="admin-course-instructor"
                          name="instructor"
                          value={form.instructor}
                          onChange={handleChange}
                          placeholder="Instructor name"
                          required
                        />
                      </Col>

                      <Col md={6}>
                        <Form.Label htmlFor="admin-course-category">Category</Form.Label>
                        <Form.Control
                          id="admin-course-category"
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          placeholder="e.g. Web Development"
                          required
                        />
                      </Col>

                      <Col md={6}>
                        <Form.Label htmlFor="admin-course-price">Price (PKR)</Form.Label>
                        <Form.Control
                          id="admin-course-price"
                          type="number"
                          name="price"
                          min="0"
                          value={form.price}
                          onChange={handleChange}
                          required
                        />
                      </Col>

                      <Col md={6}>
                        <Form.Label htmlFor="admin-course-duration">Duration</Form.Label>
                        <Form.Control
                          id="admin-course-duration"
                          name="duration"
                          value={form.duration}
                          onChange={handleChange}
                          placeholder="e.g. 6 weeks"
                          required
                        />
                      </Col>

                      <Col md={6}>
                        <Form.Label htmlFor="admin-course-level">Course Level</Form.Label>
                        <Form.Select
                          id="admin-course-level"
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
                        <Form.Label htmlFor="admin-course-image">Image URL (optional)</Form.Label>
                        <Form.Control
                          id="admin-course-image"
                          name="image"
                          type="url"
                          value={form.image}
                          onChange={handleChange}
                          placeholder="https://..."
                        />
                      </Col>

                      <Col xs={12}>
                        <Form.Label htmlFor="admin-course-description">Description</Form.Label>
                        <Form.Control
                          id="admin-course-description"
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
                      <p className="admin-section-kicker">YOUR CATALOGUE</p>
                      <h2>Manage courses</h2>
                      <p className="admin-section-description">
                        Course information is loaded from your existing catalogue.
                      </p>
                    </div>
                    <Badge bg="light" text="dark" className="admin-count-badge">
                      {loading ? "Loading" : `${courses.length} ${courses.length === 1 ? "course" : "courses"}`}
                    </Badge>
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" role="status" />
                      <p className="mt-2">Loading courses...</p>
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="admin-empty-state">
                      <BookOpen size={24} aria-hidden="true" />
                      <h3>No courses in the catalogue</h3>
                      <p>Add your first course using the form above.</p>
                    </div>
                  ) : (
                    <Table responsive hover className="admin-course-table">
                      <thead>
                        <tr>
                          <th scope="col">Course</th>
                          <th scope="col">Category</th>
                          <th scope="col">Level</th>
                          <th scope="col">Price</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course) => (
                          <tr key={course._id}>
                            <td className="admin-course-name-cell">
                              <strong>{course.title}</strong>
                              <small className="d-block text-secondary">
                                {course.instructor}
                              </small>
                              {course.description && (
                                <small className="admin-course-description d-block">
                                  {course.description}
                                </small>
                              )}
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
                                  aria-label={`Edit ${course.title}`}
                                  onClick={() => handleEdit(course)}
                                >
                                  <Pencil size={14} aria-hidden="true" />
                                  <span>Edit</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  aria-label={`Delete ${course.title}`}
                                  onClick={() => handleDelete(course)}
                                >
                                  <Trash2 size={14} aria-hidden="true" />
                                  <span>Delete</span>
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

              <Card className="dashboard-panel mt-4" id="manage-users">
                <Card.Body className="p-3 p-md-4">
                  <div className="admin-section-heading mb-3">
                    <div>
                      <p className="dashboard-eyebrow">ACCOUNT MANAGEMENT</p>
                      <h4>Manage Users</h4>
                    </div>
                    <Badge bg="secondary">{users.length} total</Badge>
                  </div>
                  {usersLoading ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" />
                      <p className="mt-2">Loading users...</p>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="admin-empty-state">No user accounts found.</div>
                  ) : (
                    <Table responsive hover className="admin-course-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <Form.Select
                                aria-label={`Role for ${user.name}`}
                                value={user.role}
                                disabled={userActionId === user._id}
                                onChange={(event) =>
                                  handleRoleChange(user, event.target.value)
                                }
                              >
                                <option value="student">Student</option>
                                <option value="instructor">Instructor</option>
                                <option value="admin">Admin</option>
                              </Form.Select>
                            </td>
                            <td>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                disabled={userActionId === user._id}
                                onClick={() => handleDeleteUser(user)}
                              >
                                Delete
                              </Button>
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
