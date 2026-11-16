import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  GraduationCap,
  Info,
  Sparkles,
  UserRound,
} from "lucide-react";

const getInstructorInitials = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export function CourseDetailHero({
  course,
  courseCategory,
  instructorName,
  courseDuration,
  courseLevel,
  onEnroll,
  enrolling,
  imageUnavailable,
  setImageUnavailable,
}) {
  return (
    <section className="course-detail-hero">
      <div className="course-detail-container">
        <nav className="course-detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/courses">Courses</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{course.title}</span>
        </nav>

        <div className="course-detail-hero-grid">
          <div className="course-detail-hero-copy">
            <span className="course-detail-category">
              <BookOpen size={15} aria-hidden="true" />
              {courseCategory}
            </span>
            <h1>{course.title}</h1>
            <p className="course-detail-description">{course.description}</p>

            <div className="course-detail-hero-facts">
              <div className="course-detail-hero-fact">
                <span className="course-detail-fact-icon">
                  <UserRound size={18} aria-hidden="true" />
                </span>
                <span>
                  <small>Instructor</small>
                  <strong>{instructorName}</strong>
                </span>
              </div>
              <div className="course-detail-hero-fact">
                <span className="course-detail-fact-icon">
                  <Clock3 size={18} aria-hidden="true" />
                </span>
                <span>
                  <small>Duration</small>
                  <strong>{courseDuration}</strong>
                </span>
              </div>
              <div className="course-detail-hero-fact">
                <span className="course-detail-fact-icon">
                  <GraduationCap size={19} aria-hidden="true" />
                </span>
                <span>
                  <small>Difficulty</small>
                  <strong>{courseLevel}</strong>
                </span>
              </div>
            </div>

            <Button
              className="course-detail-primary-button course-detail-hero-cta"
              onClick={onEnroll}
              disabled={enrolling}
            >
              {enrolling ? "Enrolling..." : "Enroll now"}
              {!enrolling && <ArrowUpRight size={18} aria-hidden="true" />}
            </Button>
            <span className="course-detail-cta-note">
              Sign in is required to enroll
            </span>
          </div>

          <div className="course-detail-hero-visual">
            <div className="course-detail-image-frame">
              {course.image && !imageUnavailable ? (
                <img
                  className="course-detail-image"
                  src={course.image}
                  alt={course.title}
                  onError={() => setImageUnavailable(true)}
                />
              ) : (
                <div className="course-detail-image-fallback" aria-hidden="true">
                  <span className="course-detail-fallback-orbit course-detail-fallback-orbit-one" />
                  <span className="course-detail-fallback-orbit course-detail-fallback-orbit-two" />
                  <span className="course-detail-fallback-icon">
                    <BookOpen size={42} strokeWidth={1.5} />
                  </span>
                  <span className="course-detail-fallback-label">
                    {courseCategory}
                  </span>
                </div>
              )}
            </div>
            <div className="course-detail-image-caption">
              <span className="course-detail-caption-icon">
                <Sparkles size={17} aria-hidden="true" />
              </span>
              <span>
                <strong>Learn with confidence</strong>
                <small>Course information, clearly presented</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CourseDetailInformation({
  course,
  courseCategory,
  courseDuration,
  courseLevel,
  coursePrice,
  instructorName,
}) {
  const instructorInitials = getInstructorInitials(course.instructor);

  return (
    <div className="course-detail-main-content">
      <section
        className="course-detail-panel course-detail-overview"
        aria-labelledby="course-overview-title"
      >
        <span className="course-detail-section-label">THE COURSE</span>
        <h2 id="course-overview-title">Course overview</h2>
        <p>{course.description}</p>
      </section>

      <section className="course-detail-panel" aria-labelledby="course-content-title">
        <div className="course-detail-section-heading">
          <span className="course-detail-section-icon">
            <BookOpen size={20} aria-hidden="true" />
          </span>
          <div>
            <span className="course-detail-section-label">YOUR LEARNING PATH</span>
            <h2 id="course-content-title">Course content</h2>
          </div>
        </div>
        <div className="course-detail-unavailable-note">
          <Info size={18} aria-hidden="true" />
          <p>
            A curriculum and specific learning outcomes have not been added to
            this course record yet.
          </p>
        </div>
      </section>

      <section className="course-detail-panel" aria-labelledby="course-benefits-title">
        <span className="course-detail-section-label">PLAN YOUR NEXT STEP</span>
        <h2 id="course-benefits-title">Course benefits</h2>
        <p className="course-detail-panel-intro">
          Use the details provided for this course to decide whether it fits your
          goals and schedule.
        </p>
        <div className="course-detail-benefits-grid">
          <article className="course-detail-benefit-card">
            <span className="course-detail-benefit-icon">
              <CalendarDays size={20} aria-hidden="true" />
            </span>
            <h3>Plan your time</h3>
            <p>Course duration: {courseDuration}</p>
          </article>
          <article className="course-detail-benefit-card">
            <span className="course-detail-benefit-icon">
              <GraduationCap size={20} aria-hidden="true" />
            </span>
            <h3>Find your level</h3>
            <p>Listed difficulty: {courseLevel}</p>
          </article>
          <article className="course-detail-benefit-card">
            <span className="course-detail-benefit-icon">
              <CreditCard size={20} aria-hidden="true" />
            </span>
            <h3>Know the price</h3>
            <p>Listed course price: {coursePrice}</p>
          </article>
        </div>
      </section>

      <section
        className="course-detail-panel course-detail-instructor-panel"
        aria-labelledby="course-instructor-title"
      >
        <span className="course-detail-section-label">YOUR INSTRUCTOR</span>
        <h2 id="course-instructor-title">Meet your instructor</h2>
        <div className="course-detail-instructor">
          <span className="course-detail-instructor-avatar" aria-hidden="true">
            {instructorInitials || <UserRound size={25} />}
          </span>
          <div>
            <h3>{instructorName}</h3>
            <p>{courseCategory} instructor</p>
          </div>
        </div>
        <div className="course-detail-unavailable-note course-detail-instructor-note">
          <Info size={18} aria-hidden="true" />
          <p>Additional instructor profile information is not available.</p>
        </div>
      </section>
    </div>
  );
}

export function CourseEnrollmentCard({
  coursePrice,
  courseDuration,
  courseLevel,
  instructorName,
  onEnroll,
  enrolling,
}) {
  return (
    <aside className="course-detail-sidebar" aria-label="Enrollment information">
      <section className="course-detail-enrollment-card">
        <span className="course-detail-card-eyebrow">
          <CheckCircle2 size={16} aria-hidden="true" />
          COURSE ENROLLMENT
        </span>
        <p className="course-detail-price-label">Course price</p>
        <p className="course-detail-price">{coursePrice}</p>
        <div className="course-detail-card-divider" />
        <div className="course-detail-enrollment-fact">
          <Clock3 size={18} aria-hidden="true" />
          <span>
            <small>Duration</small>
            <strong>{courseDuration}</strong>
          </span>
        </div>
        <div className="course-detail-enrollment-fact">
          <GraduationCap size={19} aria-hidden="true" />
          <span>
            <small>Difficulty level</small>
            <strong>{courseLevel}</strong>
          </span>
        </div>
        <div className="course-detail-enrollment-fact">
          <UserRound size={18} aria-hidden="true" />
          <span>
            <small>Instructor</small>
            <strong>{instructorName}</strong>
          </span>
        </div>
        <Button
          className="course-detail-primary-button course-detail-enroll-button"
          onClick={onEnroll}
          disabled={enrolling}
        >
          {enrolling ? "Enrolling..." : "Enroll now"}
          {!enrolling && <ArrowUpRight size={18} aria-hidden="true" />}
        </Button>
        <p className="course-detail-login-note">
          Sign in with a student account to enroll.
        </p>
        <div className="course-detail-card-links">
          <Link to="/login">Log in</Link>
          <span aria-hidden="true">·</span>
          <Link to="/register">Create an account</Link>
        </div>
      </section>
      <Link to="/courses" className="course-detail-back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to all courses
      </Link>
    </aside>
  );
}
