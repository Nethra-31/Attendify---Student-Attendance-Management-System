import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddStudent() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    rollNo: "",
    name: "",
    department: "",
    year: "",
    email: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setStudent((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await API.post("/students", {
        rollNo: student.rollNo.trim(),
        name: student.name.trim(),
        department: student.department.trim(),
        year: Number(student.year),
        email: student.email.trim(),
      });

      alert("Student added successfully!");

      navigate("/students");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to add student. Please check the entered information."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-modern">

      <section className="modern-page-header">
        <div>
          <span className="card-small-title">STUDENT MANAGEMENT</span>

          <h1>Add Student</h1>

          <p>
            Create a new student profile in the attendance system.
          </p>
        </div>
      </section>

      <section className="student-form-card">

        <div className="form-card-header">
          <div className="form-big-icon">👨‍🎓</div>

          <div>
            <h2>Student Information</h2>
            <p>Enter the student's details below.</p>
          </div>
        </div>

        {error && (
          <div className="form-error">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="modern-form-group">
              <label>Roll Number</label>

              <input
                type="text"
                name="rollNo"
                value={student.rollNo}
                onChange={handleChange}
                placeholder="Example: 24IT001"
                required
              />
            </div>

            <div className="modern-form-group">
              <label>Student Name</label>

              <input
                type="text"
                name="name"
                value={student.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="modern-form-group">
              <label>Department</label>

              <input
                type="text"
                name="department"
                value={student.department}
                onChange={handleChange}
                placeholder="Example: IT"
                required
              />
            </div>

            <div className="modern-form-group">
              <label>Year</label>

              <select
                name="year"
                value={student.year}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div className="modern-form-group full-width">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={student.email}
                onChange={handleChange}
                placeholder="student@example.com"
                required
              />
            </div>

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/students")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-student-button"
              disabled={saving}
            >
              {saving ? "Adding Student..." : "+ Add Student"}
            </button>

          </div>

        </form>

      </section>

    </div>
  );
}

export default AddStudent;