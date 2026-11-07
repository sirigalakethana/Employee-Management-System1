import React, { useState } from "react";

import DashboardLayout from "../components/DashboardLayout";

import Employees from "./Employees";
import Attendance from "./Attendance";
import LeaveManagement from "./LeaveManagement";
import SalaryManagement from "./SalaryManagement";
import Performance from "./Performance";
import Skills from "./Skills";
import Announcements from "./Announcements";
import Reports from "./Reports";

function AdminDashboard() {
  const [activeModule, setActiveModule] = useState("dashboard");

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) || {};

  const employees =
    JSON.parse(localStorage.getItem("employees")) || [];

  const attendance =
    JSON.parse(localStorage.getItem("attendance")) || [];

  const leaveRequests =
    JSON.parse(localStorage.getItem("leaveRequests")) || [];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "employees", label: "Employees", icon: "♙" },
    { id: "attendance", label: "Attendance", icon: "◷" },
    { id: "leave", label: "Leave Management", icon: "▤" },
    { id: "salary", label: "Salary & Payslip", icon: "₹" },
    { id: "performance", label: "Performance", icon: "↗" },
    { id: "skills", label: "Skills", icon: "✧" },
    { id: "reports", label: "Reports & Analytics", icon: "▥" },
    { id: "announcements", label: "Announcements", icon: "▣" },
  ];

  const pageTitles = {
    dashboard: "Dashboard",
    employees: "Employee Management",
    attendance: "Attendance Management",
    leave: "Leave Management",
    salary: "Salary & Payslip",
    performance: "Performance Management",
    skills: "Skills Management",
    reports: "Reports & Analytics",
    announcements: "Announcements",
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.reload();
  };

  const presentCount = attendance.filter(
    record =>
      String(record.status || "").toLowerCase() === "present"
  ).length;

  const pendingLeaves = leaveRequests.filter(
    request =>
      String(request.status || "").toLowerCase() === "pending"
  ).length;

  const renderModule = () => {
    switch (activeModule) {
      case "employees":
        return (
          <Employees
            onBack={() => setActiveModule("dashboard")}
          />
        );

      case "attendance":
        return (
          <Attendance
            currentUser={currentUser}
            onBack={() => setActiveModule("dashboard")}
          />
        );

      case "leave":
        return (
          <LeaveManagement
            currentUser={currentUser}
            onBack={() => setActiveModule("dashboard")}
          />
        );

      case "salary":
        return (
          <SalaryManagement
            currentUser={currentUser}
            onBack={() => setActiveModule("dashboard")}
          />
        );

      case "performance":
        return (
          <Performance
            onBack={() => setActiveModule("dashboard")}
          />
        );

      case "skills":
        return (
          <Skills
            onBack={() => setActiveModule("dashboard")}
          />
        );

      case "reports":
        return (
          <Reports
            currentUser={currentUser}
            onBack={() => setActiveModule("dashboard")}
          />
        );

      case "announcements":
        return (
          <Announcements
            onBack={() => setActiveModule("dashboard")}
          />
        );

      default:
        return (
          <div className="admin-dashboard">

            <div className="dashboard-heading">
              <div>
                <h2>Overview</h2>
                <p>
                  Here's what's happening in your organisation.
                </p>
              </div>

              <span className="dashboard-date">
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Dashboard Statistics */}
            <div className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon blue">♙</div>
                <div>
                  <p>Total Employees</p>
                  <h2>{employees.length}</h2>
                  <span>Registered employees</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">✓</div>
                <div>
                  <p>Present Records</p>
                  <h2>{presentCount}</h2>
                  <span>Attendance entries</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">▤</div>
                <div>
                  <p>Pending Leaves</p>
                  <h2>{pendingLeaves}</h2>
                  <span>Awaiting approval</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">◷</div>
                <div>
                  <p>Attendance Records</p>
                  <h2>{attendance.length}</h2>
                  <span>Total recorded entries</span>
                </div>
              </div>

            </div>

            {/* Quick Access */}
            <div className="section-heading">
              <div>
                <h2>Quick Access</h2>
                <p>
                  Manage your organisation from one place.
                </p>
              </div>
            </div>

            <div className="module-grid">

              {menuItems
                .filter(item => item.id !== "dashboard")
                .map(item => (
                  <div
                    className="module-card"
                    key={item.id}
                  >
                    <div className="module-icon">
                      {item.icon}
                    </div>

                    <h3>{item.label}</h3>

                    <p>
                      Manage and view{" "}
                      {item.label.toLowerCase()} details.
                    </p>

                    <button
                      onClick={() => setActiveModule(item.id)}
                    >
                      Open Module →
                    </button>
                  </div>
                ))}

            </div>

          </div>
        );
    }
  };

  return (
    <DashboardLayout
      title={pageTitles[activeModule] || "Dashboard"}
      userName={currentUser.name || "Admin"}
      menuItems={menuItems}
      activeModule={activeModule}
      onNavigate={setActiveModule}
      onLogout={handleLogout}
    >
      {renderModule()}
    </DashboardLayout>
  );
}

export default AdminDashboard;