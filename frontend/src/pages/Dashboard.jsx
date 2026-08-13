import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [studentsResponse, attendanceResponse] = await Promise.all([
        API.get("/students"),
        API.get("/attendance"),
      ]);

      setStudents(studentsResponse.data || []);
      setAttendance(attendanceResponse.data || []);
      setError("");
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        "Unable to connect to the server. Make sure Spring Boot is running on port 8081."
      );
    } finally {
      setLoading(false);
    }
  };

  const todayAttendance = useMemo(() => {
    return attendance.filter((item) => item.date === today);
  }, [attendance, today]);

  const presentCount = todayAttendance.filter(
    (item) => item.status?.toUpperCase() === "PRESENT"
  ).length;

  const absentCount = todayAttendance.filter(
    (item) => item.status?.toUpperCase() === "ABSENT"
  ).length;

  const lateCount = todayAttendance.filter(
    (item) => item.status?.toUpperCase() === "LATE"
  ).length;

  const attendancePercentage =
    students.length > 0
      ? ((presentCount / students.length) * 100).toFixed(1)
      : "0.0";

  const markedPercentage =
    students.length > 0
      ? ((todayAttendance.length / students.length) * 100).toFixed(1)
      : "0.0";

  const departments = [
    ...new Set(students.map((student) => student.department)),
  ].filter(Boolean);

  const recentStudents = [...students].reverse().slice(0, 5);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h3>Loading dashboard...</h3>
        <p>Fetching students and attendance data</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <section className="dashboard-header">
        <div>
          <div className="welcome-badge">
            <span>●</span> ADMIN DASHBOARD
          </div>

          <h1>
            Good morning, <span>Admin</span> 👋
          </h1>

          <p>
            Manage students and monitor attendance from one place.
          </p>
        </div>

        <div className="header-actions">
          <button className="refresh-button" onClick={loadDashboard}>
            ↻ Refresh
          </button>

          <Link to="/add-student" className="add-student-button">
            <span>+</span>
            Add Student
          </Link>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="dashboard-error">
          <span>⚠</span>
          <div>
            <strong>Connection problem</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* STAT CARDS */}
      <section className="stats-grid">

        <div className="modern-stat-card purple">
          <div className="stat-top">
            <div className="stat-icon-large">👨‍🎓</div>
            <span className="stat-label">STUDENTS</span>
          </div>

          <div className="stat-number">{students.length}</div>

          <div className="stat-bottom">
            <span>Total registered students</span>
            <Link to="/students">View →</Link>
          </div>
        </div>

        <div className="modern-stat-card green">
          <div className="stat-top">
            <div className="stat-icon-large">✓</div>
            <span className="stat-label">PRESENT TODAY</span>
          </div>

          <div className="stat-number">{presentCount}</div>

          <div className="stat-bottom">
            <span>{attendancePercentage}% of students</span>
            <span className="green-text">Present</span>
          </div>
        </div>

        <div className="modern-stat-card orange">
          <div className="stat-top">
            <div className="stat-icon-large">!</div>
            <span className="stat-label">ABSENT TODAY</span>
          </div>

          <div className="stat-number">{absentCount}</div>

          <div className="stat-bottom">
            <span>Requires attention</span>
            <span className="orange-text">Absent</span>
          </div>
        </div>

        <div className="modern-stat-card blue">
          <div className="stat-top">
            <div className="stat-icon-large">🏢</div>
            <span className="stat-label">DEPARTMENTS</span>
          </div>

          <div className="stat-number">{departments.length}</div>

          <div className="stat-bottom">
            <span>Active departments</span>
            <span className="blue-text">Active</span>
          </div>
        </div>

      </section>

      {/* MAIN DASHBOARD */}
      <section className="dashboard-columns">

        {/* ATTENDANCE OVERVIEW */}
        <div className="dashboard-card attendance-card">

          <div className="card-header">
            <div>
              <span className="card-small-title">TODAY'S OVERVIEW</span>
              <h2>Attendance Summary</h2>
              <p>{formatDate(today)}</p>
            </div>

            <Link to="/attendance" className="view-link">
              Manage →
            </Link>
          </div>

          <div className="attendance-overview">

            <div
              className="attendance-ring"
              style={{
                "--percentage": `${attendancePercentage * 3.6}deg`,
              }}
            >
              <div className="ring-inner">
                <strong>{attendancePercentage}%</strong>
                <span>Attendance</span>
              </div>
            </div>

            <div className="attendance-details">

              <div className="attendance-detail present">
                <div className="detail-icon">✓</div>
                <div>
                  <span>Present</span>
                  <strong>{presentCount}</strong>
                </div>
              </div>

              <div className="attendance-detail absent">
                <div className="detail-icon">×</div>
                <div>
                  <span>Absent</span>
                  <strong>{absentCount}</strong>
                </div>
              </div>

              <div className="attendance-detail late">
                <div className="detail-icon">◷</div>
                <div>
                  <span>Late</span>
                  <strong>{lateCount}</strong>
                </div>
              </div>

            </div>
          </div>

          <div className="progress-section">
            <div className="progress-heading">
              <span>Attendance marked</span>
              <strong>{markedPercentage}%</strong>
            </div>

            <div className="progress-bar">
              <div
                style={{
                  width: `${Math.min(Number(markedPercentage), 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="dashboard-card quick-card">

          <div className="card-header">
            <div>
              <span className="card-small-title">SHORTCUTS</span>
              <h2>Quick Actions</h2>
              <p>Frequently used actions</p>
            </div>
          </div>

          <Link to="/attendance" className="action-box purple-action">
            <div className="action-icon">✓</div>
            <div>
              <strong>Mark Attendance</strong>
              <span>Record today's attendance</span>
            </div>
            <b>→</b>
          </Link>

          <Link to="/students" className="action-box blue-action">
            <div className="action-icon">👥</div>
            <div>
              <strong>View Students</strong>
              <span>Manage student records</span>
            </div>
            <b>→</b>
          </Link>

          <Link to="/add-student" className="action-box green-action">
            <div className="action-icon">+</div>
            <div>
              <strong>Add New Student</strong>
              <span>Create a student profile</span>
            </div>
            <b>→</b>
          </Link>

        </div>

      </section>

      {/* RECENT STUDENTS */}
      <section className="dashboard-card recent-card">

        <div className="card-header">
          <div>
            <span className="card-small-title">STUDENT RECORDS</span>
            <h2>Recent Students</h2>
            <p>Recently registered students</p>
          </div>

          <Link to="/students" className="view-link">
            View all →
          </Link>
        </div>

        {recentStudents.length === 0 ? (
          <div className="empty-state">
            <div>👨‍🎓</div>
            <h3>No students yet</h3>
            <p>Add your first student to get started.</p>
            <Link to="/add-student" className="add-student-button">
              + Add Student
            </Link>
          </div>
        ) : (
          <div className="student-list">

            {recentStudents.map((student) => {

              const initials = student.name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

              return (
                <div className="recent-student" key={student.id}>

                  <div className="student-avatar">
                    {initials}
                  </div>

                  <div className="student-info">
                    <strong>{student.name}</strong>
                    <span>
                      {student.rollNo} • {student.department}
                    </span>
                  </div>

                  <div className="student-year">
                    Year {student.year}
                  </div>

                  <div className="student-email">
                    {student.email}
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>

      {/* SYSTEM STATUS */}
      <section className="system-status">

        <div className="system-status-left">
          <div className="online-dot"></div>

          <div>
            <strong>System Connected</strong>
            <span>Spring Boot API • MySQL Database</span>
          </div>
        </div>

        <div className="system-status-right">
          <span>Students: <strong>{students.length}</strong></span>
          <span>Records: <strong>{attendance.length}</strong></span>
          <span>Marked today: <strong>{todayAttendance.length}</strong></span>
        </div>

      </section>

    </div>
  );
}

export default Dashboard;