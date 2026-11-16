
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
  Form,
} from "react-bootstrap";
import { getCourses } from "../services/courseService";
import { enrollInCourse } from "../services/enrollmentService";
import { toast } from "react-toastify";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  RotateCcw,
  Search,
  UserRound,
} from "lucide-react";

const getDistinctValues = (values) => {
  const uniqueValues = new Map();

  values.forEach((value) => {
    const label = String(value ?? "").trim();
    const normalized = label.toLocaleLowerCase();

    if (label && !uniqueValues.has(normalized)) {
      uniqueValues.set(normalized, label);
    }
  });

  return Array.from(uniqueValues.values()).sort((first, second) =>
    first.localeCompare(second)
  );
};

const formatCoursePrice = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Price unavailable";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    return "Price unavailable";
  }

  return amount === 0 ? "Free" : `Rs. ${amount.toLocaleString("en-PK")}`;
};

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollingId, setEnrollingId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const navigate = useNavigate();

  const categories = useMemo(
    () => getDistinctValues(courses.map((course) => course.category)),
    [courses]
  );
  const levels = useMemo(
    () => getDistinctValues(courses.map((course) => course.level)),
    [courses]
  );
  const hasPriceData = courses.some(
    (course) =>
      course.price !== null &&
      course.price !== undefined &&
      course.price !== "" &&
      Number.isFinite(Number(course.price))
  );
  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase();

    return courses.filter((course) => {
      const searchableText = [
        course.title,
        course.description,
        course.instructor,
        course.category,
        course.level,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      if (normalizedSearch && !searchableText.includes(normalizedSearch)) {
        return false;
      }

      if (
        categoryFilter &&
        String(course.category ?? "").toLocaleLowerCase() !==
          categoryFilter.toLocaleLowerCase()
      ) {
        return false;
      }

      if (
        levelFilter &&
        String(course.level ?? "").toLocaleLowerCase() !==
          levelFilter.toLocaleLowerCase()
      ) {
        return false;
      }

      const price =
        course.price === null || course.price === undefined || course.price === ""
          ? Number.NaN
          : Number(course.price);

      if (priceFilter === "free" && price !== 0) {
        return false;
      }

      if (priceFilter === "paid" && !(price > 0)) {
        return false;
      }

      return true;
    });
  }, [courses, searchTerm, categoryFilter, levelFilter, priceFilter]);

  const hasActiveFilters = Boolean(
    searchTerm.trim() || categoryFilter || levelFilter || priceFilter
  );

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setLevelFilter("");
    setPriceFilter("");
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        setError("The course catalog could not load. Please try again when the course service is available.");
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
      <main className="courses-page courses-state-page">
        <Container className="courses-status text-center">
          <Spinner animation="border" variant="primary" />
          <h5 className="mt-3">Finding your next learning opportunity...</h5>
        </Container>
      </main>
    );
  }

  return (
    <main className="courses-page">
      <section className="courses-heading">
        <Container>
          <div className="courses-heading-content">
            <Badge className="courses-eyebrow">YOUR LEARNING JOURNEY</Badge>
            <h1>
              Explore Our <span>Courses</span>
            </h1>
            <p>
              Discover new skills, learn from expert instructors, and turn your
              ambitions into achievements.
            </p>
            <div className="courses-heading-stats">
              <div>
                <strong>{courses.length}</strong>
                <span>
                  {courses.length === 1 ? "Available course" : "Available courses"}
                </span>
              </div>
              <div>
                <strong>Flexible</strong>
                <span>Learn at your own pace</span>
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

          <div
            className={`courses-filter-panel ${
              hasPriceData ? "has-price-filter" : ""
            }`}
            role="search"
            aria-label="Search and filter courses"
          >
            <Form.Group className="courses-filter-field courses-search-field">
              <Form.Label htmlFor="course-search">Search courses</Form.Label>
              <div className="courses-search-control">
                <Search size={18} aria-hidden="true" />
                <Form.Control
                  id="course-search"
                  type="search"
                  placeholder="Search by title, topic, or instructor"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </Form.Group>

            <Form.Group className="courses-filter-field">
              <Form.Label htmlFor="course-category">Category</Form.Label>
              <Form.Select
                id="course-category"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="courses-filter-field">
              <Form.Label htmlFor="course-level">Course level</Form.Label>
              <Form.Select
                id="course-level"
                value={levelFilter}
                onChange={(event) => setLevelFilter(event.target.value)}
              >
                <option value="">All levels</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {hasPriceData && (
              <Form.Group className="courses-filter-field">
                <Form.Label htmlFor="course-price">Price</Form.Label>
                <Form.Select
                  id="course-price"
                  value={priceFilter}
                  onChange={(event) => setPriceFilter(event.target.value)}
                >
                  <option value="">Any price</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </Form.Select>
              </Form.Group>
            )}
          </div>

          <div className="courses-filter-summary">
            <p aria-live="polite">
              Showing {filteredCourses.length} of {courses.length} {courses.length === 1 ? "course" : "courses"}
            </p>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="link"
                className="courses-clear-filters"
                onClick={clearFilters}
              >
                <RotateCcw size={15} aria-hidden="true" />
                Clear filters
              </Button>
            )}
          </div>

          {filteredCourses.length === 0 ? (
            <div className="courses-no-results" role="status">
              <span className="courses-no-results-icon" aria-hidden="true">
                <Search size={23} />
              </span>
              <h3>
                {error
                  ? "Course catalog is temporarily unavailable"
                  : courses.length === 0
                    ? "No courses available yet"
                    : "No courses match your filters"}
              </h3>
              <p>
                {error
                  ? error
                  : courses.length === 0
                    ? "New courses will appear here as soon as they are available."
                    : "Try another search or clear your filters to see more courses."}
              </p>
              {hasActiveFilters && (
                <Button
                  type="button"
                  className="courses-empty-reset"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <Row className="g-4 courses-grid">
              {filteredCourses.map((course) => (
                <Col key={course._id} xs={12} sm={6} lg={4}>
                  <Card className="course-card-premium h-100">
                    <div
                      className={`course-image-wrap ${
                        course.image ? "" : "course-image-wrap-empty"
                      }`}
                    >
                      {course.image ? (
                        <Card.Img
                          variant="top"
                          src={course.image}
                          alt={course.title ? `${course.title} course thumbnail` : "Course thumbnail"}
                          className="course-card-image"
                          loading="lazy"
                        />
                      ) : (
                        <div className="course-image-fallback" aria-hidden="true">
                          <BookOpen size={38} strokeWidth={1.6} />
                          <span>{course.category || "LearnHub course"}</span>
                        </div>
                      )}
                      {course.category && (
                        <Badge className="course-category-badge">
                          {course.category}
                        </Badge>
                      )}
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
                          <UserRound size={16} aria-hidden="true" />
                          {course.instructor || "Instructor details coming soon"}
                        </span>
                        <span>
                          <Clock3 size={16} aria-hidden="true" />
                          {course.duration || "Self-paced"}
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
                          <strong>{formatCoursePrice(course.price)}</strong>
                        </div>

                        <div className="course-card-actions">
                          <Button
                            as={Link}
                            to={`/courses/${course._id}`}
                            className="course-details-btn"
                            aria-label={`View details for ${course.title}`}
                          >
                            View Details <ArrowRight size={16} aria-hidden="true" />
                          </Button>

                          <Button
                            className="course-enroll-btn"
                            onClick={() => handleEnroll(course._id)}
                            disabled={enrollingId === course._id}
                          >
                            {enrollingId === course._id
                              ? "Enrolling..."
                              : "Enroll Now"}
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
