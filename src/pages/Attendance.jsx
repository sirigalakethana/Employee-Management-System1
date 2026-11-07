import React, { useEffect, useMemo, useState } from "react";

export default function Attendance({ onBack, currentUser }) {
  const [employees] = useState(() =>
    JSON.parse(localStorage.getItem("employees") || "[]")
  );

  const [date, setDate] = useState(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60000)
      .toISOString()
      .split("T")[0];
  });

  const [records, setRecords] = useState(() =>
    JSON.parse(localStorage.getItem("attendance") || "[]")
  );

  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(records));
  }, [records]);

  const myEmployee = employees.find(
    employee =>
      String(employee.id) === String(currentUser?.id) ||
      employee.email?.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  const employeeRecords = useMemo(() => {
    if (isAdmin) return records;

    return records.filter(
      item =>
        String(item.employeeId) === String(currentUser?.id) ||
        item.employeeEmail?.toLowerCase() ===
          currentUser?.email?.toLowerCase()
    );
  }, [records, isAdmin, currentUser]);

  const selectedDateRecords = employeeRecords.filter(
    item => item.date === date
  );

  const presentCount = isAdmin
    ? selectedDateRecords.filter(item => item.status === "Present").length
    : employeeRecords.filter(item => item.status === "Present").length;

  const absentCount = isAdmin
    ? selectedDateRecords.filter(item => item.status === "Absent").length
    : employeeRecords.filter(item => item.status === "Absent").length;

  const getStatus = employeeId => {
    const record = records.find(
      item =>
        String(item.employeeId) === String(employeeId) &&
        item.date === date
    );

    return record?.status || "Not Marked";
  };

  const filteredEmployees = employees.filter(employee => {
    const searchText = search.toLowerCase();

    return (
      employee.name?.toLowerCase().includes(searchText) ||
      employee.email?.toLowerCase().includes(searchText)
    );
  });

  const markAttendance = (employee, status) => {
    if (!isAdmin) return;

    const updatedRecords = [
      ...records.filter(
        item =>
          !(
            String(item.employeeId) === String(employee.id) &&
            item.date === date
          )
      ),
      {
        employeeId: employee.id,
        employeeName: employee.name,
        employeeEmail: employee.email,
        date,
        status
      }
    ];

    setRecords(updatedRecords);
    setMessage(`${employee.name} marked as ${status}.`);
  };

  const formatDate = value => {
    if (!value) return "";

    return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <div>
          <h1>{isAdmin ? "Attendance Management" : "My Attendance"}</h1>
          <p>
            {isAdmin
              ? "Manage and monitor employee attendance."
              : "View your personal attendance history."}
          </p>
        </div>

        {onBack && (
          <button className="attendance-back-button" onClick={onBack}>
            ← Back to Dashboard
          </button>
        )}
      </div>

      <div className="attendance-card">
        <div className="attendance-date-field">
          <label htmlFor="attendance-date">Select Date</label>
          <input
            id="attendance-date"
            type="date"
            value={date}
            onChange={event => {
              setDate(event.target.value);
              setMessage("");
            }}
          />
        </div>

        <div className="attendance-summary">
          {isAdmin && (
            <div className="attendance-summary-box">
              <span>Total Employees</span>
              <h2>{employees.length}</h2>
            </div>
          )}

          <div className="attendance-summary-box present-summary">
            <span>{isAdmin ? "Present Today" : "Total Present Days"}</span>
            <h2>{presentCount}</h2>
          </div>

          <div className="attendance-summary-box absent-summary">
            <span>{isAdmin ? "Absent Today" : "Total Absent Days"}</span>
            <h2>{absentCount}</h2>
          </div>

          {isAdmin && (
            <div className="attendance-summary-box pending-summary">
              <span>Not Marked</span>
              <h2>
                {Math.max(
                  employees.length - selectedDateRecords.length,
                  0
                )}
              </h2>
            </div>
          )}
        </div>
      </div>

      <div className="attendance-card">
        <div className="attendance-section-heading">
          <div>
            <h2>
              {isAdmin ? "Employee Attendance" : "My Attendance History"}
            </h2>
            <p>
              {isAdmin
                ? `Attendance for ${formatDate(date)}`
                : "Your recorded attendance details"}
            </p>
          </div>

          {isAdmin && (
            <input
              className="attendance-search"
              type="search"
              placeholder="Search employee..."
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          )}
        </div>

        {isAdmin ? (
          employees.length === 0 ? (
            <div className="attendance-empty">
              <h3>No Employees Found</h3>
              <p>Add employees before marking attendance.</p>
            </div>
          ) : (
            <div className="attendance-table-wrapper">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="attendance-no-records">
                        No matching employees found.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map(employee => {
                      const status = getStatus(employee.id);

                      return (
                        <tr key={employee.id}>
                          <td>{employee.name}</td>
                          <td>{employee.email}</td>
                          <td>
                            <span
                              className={`attendance-status ${
                                status === "Present"
                                  ? "status-present"
                                  : status === "Absent"
                                  ? "status-absent"
                                  : "status-not-marked"
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                          <td>
                            <div className="attendance-actions">
                              <button
                                className="attendance-present-button"
                                onClick={() =>
                                  markAttendance(employee, "Present")
                                }
                              >
                                Present
                              </button>

                              <button
                                className="attendance-absent-button"
                                onClick={() =>
                                  markAttendance(employee, "Absent")
                                }
                              >
                                Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )
        ) : !myEmployee ? (
          <div className="attendance-empty">
            <h3>Employee Profile Not Found</h3>
            <p>Please contact your administrator.</p>
          </div>
        ) : (
          <div className="attendance-table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Employee Name</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {employeeRecords.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="attendance-no-records">
                      No attendance records available yet.
                    </td>
                  </tr>
                ) : (
                  [...employeeRecords]
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((record, index) => (
                      <tr key={`${record.date}-${record.employeeId}-${index}`}>
                        <td>{formatDate(record.date)}</td>
                        <td>{record.employeeName}</td>
                        <td>
                          <span
                            className={`attendance-status ${
                              record.status === "Present"
                                ? "status-present"
                                : "status-absent"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {message && (
          <div className="attendance-message" role="status">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}