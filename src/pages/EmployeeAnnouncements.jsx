import React from "react";

function EmployeeAnnouncements({ onBack }) {
  const announcements =
    JSON.parse(localStorage.getItem("announcements")) || [];

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <button onClick={onBack}>← Back to Dashboard</button>

      <h2>Company Announcements</h2>
      <p>Latest notices and updates from the Admin.</p>

      {announcements.length === 0 ? (
        <p>No announcements available.</p>
      ) : (
        announcements.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#f4f6f9",
              padding: "20px",
              margin: "15px 0",
              borderRadius: "8px",
              borderLeft: "4px solid #2563eb",
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.message}</p>
            <p><b>Category:</b> {item.category}</p>
            <p><b>Date:</b> {item.date}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default EmployeeAnnouncements;