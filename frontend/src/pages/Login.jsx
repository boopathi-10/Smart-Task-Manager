import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      login(res.data.token);
      toast.success("Login successful 🎉");
      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      toast.error("Wrong email or password. Try again ❌");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
  <div className="card shadow p-4" style={{ width: "400px" }}>
    <h3 className="text-center mb-3">Login</h3>

    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          className="form-control"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <button className="btn btn-primary w-100">Login</button>
      <p style={{ marginTop: "10px", textAlign: "center" }}>
  Not registered?{" "}
  <Link to="/register">Register</Link>
</p>

    </form>
  </div>
</div>

  );
};

export default Login;
