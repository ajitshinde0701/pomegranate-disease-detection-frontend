import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import "../styles/publicPages.css";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "FARMER"
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await registerUser(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("fullName", res.data.fullName);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("role", res.data.role);

      redirectByRole(res.data.role);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Check backend/MySQL.");
    }
  };

  return (
    <div className="page-section">
      <section className="banner-section">
        {/* <h1>Registration</h1> */}
        {/* <p>Create your AnarMitra account according to your role.</p> */}
      </section>

      <section className="info-section">
        <form className="form-card" onSubmit={handleRegister}>
          <h2>Create Account</h2>
          {/* <p>Register as farmer, merchant, advisor, fertilizer store or admin.</p> */}

          {error && <div className="error-box">{error}</div>}

          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="FARMER">Farmer</option>
            <option value="MERCHANT">Merchant</option>
            <option value="ADVISOR">Advisor</option>
            <option value="FERTILIZER_STORE">Fertilizer Store</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button className="primary-btn" type="submit">
            Register
          </button>

          <p style={{ marginTop: "18px" }}>
            Already registered? <Link to="/login">Login here</Link>
          </p>
        </form>
      </section>
    </div>
  );
}