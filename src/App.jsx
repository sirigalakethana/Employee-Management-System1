import React, { useState } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import "./styles.css";

function App() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser") || "null")
  );

  const [selectedRole, setSelectedRole] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    const admin = {
      id: "admin",
      name: "Administrator",
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
    };

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const allUsers = [admin, ...users];

    const user = allUsers.find(
      (u) =>
        u.email?.toLowerCase() === email &&
        u.password === password &&
        u.role === selectedRole
    );

    if (!user) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const email = formData.email.trim().toLowerCase();

    if (
      users.some((user) => user.email?.toLowerCase() === email) ||
      email === "admin@gmail.com"
    ) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name.trim(),
      email,
      password: formData.password,
      role: "employee",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Employee account created successfully! Please log in.");

    setIsSignup(false);
    setSelectedRole("employee");
    setFormData({ name: "", email: "", password: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setSelectedRole("");
    setIsSignup(false);
    setFormData({ name: "", email: "", password: "" });
  };

  if (currentUser) {
    return currentUser.role === "admin" ? (
      <AdminDashboard />
    ) : (
      <EmployeeDashboard />
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">H</div>
          <div>
            <h2>HR Portal</h2>
            <p>Employee Management System</p>
          </div>
        </div>

        <div className="auth-message">
          <h1>Manage your workforce with confidence.</h1>
          <p>
            A centralized platform to manage employees, attendance,
            leaves, payroll and performance.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">

          {!selectedRole ? (
            <>
              <h1>Welcome to HR Portal</h1>
              <p className="auth-subtitle">
                Please select how you want to continue.
              </p>

              <div className="role-selection">
                <button
                  className="role-card"
                  onClick={() => setSelectedRole("admin")}
                >
                  <div className="role-icon">👨‍💼</div>
                  <h2>Admin Login</h2>
                  <p>Manage employees, attendance, payroll and more.</p>
                  <span>Continue as Admin →</span>
                </button>

                <button
                  className="role-card"
                  onClick={() => setSelectedRole("employee")}
                >
                  <div className="role-icon">👤</div>
                  <h2>Employee Login</h2>
                  <p>View your profile, attendance, leaves and salary.</p>
                  <span>Continue as Employee →</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                className="back-role-button"
                onClick={() => {
                  setSelectedRole("");
                  setIsSignup(false);
                  setError("");
                }}
              >
                ← Back to role selection
              </button>

              <h1>
                {isSignup
                  ? "Create Employee Account"
                  : selectedRole === "admin"
                  ? "Admin Login"
                  : "Employee Login"}
              </h1>

              <p className="auth-subtitle">
                {isSignup
                  ? "Register to access the employee portal."
                  : "Enter your credentials to continue."}
              </p>

              <form onSubmit={isSignup ? handleSignup : handleLogin}>
                {isSignup && (
                  <div className="auth-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="auth-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label>Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {error && <p className="auth-error">{error}</p>}

                <button type="submit" className="auth-submit">
                  {isSignup ? "Create Account" : "Login"}
                </button>
              </form>

              {selectedRole === "employee" && (
                <p className="auth-switch">
                  {isSignup
                    ? "Already have an account?"
                    : "New employee?"}{" "}
                  <button
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setError("");
                    }}
                  >
                    {isSignup ? "Login" : "Create Account"}
                  </button>
                </p>
              )}

              {selectedRole === "admin" && !isSignup && (
                <div className="admin-hint">
                  <strong>Demo Admin Credentials</strong>
                  <p>Email: admin@gmail.com</p>
                  <p>Password: admin123</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;