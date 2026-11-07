import React from "react";
import "./DashboardLayout.css";

function DashboardLayout({
  title = "Dashboard",
  userName = "User",
  menuItems = [],
  activeModule,
  onNavigate,
  onLogout,
  children,
}) {
  const getInitials = (name) => {
    return (name || "U")
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">H</div>

          <div className="brand-text">
            <h2>HR Portal</h2>
            <span>Management System</span>
          </div>
        </div>

        <div className="sidebar-menu">

          <p className="menu-heading">MAIN MENU</p>

          <nav aria-label="Main navigation">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`menu-item ${
                  activeModule === item.id ? "active" : ""
                }`}
                onClick={() => onNavigate?.(item.id)}
                aria-current={
                  activeModule === item.id ? "page" : undefined
                }
              >
                <span className="menu-icon">
                  {item.icon}
                </span>

                <span className="menu-label">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

        </div>

        {/* SIDEBAR FOOTER */}
        <div className="sidebar-bottom">

          <div className="sidebar-user">
            <div className="user-avatar">
              {getInitials(userName)}
            </div>

            <div className="sidebar-user-info">
              <strong>{userName}</strong>
              <span>Active User</span>
            </div>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={onLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOP HEADER */}
        <header className="topbar">

          <div className="topbar-heading">
            <h2>{title}</h2>
            <p>
              Welcome back, {userName}!
            </p>
          </div>

          <div className="user-profile">

            <div className="user-avatar">
              {getInitials(userName)}
            </div>

            <div className="user-details">
              <strong>{userName}</strong>
              <span>Account</span>
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <section className="page-content">
          {children}
        </section>

      </main>

    </div>
  );
}

export default DashboardLayout;