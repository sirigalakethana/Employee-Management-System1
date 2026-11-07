import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

import Attendance from "./Attendance";
import LeaveManagement from "./LeaveManagement";
import SalaryManagement from "./SalaryManagement";
import Profile from "./Profile";
import EmployeeAnnouncements from "./EmployeeAnnouncements";

function EmployeeDashboard() {
  const [activeModule, setActiveModule] = useState("dashboard");

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) || {};

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "attendance", label: "My Attendance", icon: "◷" },
    { id: "leave", label: "Leave Management", icon: "▤" },
    { id: "salary", label: "Salary & Payslip", icon: "₹" },
    { id: "profile", label: "My Profile", icon: "♙" },
    { id: "announcements", label: "Announcements", icon: "▣" },
  ];

  const pageTitles = {
    dashboard: "Employee Dashboard",
    attendance: "My Attendance",
    leave: "Leave Management",
    salary: "Salary & Payslip",
    profile: "My Profile",
    announcements: "Announcements",
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.reload();
  };

  const renderModule = () => {
    switch (activeModule) {
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

      case "profile":
        return (
          <Profile
            currentUser={currentUser}
            onBack={() => setActiveModule("dashboard")}
          />
        );

      case "announcements":
        return (
          <EmployeeAnnouncements
            onBack={() => setActiveModule("dashboard")}
          />
        );

      default:
        return <EmployeeHome currentUser={currentUser} onNavigate={setActiveModule} />;
    }
  };

  return (
    <DashboardLayout
      title={pageTitles[activeModule]}
      userName={currentUser.name || "Employee"}
      menuItems={menuItems}
      activeModule={activeModule}
      onNavigate={setActiveModule}
      onLogout={handleLogout}
    >
      {renderModule()}
    </DashboardLayout>
  );
}

function EmployeeHome({ currentUser, onNavigate }) {
  const announcements =
    JSON.parse(localStorage.getItem("announcements")) || [];

  const leaves =
    JSON.parse(localStorage.getItem("leaveRequests")) || [];

  const myLeaves = leaves.filter(
    (item) => item.employeeEmail === currentUser.email
  );

  const pendingLeaves = myLeaves.filter(
    (item) => item.status === "Pending"
  ).length;

  const modules = [
    {
      id: "attendance",
      title: "My Attendance",
      description: "View your attendance records.",
      icon: "◷",
    },
    {
      id: "leave",
      title: "Leave Management",
      description: "Apply for leave and track requests.",
      icon: "▤",
    },
    {
      id: "salary",
      title: "Salary & Payslip",
      description: "View salary details and payslips.",
      icon: "₹",
    },
    {
      id: "profile",
      title: "My Profile",
      description: "View your personal information.",
      icon: "♙",
    },
    {
      id: "announcements",
      title: "Announcements",
      description: "Read company notices and updates.",
      icon: "▣",
    },
  ];

  return (
    <div className="admin-dashboard">

      <div className="dashboard-heading">
        <div>
          <h2>Welcome, {currentUser.name || "Employee"}!</h2>
          <p>Here's your employee workspace at a glance.</p>
        </div>

        <span className="dashboard-date">
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon blue">♙</div>
          <div>
            <p>Account</p>
            <h2>Active</h2>
            <span>Employee account</span>
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
          <div className="stat-icon purple">▣</div>
          <div>
            <p>Announcements</p>
            <h2>{announcements.length}</h2>
            <span>Company notices</span>
          </div>
        </div>

      </div>

      <div className="section-heading">
        <div>
          <h2>Employee Services</h2>
          <p>Access your employee services below.</p>
        </div>
      </div>

      <div className="module-grid">

        {modules.map((module) => (
          <div className="module-card" key={module.id}>

            <div className="module-icon">
              {module.icon}
            </div>

            <h3>{module.title}</h3>

            <p>{module.description}</p>

            <button onClick={() => onNavigate(module.id)}>
              Open Module →
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default EmployeeDashboard;