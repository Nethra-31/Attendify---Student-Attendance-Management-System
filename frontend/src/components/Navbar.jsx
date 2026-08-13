import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const getClassName = ({ isActive }) =>
    `nav-link ${isActive ? "active" : ""}`;

  const username =
    localStorage.getItem("username") || "Administrator";

  const handleLogout = () => {

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");

    navigate("/login");
  };

  return (

    <aside className="sidebar">

      <div className="brand">

        <div className="brand-icon">
          ✓
        </div>

        <div>
          <h1>
            Attendify
          </h1>

          <p>
            Student Attendance
          </p>
        </div>

      </div>

      <p className="menu-label">
        MAIN MENU
      </p>

      <nav className="nav-links">

        <NavLink
          to="/dashboard"
          className={getClassName}
        >
          <span className="nav-icon">
            ◉
          </span>

          Dashboard
        </NavLink>

        <NavLink
          to="/students"
          className={getClassName}
        >
          <span className="nav-icon">
            ♙
          </span>

          Students
        </NavLink>

        <NavLink
          to="/attendance"
          className={getClassName}
        >
          <span className="nav-icon">
            ✓
          </span>

          Attendance
        </NavLink>

        <NavLink
          to="/add-student"
          className={getClassName}
        >
          <span className="nav-icon">
            +
          </span>

          Add Student
        </NavLink>

      </nav>

      <div className="sidebar-footer">

        <div className="admin-avatar">
          A
        </div>

        <div>
          <strong>
            {username}
          </strong>

          <span>
            Attendance Manager
          </span>
        </div>

      </div>

      <button
        className="logout-button"
        onClick={handleLogout}
      >
        ↪ Logout
      </button>

    </aside>
  );
}

export default Navbar;