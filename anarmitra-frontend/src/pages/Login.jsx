import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import "../styles/publicPages.css";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const redirectByRole = (role) => {
    if (role === "FARMER") navigate("/dashboard/farmer");
    else if (role === "MERCHANT") navigate("/dashboard/merchant");
    else if (role === "ADVISOR") navigate("/dashboard/advisor");
    else if (role === "FERTILIZER_STORE") navigate("/dashboard/fertilizer-store");
    else if (role === "ADMIN") navigate("/dashboard/admin");
    else navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("fullName", res.data.fullName);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("role", res.data.role);

      redirectByRole(res.data.role);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check backend.");
    }
  };

  return (
    <div className="page-section">
      <section className="banner-section">
        <h1>Login</h1>
        <p>Access your role-based AnarMitra dashboard.</p>
      </section>

      <section className="info-section">
        <form className="form-card" onSubmit={handleLogin}>
          <h2>Welcome Back</h2>
          <p>Login using your registered email and password.</p>

          {error && <div className="error-box">{error}</div>}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="primary-btn" type="submit">
            Login
          </button>

          <p style={{ marginTop: "18px" }}>
            New user? <Link to="/registration">Create Account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}