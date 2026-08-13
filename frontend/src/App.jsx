import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import Attendance from "./pages/Attendance";

import "./App.css";

function ProtectedRoute({ children }) {

  const loggedIn =
    localStorage.getItem("loggedIn") === "true";

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* PROTECTED APPLICATION */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="app-shell">

                <Navbar />

                <main className="main-content">

                  <Dashboard />

                </main>

              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <div className="app-shell">

                <Navbar />

                <main className="main-content">

                  <Students />

                </main>

              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-student"
          element={
            <ProtectedRoute>
              <div className="app-shell">

                <Navbar />

                <main className="main-content">

                  <AddStudent />

                </main>

              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <div className="app-shell">

                <Navbar />

                <main className="main-content">

                  <Attendance />

                </main>

              </div>
            </ProtectedRoute>
          }
        />

        {/* UNKNOWN URL */}

        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;