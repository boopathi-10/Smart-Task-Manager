import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import { useTheme } from "./context/ThemeContext";

// const AppWrapper = ({ children }) => {
//   const { theme } = useTheme();

//   return (
//     <div className={theme === "dark" ? "dark" : "light"}>
//       {children}
//     </div>
//   );
// };


// const Dashboard = () => {
//   return <h1>Dashboard (Protected)</h1>;
// };

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        
          <div className="container-fluid min-vh-100">
        <BrowserRouter>
          <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected route */}
            <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/analytics"
  element={
    <ProtectedRoute>
      <Analytics />
    </ProtectedRoute>
  }
/>



            {/* Fallback */}
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </BrowserRouter>
        </div>
      
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
