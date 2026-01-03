import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle =
    location.pathname === "/dashboard"
      ? "Dashboard"
      : location.pathname === "/analytics"
      ? "Analytics"
      : "";

  return (
    <nav className="navbar navbar-light bg-light shadow-sm px-4">
      {/* Left */}
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <Link className="fw-semibold" to="/dashboard">
          Dashboard
        </Link>

        <Link className="fw-semibold" to="/analytics">
          Analytics
        </Link>
      </div>

      {/* Center */}
      <div className="fw-bold fs-5">
        {pageTitle}
      </div>

      {/* Right */}
      <div className="d-flex align-items-center gap-2">
        <ThemeToggle />
        <button
          className="btn btn-sm btn-danger"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
