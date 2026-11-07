import React, { useState } from "react";

function Announcements({ onBack }) {
  const [announcements, setAnnouncements] = useState(
    JSON.parse(localStorage.getItem("announcements")) || []
  );

  const [form, setForm] = useState({
    title: "",
    message: "",
    category: "General",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAnnouncement = {
      id: Date.now(),
      title: form.title,
      message: form.message,
      category: form.category,
      date: new Date().toLocaleDateString(),
    };

    const updatedAnnouncements = [
      newAnnouncement,
      ...announcements,
    ];

    setAnnouncements(updatedAnnouncements);
    localStorage.setItem(
      "announcements",
      JSON.stringify(updatedAnnouncements)
    );

    setForm({
      title: "",
      message: "",
      category: "General",
    });

    alert("Announcement published successfully!");
  };

  const handleDelete = (id) => {
    const updatedAnnouncements = announcements.filter(
      (item) => item.id !== id
    );

    setAnnouncements(updatedAnnouncements);
    localStorage.setItem(
      "announcements",
      JSON.stringify(updatedAnnouncements)
    );
  };

  return (
    <div style={{ padding: "30px" }}>
      <button onClick={onBack}>← Back to Dashboard</button>

      <h2>Announcements Management</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Announcement Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <br /><br />

        <textarea
          placeholder="Enter announcement message"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
          required
          rows="4"
        />

        <br /><br />

        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="General">General</option>
          <option value="Important">Important</option>
          <option value="Holiday">Holiday</option>
          <option value="Meeting">Meeting</option>
        </select>

        <br /><br />

        <button type="submit">Publish Announcement</button>
      </form>

      <h3>Published Announcements</h3>

      {announcements.length === 0 ? (
        <p>No announcements available.</p>
      ) : (
        announcements.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#f4f6f9",
              padding: "15px",
              margin: "15px 0",
              borderRadius: "8px",
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.message}</p>
            <p><b>Category:</b> {item.category}</p>
            <p><b>Date:</b> {item.date}</p>

            <button onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Announcements;