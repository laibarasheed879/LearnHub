
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Card, Container, Spinner } from "react-bootstrap";
import { ArrowLeft, BookOpen, Info } from "lucide-react";
import { toast } from "react-toastify";
import {
  CourseDetailHero,
  CourseDetailInformation,
  CourseEnrollmentCard,
} from "../components/CourseDetailSections";
import { getCourseById } from "../services/courseService";
import { enrollInCourse } from "../services/enrollmentService";
import {
  downloadCourseLesson,
  getCourseLessons,
} from "../services/lessonService";

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

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonError, setLessonError] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;

    const fetchCourse = async () => {
      setLoading(true);
      setError("");
      setCourse(null);
      setImageUnavailable(false);
      setLessons([]);
      setLessonError("");

      try {
        const data = await getCourseById(id);

        if (isCurrentRequest) {
          setCourse(data);
        }
      } catch (requestError) {
        if (isCurrentRequest) {
          setError(
            requestError.response?.data?.message ||
              "This course could not be loaded. Please try again when the course service is available."
          );
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false);
        }
      }
    };

    fetchCourse();

    return () => {
      isCurrentRequest = false;
    };
  }, [id, retryCount]);

  const handleEnroll = async () => {
    const token = localStorage.getItem("learnhubToken");
    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("learnhubUser") || "null");
    } catch {
      user = null;
    }

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
      setEnrolling(true);
      const result = await enrollInCourse(id);
      toast.success(result.message || "Successfully enrolled!");
      navigate("/student-dashboard");
    } catch (enrollmentError) {
      toast.error(
        enrollmentError.response?.data?.message ||
          "Enrollment failed. Please try again."
      );
    } finally {
      setEnrolling(false);
    }
  };

  useEffect(() => {
    if (!course || !localStorage.getItem("learnhubToken")) return;

    const fetchLessons = async () => {
      setLessonsLoading(true);
      setLessonError("");
      try {
        setLessons(await getCourseLessons(course._id));
      } catch (err) {
        setLessonError(
          err.response?.data?.message || "Unable to load course lessons."
        );
      } finally {
        setLessonsLoading(false);
      }
    };

    fetchLessons();
  }, [course]);

  const handleLessonDownload = async (lesson) => {
    try {
      const file = await downloadCourseLesson(course._id, lesson._id);
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

  if (loading) {
    return (
      <main className="course-detail-page course-detail-state-page">
        <Container className="course-detail-state" role="status" aria-live="polite">
          <span className="course-detail-state-icon">
            <BookOpen size={24} aria-hidden="true" />
          </span>
          <Spinner animation="border" variant="primary" />
          <h1>Preparing your course details</h1>
          <p>Loading the selected course from LearnHub.</p>
        </Container>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="course-detail-page course-detail-state-page">
        <Container className="course-detail-state" role="alert">
          <span className="course-detail-state-icon course-detail-state-icon-error">
            <Info size={24} aria-hidden="true" />
          </span>
          <span className="course-detail-eyebrow">COURSE DETAILS</span>
          <h1>{error || "This course is not available."}</h1>
          <p>
            We couldn&apos;t retrieve this course from the existing course service.
            No sample course data is shown.
          </p>
          <div className="course-detail-state-actions">
            <Button
              className="course-detail-primary-button"
              onClick={() => setRetryCount((count) => count + 1)}
            >
              Try again
            </Button>
            <Button
              as={Link}
              to="/courses"
              className="course-detail-secondary-button"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Back to courses
            </Button>
          </div>
        </Container>
      </main>
    );
  }

  const instructorName = course.instructor || "Instructor not provided";
  const courseCategory = course.category || "Category not provided";
  const courseDuration = course.duration || "Duration not provided";
  const courseLevel = course.level || "Level not provided";
  const coursePrice = formatCoursePrice(course.price);

  return (
    <main className="course-detail-page">
      <CourseDetailHero
        course={course}
        courseCategory={courseCategory}
        instructorName={instructorName}
        courseDuration={courseDuration}
        courseLevel={courseLevel}
        coursePrice={coursePrice}
        onEnroll={handleEnroll}
        enrolling={enrolling}
        imageUnavailable={imageUnavailable}
        setImageUnavailable={setImageUnavailable}
      />

      <Container className="course-detail-container course-detail-content-layout">
        <div>
          <CourseDetailInformation
            course={course}
            courseCategory={courseCategory}
            courseDuration={courseDuration}
            courseLevel={courseLevel}
            coursePrice={coursePrice}
            instructorName={instructorName}
          />
          {localStorage.getItem("learnhubToken") && (
            <Card className="dashboard-panel mt-4">
              <Card.Body>
                <h2 className="h4">Course Lessons</h2>
                <p className="text-secondary">
                  Lessons are available to enrolled students and course instructors.
                </p>
                {lessonsLoading && <Spinner animation="border" role="status" />}
                {lessonError && (
                  <Alert variant="info" className="mt-3" role="alert">
                    {lessonError}
                  </Alert>
                )}
                {!lessonsLoading && !lessonError && lessons.length === 0 && (
                  <p className="text-secondary mb-0">
                    No lessons have been uploaded yet.
                  </p>
                )}
                {lessons.map((lesson) => (
                  <div
                    key={lesson._id}
                    className="d-flex justify-content-between align-items-center gap-3 border-top py-3"
                  >
                    <div>
                      <strong>{lesson.title}</strong>
                      <small className="d-block text-secondary">
                        {lesson.fileName}
                      </small>
                    </div>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleLessonDownload(lesson)}
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
        </div>
        <CourseEnrollmentCard
          coursePrice={coursePrice}
          courseDuration={courseDuration}
          courseLevel={courseLevel}
          instructorName={instructorName}
          onEnroll={handleEnroll}
          enrolling={enrolling}
        />
      </Container>
    </main>
  );
}

export default CourseDetail;
