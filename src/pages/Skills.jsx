import React, { useState } from "react";

function Skills({ onBack }) {
  const employees = JSON.parse(localStorage.getItem("employees")) || [];

  const [records, setRecords] = useState(
    JSON.parse(localStorage.getItem("skills")) || []
  );

  const [form, setForm] = useState({
    employeeEmail: "",
    skillName: "",
    proficiency: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedRecords = [
      ...records,
      {
        id: Date.now(),
        ...form,
      },
    ];

    setRecords(updatedRecords);
    localStorage.setItem("skills", JSON.stringify(updatedRecords));

    setForm({
      employeeEmail: "",
      skillName: "",
      proficiency: "",
    });

    alert("Skill added successfully!");
  };

  const handleDelete = (id) => {
    const updatedRecords = records.filter((item) => item.id !== id);
    setRecords(updatedRecords);
    localStorage.setItem("skills", JSON.stringify(updatedRecords));
  };

  return (
    <div style={{ padding: "30px" }}>
      <button onClick={onBack}>← Back to Dashboard</button>

      <h2>Skills Management</h2>

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

        <input
          type="text"
          placeholder="Enter Skill Name"
          value={form.skillName}
          onChange={(e) =>
            setForm({ ...form, skillName: e.target.value })
          }
          required
        />

        <br /><br />

        <select
          value={form.proficiency}
          onChange={(e) =>
            setForm({ ...form, proficiency: e.target.value })
          }
          required
        >
          <option value="">Select Proficiency</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>

        <br /><br />

        <button type="submit">Add Skill</button>
      </form>

      <h3>Employee Skills</h3>

      {records.length === 0 ? (
        <p>No skill records available.</p>
      ) : (
        records.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#f4f6f9",
              padding: "15px",
              margin: "10px 0",
              borderRadius: "8px",
            }}
          >
            <p><b>Employee:</b> {item.employeeEmail}</p>
            <p><b>Skill:</b> {item.skillName}</p>
            <p><b>Proficiency:</b> {item.proficiency}</p>

            <button onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Skills;