
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Container, Spinner } from "react-bootstrap";
import { ArrowLeft, BookOpen, Info } from "lucide-react";
import { toast } from "react-toastify";
import {
  CourseDetailHero,
  CourseDetailInformation,
  CourseEnrollmentCard,
} from "../components/CourseDetailSections";
import { getCourseById } from "../services/courseService";
import { enrollInCourse } from "../services/enrollmentService";

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

  useEffect(() => {
    let isCurrentRequest = true;

    const fetchCourse = async () => {
      setLoading(true);
      setError("");
      setCourse(null);
      setImageUnavailable(false);

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
        onEnroll={handleEnroll}
        enrolling={enrolling}
        imageUnavailable={imageUnavailable}
        setImageUnavailable={setImageUnavailable}
      />

      <Container className="course-detail-container course-detail-content-layout">
        <CourseDetailInformation
          course={course}
          courseCategory={courseCategory}
          courseDuration={courseDuration}
          courseLevel={courseLevel}
          coursePrice={coursePrice}
          instructorName={instructorName}
        />
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
