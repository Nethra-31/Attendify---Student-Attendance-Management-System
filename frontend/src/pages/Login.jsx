import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await API.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem(
        "loggedIn",
        "true"
      );

      localStorage.setItem(
        "username",
        response.data.username
      );

      navigate("/dashboard");

    } catch (err) {

      if (err.response?.data?.message) {

        setError(
          err.response.data.message
        );

      } else {

        setError(
          "Unable to connect to the server."
        );
      }

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="login-page">

      <div className="login-left">

        <div className="login-brand">

          <div className="login-logo">
            ✓
          </div>

          <div>
            <h2>Attendify</h2>
            <p>Student Attendance</p>
          </div>

        </div>

        <div className="login-message">

          <p className="hero-label">
            WELCOME BACK
          </p>

          <h1>
            Manage attendance
            <br />
            <span>with confidence.</span>
          </h1>

          <p>
            Sign in to access your student attendance
            management dashboard.
          </p>

        </div>

      </div>

      <div className="login-right">

        <div className="login-card">

          <div className="login-heading">

            <h1>Welcome back 👋</h1>

            <p>
              Sign in to your administrator account
            </p>

          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="login-form-group">

              <label>
                Username
              </label>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />

            </div>

            <div className="login-form-group">

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Sign In →"}

            </button>

          </form>

          <div className="login-back">

            <Link to="/">
              ← Back to Home
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;