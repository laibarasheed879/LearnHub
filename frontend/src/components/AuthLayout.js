import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Sparkles } from "lucide-react";

function AuthLayout({
  eyebrow,
  title,
  description,
  visualTitle,
  visualDescription,
  children,
}) {
  return (
    <main className="auth-page">
      <section className="auth-layout" aria-labelledby="auth-title">
        <div className="auth-form-panel">
          <Link to="/" className="auth-brand" aria-label="LearnHub home">
            <span className="auth-brand-mark">
              <GraduationCap size={22} strokeWidth={2.2} aria-hidden="true" />
            </span>
            <span>LearnHub</span>
          </Link>

          <header className="auth-heading">
            <span className="auth-eyebrow">{eyebrow}</span>
            <h1 id="auth-title">{title}</h1>
            <p>{description}</p>
          </header>

          <div className="auth-form-content">{children}</div>
        </div>

        <aside className="auth-visual-panel" aria-label="Learning inspiration">
          <img
            className="auth-visual-image"
            src="/images/learning-auth-panel.png"
            alt="A learner studying at a desk with a laptop and notebook"
          />
          <div className="auth-visual-content">
            <span className="auth-visual-kicker">
              <Sparkles size={15} aria-hidden="true" />
              Learn at your own pace
            </span>
            <div className="auth-visual-copy">
              <h2>{visualTitle}</h2>
              <p>{visualDescription}</p>
            </div>
            <div className="auth-visual-note">
              <span className="auth-visual-note-icon">
                <BookOpen size={19} aria-hidden="true" />
              </span>
              <span>
                <strong>Make progress, one step at a time.</strong>
                <small>Your next chapter starts with a single lesson.</small>
              </span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default AuthLayout;
