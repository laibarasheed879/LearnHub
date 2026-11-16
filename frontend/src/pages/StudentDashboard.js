import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Compass,
  GraduationCap,
  House,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
import { getCourses } from "../services/courseService";
import { getMyEnrollments } from "../services/enrollmentService";

const dashboardSections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "my-courses", label: "My courses", icon: BookOpen },
  { id: "progress", label: "Learning progress", icon: BarChart3 },
  { id: "profile", label: "My profile", icon: UserRound },
];

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("learnhubUser") || "null");
  } catch {
    return null;
  }
};

const getProgress = (enrollment) => {
  if (typeof enrollment.progress !== "number" || !Number.isFinite(enrollment.progress)) {
    return null;
  }

  return Math.min(100, Math.max(0, enrollment.progress));
};

const getInitials = (value) => {
  if (typeof value !== "string" || !value.trim()) return "";

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

function StudentSidebar({ user, activeSection, onSectionChange, onLogout }) {
  const initials = getInitials(user?.name || user?.email);

  return (
    <aside className="student-sidebar" aria-label="Student dashboard sidebar">
      <Link to="/" className="student-sidebar-brand" aria-label="LearnHub home">
        <span className="student-brand-mark">
          <GraduationCap size={22} aria-hidden="true" />
        </span>
        <span className="student-brand-copy">
          <strong>LearnHub</strong>
          <small>STUDENT PORTAL</small>
        </span>
      </Link>

      <nav className="student-sidebar-nav" aria-label="Student dashboard navigation">
        <p className="student-nav-label">YOUR LEARNING</p>
        {dashboardSections.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`student-nav-link${activeSection === id ? " is-active" : ""}`}
            aria-current={activeSection === id ? "location" : undefined}
            onClick={() => onSectionChange(id)}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}

        <p className="student-nav-label student-nav-label-secondary">DISCOVER</p>
        <Link to="/courses" className="student-nav-link">
          <Compass size={18} aria-hidden="true" />
          <span>Explore courses</span>
          <ArrowRight className="student-nav-trailing-icon" size={15} aria-hidden="true" />
        </Link>
        <Link to="/" className="student-nav-link">
          <House size={18} aria-hidden="true" />
          <span>Back to home</span>
        </Link>
      </nav>

      <div className="student-sidebar-footer">
        <div className="student-sidebar-user">
          <span className="student-avatar" aria-hidden="true">
            {initials || <UserRound size={18} />}
          </span>
          <span className="student-sidebar-user-copy">
            <strong>{user?.name || "Student account"}</strong>
            {user?.email && <small>{user.email}</small>}
          </span>
        </div>
        <button type="button" className="student-logout-button" onClick={onLogout}>
          <LogOut size={17} aria-hidden="true" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

function DashboardStat({ icon: Icon, label, value, detail }) {
  return (
    <article className="student-stat-card">
      <span className="student-stat-icon">
        <Icon size={19} aria-hidden="true" />
      </span>
      <p>{label}</p>
      <strong className="student-stat-value">{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function StudentCourseCard({ enrollment, hasRecordedProgress }) {
  const course = enrollment.course;
  const progress = getProgress(enrollment);
  const showProgress = progress !== null && (progress > 0 || hasRecordedProgress);
  const status = enrollment.status || "Enrolled";
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <article className="student-course-card">
      <div className="student-course-visual">
        {course.image ? (
          <img src={course.image} alt="" loading="lazy" />
        ) : (
          <div className="student-course-visual-placeholder" aria-hidden="true" />
        )}
        {course.category && <span className="student-course-category">{course.category}</span>}
      </div>

      <div className="student-course-content">
        <div className="student-course-status">
          <span className={status === "completed" ? "is-complete" : ""}>
            {status === "completed" && <CheckCircle2 size={14} aria-hidden="true" />}
            {statusLabel}
          </span>
        </div>
        <h3>{course.title}</h3>
        {course.instructor && (
          <p className="student-course-instructor">Instructor: {course.instructor}</p>
        )}
        {(course.level || course.duration) && (
          <p className="student-course-details">
            {[course.level, course.duration].filter(Boolean).join(" · ")}
          </p>
        )}

        {showProgress ? (
          <div className="student-course-progress">
            <div className="student-course-progress-label">
              <span>Recorded progress</span>
              <strong>{progress}%</strong>
            </div>
            <div
              className="student-progress-track"
              role="progressbar"
              aria-label={`Progress in ${course.title}`}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <p className="student-course-progress-note">Lesson progress has not been recorded.</p>
        )}

        <Link to={`/courses/${course._id}`} className="student-course-action">
          {status === "completed" ? "Review course" : "Continue learning"}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function LearningProgressPanel({ loading, error, enrollments, averageProgress }) {
  return (
    <section className="student-panel student-progress-panel" id="progress" aria-labelledby="progress-heading">
      <div className="student-panel-heading">
        <span className="student-panel-icon"><BarChart3 size={19} aria-hidden="true" /></span>
        <div>
          <p className="student-section-kicker">YOUR MOMENTUM</p>
          <h2 id="progress-heading">Learning progress</h2>
        </div>
      </div>

      {loading ? (
        <div className="student-loading-state" role="status">
          <Spinner animation="border" size="sm" aria-hidden="true" />
          <span>Loading your progress...</span>
        </div>
      ) : error ? (
        <Alert variant="danger" className="student-alert">{error}</Alert>
      ) : enrollments.length === 0 ? (
        <div className="student-progress-empty">
          <strong>No course progress yet</strong>
          <p>Enroll in a course to see progress recorded for your learning.</p>
        </div>
      ) : averageProgress === null ? (
        <div className="student-progress-empty">
          <strong>No lesson progress recorded yet</strong>
          <p>LearnHub has not recorded lesson completion for your enrolled courses.</p>
        </div>
      ) : (
        <div className="student-progress-summary">
          <div className="student-progress-number-row">
            <strong>{averageProgress}%</strong>
            <span>average recorded progress</span>
          </div>
          <div
            className="student-progress-track student-progress-track-large"
            role="progressbar"
            aria-label="Average recorded progress across enrolled courses"
            aria-valuenow={averageProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${averageProgress}%` }} />
          </div>
          <p>Calculated from progress values returned with your enrollment records.</p>
        </div>
      )}
    </section>
  );
}

function StudentProfilePanel({ user }) {
  const initials = getInitials(user?.name || user?.email);

  return (
    <section className="student-panel student-profile-panel" id="profile" aria-labelledby="profile-heading">
      <div className="student-panel-heading">
        <span className="student-panel-icon"><UserRound size={19} aria-hidden="true" /></span>
        <div>
          <p className="student-section-kicker">ACCOUNT DETAILS</p>
          <h2 id="profile-heading">My profile</h2>
        </div>
      </div>
      <div className="student-profile-summary">
        <span className="student-profile-avatar" aria-hidden="true">
          {initials || <UserRound size={24} />}
        </span>
        <div>
          <strong>{user?.name || "Name unavailable"}</strong>
          <span>{user?.email || "Email unavailable"}</span>
        </div>
      </div>
      <dl className="student-profile-details">
        <div>
          <dt>Full name</dt>
          <dd>{user?.name || "Not available"}</dd>
        </div>
        <div>
          <dt>Email address</dt>
          <dd>{user?.email || "Not available"}</dd>
        </div>
        {user?.role && (
          <div>
            <dt>Account type</dt>
            <dd>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}

function StudentDashboard() {
  const [user] = useState(getStoredUser);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  const [courseError, setCourseError] = useState("");
  const [enrollmentError, setEnrollmentError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    let isCurrentRequest = true;

    const loadCourses = async () => {
      try {
        const data = await getCourses();
        if (isCurrentRequest) setCourses(data);
      } catch {
        if (isCurrentRequest) {
          setCourseError("Courses are not loaded. Please check the backend server.");
        }
      } finally {
        if (isCurrentRequest) setCoursesLoading(false);
      }
    };

    loadCourses();
    return () => {
      isCurrentRequest = false;
    };
  }, []);

  useEffect(() => {
    let isCurrentRequest = true;

    const loadEnrollments = async () => {
      try {
        const data = await getMyEnrollments();
        if (isCurrentRequest) setEnrollments(data);
      } catch {
        if (isCurrentRequest) {
          setEnrollmentError("Your enrolled courses are not loaded. Please log in again.");
        }
      } finally {
        if (isCurrentRequest) setEnrollmentLoading(false);
      }
    };

    if (localStorage.getItem("learnhubToken")) {
      loadEnrollments();
    } else {
      setEnrollmentLoading(false);
    }

    return () => {
      isCurrentRequest = false;
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("learnhubToken");
    localStorage.removeItem("learnhubUser");
    window.dispatchEvent(new Event("learnhub-auth-change"));
    navigate("/");
  };

  const visibleEnrollments = enrollments.filter((enrollment) => enrollment.course);
  const completedCount = enrollments.filter((enrollment) => enrollment.status === "completed").length;
  const progressValues = enrollments
    .map(getProgress)
    .filter((progress) => progress !== null);
  const hasRecordedProgress = progressValues.some((progress) => progress > 0);
  const averageProgress = hasRecordedProgress && progressValues.length > 0
    ? Math.round(progressValues.reduce((total, progress) => total + progress, 0) / progressValues.length)
    : null;

  return (
    <div className="dashboard-page student-dashboard">
      <div className="student-dashboard-layout">
        <StudentSidebar
          user={user}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onLogout={logout}
        />

        <main className="student-dashboard-main">
          <section className="student-welcome" id="overview" aria-labelledby="welcome-heading">
            <div>
              <p className="student-section-kicker">STUDENT DASHBOARD</p>
              <h1 id="welcome-heading">
                {user?.name ? `Welcome back, ${user.name}` : "Welcome back"}
              </h1>
              <p>Pick up where you left off and keep building your skills.</p>
            </div>
            <Link to="/courses" className="student-primary-link">
              Explore courses
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </section>

          <section className="student-stat-grid" aria-label="Learning overview">
            <DashboardStat
              icon={BookOpen}
              label="Available courses"
              value={coursesLoading ? "—" : courses.length}
              detail={courseError ? "Catalog is unavailable" : "In the LearnHub catalog"}
            />
            <DashboardStat
              icon={GraduationCap}
              label="My courses"
              value={enrollmentLoading ? "—" : enrollments.length}
              detail="Courses you are enrolled in"
            />
            <DashboardStat
              icon={CheckCircle2}
              label="Completed"
              value={enrollmentLoading ? "—" : completedCount}
              detail="Completed enrollments"
            />
          </section>

          <section className="student-panel student-courses-panel" id="my-courses" aria-labelledby="courses-heading">
            <div className="student-section-heading">
              <div>
                <p className="student-section-kicker">CONTINUE LEARNING</p>
                <h2 id="courses-heading">My courses</h2>
                <p>Your enrolled courses, loaded from your LearnHub account.</p>
              </div>
              <Link to="/courses" className="student-secondary-link">
                Browse courses
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            {courseError && <Alert variant="warning" className="student-alert">{courseError}</Alert>}
            {enrollmentError && <Alert variant="danger" className="student-alert">{enrollmentError}</Alert>}

            {enrollmentLoading ? (
              <div className="student-loading-state" role="status">
                <Spinner animation="border" size="sm" aria-hidden="true" />
                <span>Loading your enrolled courses...</span>
              </div>
            ) : !enrollmentError && enrollments.length === 0 ? (
              <div className="student-empty-state">
                <span className="student-empty-icon"><BookOpen size={22} aria-hidden="true" /></span>
                <h3>No enrolled courses yet</h3>
                <p>Explore the course catalog and enroll to start learning.</p>
                <Link to="/courses" className="student-primary-link">
                  Browse courses
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            ) : !enrollmentError && visibleEnrollments.length === 0 ? (
              <div className="student-empty-state">
                <h3>Course details are unavailable</h3>
                <p>Your enrollment records were found, but course details could not be loaded.</p>
              </div>
            ) : !enrollmentError ? (
              <div className="student-course-grid">
                {visibleEnrollments.map((enrollment) => (
                  <StudentCourseCard
                    key={enrollment._id}
                    enrollment={enrollment}
                    hasRecordedProgress={hasRecordedProgress}
                  />
                ))}
              </div>
            ) : null}
          </section>

          <div className="student-dashboard-lower-grid">
            <LearningProgressPanel
              loading={enrollmentLoading}
              error={enrollmentError}
              enrollments={enrollments}
              averageProgress={averageProgress}
            />
            <StudentProfilePanel user={user} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;
