import { useEffect, useState } from "react";
import API from "../services/api";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [department, setDepartment] = useState("ALL");
  const [year, setYear] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      loadAttendance();
    }
  }, [selectedDate]);

  const loadStudents = async () => {
    try {
      const response = await API.get("/students");

      setStudents(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load students.");
    } finally {
      setLoading(false);
    }
  };

  const loadAttendance = async () => {
    try {
      const response = await API.get(`/attendance/date/${selectedDate}`);

      const records = response.data || [];

      const attendanceMap = {};

      records.forEach((record) => {
        attendanceMap[record.student.id] = record.status;
      });

      setAttendance(attendanceMap);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance((current) => ({
      ...current,
      [studentId]: status,
    }));
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);
      setError("");

      const promises = students
        .filter((student) => {
          if (department !== "ALL" && student.department !== department) {
            return false;
          }

          if (year !== "ALL" && String(student.year) !== String(year)) {
            return false;
          }

          return true;
        })
        .map(async (student) => {

          const status = attendance[student.id];

          if (!status) {
            return null;
          }

          try {
            const existing = await API.get(
              `/attendance/student/${student.id}`
            );

            const existingRecord = existing.data?.find(
              (record) => record.date === selectedDate
            );

            if (existingRecord) {
              return API.put(`/attendance/${existingRecord.id}`, {
                studentId: student.id,
                date: selectedDate,
                status,
              });
            }

            return API.post("/attendance", {
              studentId: student.id,
              date: selectedDate,
              status,
            });
          } catch (error) {
            console.error(
              `Unable to save attendance for ${student.name}`,
              error
            );

            return null;
          }
        });

      await Promise.all(promises);

      alert("Attendance saved successfully!");

      await loadAttendance();
    } catch (err) {
      console.error(err);
      setError("Unable to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  const departments = [
    ...new Set(students.map((student) => student.department)),
  ].filter(Boolean);

  const filteredStudents = students.filter((student) => {

    const departmentMatch =
      department === "ALL" || student.department === department;

    const yearMatch =
      year === "ALL" || String(student.year) === String(year);

    return departmentMatch && yearMatch;
  });

  const presentCount = filteredStudents.filter(
    (student) => attendance[student.id] === "PRESENT"
  ).length;

  const absentCount = filteredStudents.filter(
    (student) => attendance[student.id] === "ABSENT"
  ).length;

  const lateCount = filteredStudents.filter(
    (student) => attendance[student.id] === "LATE"
  ).length;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h3>Loading attendance...</h3>
      </div>
    );
  }

  return (
    <div className="page-modern">

      <section className="modern-page-header">

        <div>
          <span className="card-small-title">ATTENDANCE MANAGEMENT</span>

          <h1>Mark Attendance</h1>

          <p>
            Record and manage daily attendance for your students.
          </p>
        </div>

        <button
          className="add-student-button"
          onClick={saveAttendance}
          disabled={saving}
        >
          {saving ? "Saving..." : "✓ Save Attendance"}
        </button>

      </section>

      {error && (
        <div className="dashboard-error">
          ⚠ {error}
        </div>
      )}

      {/* FILTERS */}
      <section className="attendance-filters">

        <div className="filter-item">
          <label>Date</label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label>Department</label>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="ALL">All Departments</option>

            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Year</label>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="ALL">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

      </section>

      {/* ATTENDANCE COUNTERS */}
      <section className="attendance-counts">

        <div className="attendance-count present-count">
          <span>✓</span>
          <div>
            <small>Present</small>
            <strong>{presentCount}</strong>
          </div>
        </div>

        <div className="attendance-count absent-count">
          <span>×</span>
          <div>
            <small>Absent</small>
            <strong>{absentCount}</strong>
          </div>
        </div>

        <div className="attendance-count late-count">
          <span>◷</span>
          <div>
            <small>Late</small>
            <strong>{lateCount}</strong>
          </div>
        </div>

        <div className="attendance-count total-count">
          <span>👥</span>
          <div>
            <small>Total Students</small>
            <strong>{filteredStudents.length}</strong>
          </div>
        </div>

      </section>

      {/* TABLE */}
      <section className="modern-table-card">

        <div className="table-toolbar">

          <div>
            <h2>Student Attendance</h2>
            <p>
              {selectedDate} • {filteredStudents.length} students
            </p>
          </div>

        </div>

        {filteredStudents.length === 0 ? (
          <div className="empty-state">
            <div>👨‍🎓</div>
            <h3>No students found</h3>
            <p>Try changing the department or year filter.</p>
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
                  <th>Attendance Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredStudents.map((student) => {

                  const status = attendance[student.id] || "";

                  return (
                    <tr key={student.id}>

                      <td>
                        <div className="table-student">

                          <div className="small-avatar">
                            {student.name
                              ?.split(" ")
                              .map((x) => x[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>{student.name}</strong>
                            <span>{student.email}</span>
                          </div>

                        </div>
                      </td>

                      <td>
                        <span className="roll-badge">
                          {student.rollNo}
                        </span>
                      </td>

                      <td>{student.department}</td>

                      <td>Year {student.year}</td>

                      <td>

                        <select
                          className={`status-select ${status.toLowerCase()}`}
                          value={status}
                          onChange={(e) =>
                            handleStatusChange(
                              student.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select Status
                          </option>

                          <option value="PRESENT">
                            ✓ Present
                          </option>

                          <option value="ABSENT">
                            × Absent
                          </option>

                          <option value="LATE">
                            ◷ Late
                          </option>
                        </select>

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

export default Attendance;