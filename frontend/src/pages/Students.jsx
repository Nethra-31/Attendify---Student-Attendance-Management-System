import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await API.get("/students");

      setStudents(response.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/students/${id}`);

      setStudents((current) =>
        current.filter((student) => student.id !== id)
      );

      alert("Student deleted successfully.");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Unable to delete student. Check whether attendance records exist for this student."
      );
    }
  };

  const filteredStudents = students.filter((student) => {
    const value = search.toLowerCase();

    return (
      student.name?.toLowerCase().includes(value) ||
      student.rollNo?.toLowerCase().includes(value) ||
      student.department?.toLowerCase().includes(value) ||
      student.email?.toLowerCase().includes(value)
    );
  });

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h3>Loading students...</h3>
      </div>
    );
  }

  return (
    <div className="page-modern">

      <section className="modern-page-header">
        <div>
          <span className="card-small-title">STUDENT MANAGEMENT</span>

          <h1>Students</h1>

          <p>
            Manage all registered students in your attendance system.
          </p>
        </div>

        <Link to="/add-student" className="add-student-button">
          + Add Student
        </Link>
      </section>

      {error && (
        <div className="dashboard-error">
          <span>⚠</span>
          <p>{error}</p>
        </div>
      )}

      <section className="student-summary-row">

        <div className="mini-stat">
          <span>Total Students</span>
          <strong>{students.length}</strong>
        </div>

        <div className="mini-stat">
          <span>Departments</span>
          <strong>
            {new Set(students.map((s) => s.department)).size}
          </strong>
        </div>

        <div className="mini-stat">
          <span>Displayed</span>
          <strong>{filteredStudents.length}</strong>
        </div>

      </section>

      <section className="modern-table-card">

        <div className="table-toolbar">

          <div>
            <h2>Student Directory</h2>
            <p>{students.length} registered students</p>
          </div>

          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        </div>

        {filteredStudents.length === 0 ? (
          <div className="empty-state">
            <div>🔎</div>
            <h3>No students found</h3>
            <p>Try another search or add a new student.</p>
          </div>
        ) : (
          <div className="responsive-table">

            <table>

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll Number</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredStudents.map((student) => {

                  const initials = student.name
                    ?.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={student.id}>

                      <td>
                        <div className="table-student">

                          <div className="small-avatar">
                            {initials}
                          </div>

                          <div>
                            <strong>{student.name}</strong>
                            <span>ID #{student.id}</span>
                          </div>

                        </div>
                      </td>

                      <td>
                        <span className="roll-badge">
                          {student.rollNo}
                        </span>
                      </td>

                      <td>{student.department}</td>

                      <td>
                        <span className="year-badge">
                          Year {student.year}
                        </span>
                      </td>

                      <td>{student.email}</td>

                      <td>
                        <button
                          className="delete-modern"
                          onClick={() => handleDelete(student.id)}
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
  );
}

export default Students;