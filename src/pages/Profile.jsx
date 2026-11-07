import React from "react";

function Profile({ currentUser, onBack }) {
  const employees = JSON.parse(localStorage.getItem("employees")) || [];

  const employee = employees.find(
    (emp) => emp.email === currentUser?.email
  );

  const profile = employee || currentUser;

  return (
    <div style={{ padding: "30px" }}>
      <button onClick={onBack}>← Back to Dashboard</button>

      <h2>My Profile</h2>

      <div style={{
        background: "#f4f6f9",
        padding: "25px",
        borderRadius: "10px",
        maxWidth: "500px",
        marginTop: "20px"
      }}>
        <p><b>Name:</b> {profile.name || "Not available"}</p>
        <p><b>Email:</b> {profile.email || "Not available"}</p>
        <p><b>Employee ID:</b> {profile.id || "Not available"}</p>
        <p><b>Role:</b> {profile.role || "Employee"}</p>
        <p><b>Department:</b> {profile.department || "Not available"}</p>
      </div>
    </div>
  );
}

export default Profile;