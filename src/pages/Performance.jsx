import React, { useState } from "react";

function Performance({ onBack }) {
  const [employees] = useState(
    JSON.parse(localStorage.getItem("employees")) || []
  );

  const [records, setRecords] = useState(
    JSON.parse(localStorage.getItem("performance")) || []
  );

  const [form, setForm] = useState({
    employeeEmail: "",
    rating: "",
    feedback: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedRecords = [
      ...records,
      {
        id: Date.now(),
        ...form,
        date: new Date().toLocaleDateString(),
      },
    ];

    setRecords(updatedRecords);
    localStorage.setItem("performance", JSON.stringify(updatedRecords));

    setForm({ employeeEmail: "", rating: "", feedback: "" });
    alert("Performance record added successfully!");
  };

  return (
    <div style={{ padding: "30px" }}>
      <button onClick={onBack}>← Back to Dashboard</button>

      <h2>Performance Management</h2>

      <form onSubmit={handleSubmit}>
        <select
          value={form.employeeEmail}
          onChange={(e) =>
            setForm({ ...form, employeeEmail: e.target.value })
          }
          required
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.email}>
              {emp.name} ({emp.email})
            </option>
          ))}
        </select>

        <br /><br />

        <select
          value={form.rating}
          onChange={(e) =>
            setForm({ ...form, rating: e.target.value })
          }
          required
        >
          <option value="">Select Rating</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Average">Average</option>
          <option value="Needs Improvement">Needs Improvement</option>
        </select>

        <br /><br />

        <textarea
          placeholder="Enter feedback"
          value={form.feedback}
          onChange={(e) =>
            setForm({ ...form, feedback: e.target.value })
          }
          required
        />

        <br /><br />

        <button type="submit">Add Performance</button>
      </form>

      <h3>Performance Records</h3>

      {records.length === 0 ? (
        <p>No performance records available.</p>
      ) : (
        records.map((record) => (
          <div
            key={record.id}
            style={{
              background: "#f4f6f9",
              padding: "15px",
              margin: "10px 0",
              borderRadius: "8px",
            }}
          >
            <p><b>Employee:</b> {record.employeeEmail}</p>
            <p><b>Rating:</b> {record.rating}</p>
            <p><b>Feedback:</b> {record.feedback}</p>
            <p><b>Date:</b> {record.date}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Performance;