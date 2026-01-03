import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getPasswordStrength } from "../utils/passwordStrength";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const strength = getPasswordStrength(form.password);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (strength === "Weak") {
      toast.error("Password is too weak ❌");
      return;
    }

    try {
      await api.post("/auth/register", form);
      toast.success("Registered successfully 🎉 Please login");
      navigate("/login");
    } catch {
      toast.error("Registration failed ❌");
    }
  };

  const strengthColor =
    strength === "Strong"
      ? "text-success"
      : strength === "Medium"
      ? "text-warning"
      : "text-danger";

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "420px" }}>
        <h3 className="text-center mb-3">Create Account</h3>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password actions */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>

            <span className={`fw-bold ${strengthColor}`}>
              {strength && `Strength: ${strength}`}
            </span>
          </div>

          {/* Submit */}
          <button className="btn btn-success w-100 mt-2">
            Register
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
