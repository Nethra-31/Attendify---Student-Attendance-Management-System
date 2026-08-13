import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      <nav className="home-navbar">

        <div className="home-brand">
          <div className="home-logo">✓</div>

          <div>
            <h2>Attendify</h2>
            <span>Student Attendance</span>
          </div>
        </div>

        <Link to="/login" className="home-login-button">
          Login
        </Link>

      </nav>

      <section className="home-hero">

        <div className="hero-content">

          <p className="hero-label">
            SMART ATTENDANCE MANAGEMENT
          </p>

          <h1>
            Manage Student
            <br />
            <span>Attendance Easily.</span>
          </h1>

          <p className="hero-description">
            Attendify helps institutions manage students,
            record attendance and monitor attendance
            performance through one simple platform.
          </p>

          <div className="hero-buttons">

            <Link to="/login" className="hero-primary">
              Get Started →
            </Link>

            <Link to="/login" className="hero-secondary">
              Admin Login
            </Link>

          </div>

        </div>

        <div className="hero-card">

          <div className="hero-card-header">

            <div>
              <small>ATTENDANCE OVERVIEW</small>
              <h3>Today's Attendance</h3>
            </div>

            <div className="hero-check">
              ✓
            </div>

          </div>

          {/* Correct attendance percentage */}
          <div className="hero-percentage">
            100%
          </div>

          <div className="hero-progress">
            <div></div>
          </div>

          <div className="hero-stats">

            <div>
              <strong>Present</strong>
              <span>100%</span>
            </div>

            <div>
              <strong>Absent</strong>
              <span>0%</span>
            </div>

          </div>

        </div>

      </section>

      <section className="home-features">

        <div>
          <span>✓</span>
          <h3>Easy Attendance</h3>
          <p>Record student attendance quickly.</p>
        </div>

        <div>
          <span>♙</span>
          <h3>Student Management</h3>
          <p>Maintain student information in one place.</p>
        </div>

        <div>
          <span>▣</span>
          <h3>Clear Reports</h3>
          <p>Monitor attendance performance easily.</p>
        </div>

      </section>

    </div>
  );
}

export default Home;