import React, { useMemo, useState } from "react";

const readData = keys => {
  for (const key of keys) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");

      if (Array.isArray(value)) return value;

      if (Array.isArray(value.records)) return value.records;
      if (Array.isArray(value.data)) return value.data;
      if (Array.isArray(value.requests)) return value.requests;
    } catch {
      // Ignore invalid stored data and try the next key.
    }
  }

  return [];
};

const getMonth = value => {
  if (!value) return "";

  const text = String(value);

  if (/^\d{4}-\d{2}/.test(text)) {
    return text.slice(0, 7);
  }

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) return "";

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
};

const formatCurrency = value =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number(value) || 0);

export default function Reports({ onBack, currentUser }) {
  const [month, setMonth] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  const employees = useMemo(
    () => readData(["employees"]),
    [refreshKey]
  );

  const attendance = useMemo(
    () => readData(["attendance", "attendanceRecords"]),
    [refreshKey]
  );

  const leaves = useMemo(
    () => readData([
      "leaveRequests",
      "leaves",
      "leaveApplications"
    ]),
    [refreshKey]
  );

  const salaries = useMemo(
    () => readData(["salaries"]),
    [refreshKey]
  );

  const isAdmin = currentUser?.role === "admin";

  const filteredAttendance = attendance.filter(record => {
    const recordMonth = getMonth(
      record.date ||
      record.attendanceDate ||
      record.createdAt
    );

    return !month || recordMonth === month;
  });

  const filteredLeaves = leaves.filter(leave => {
    const leaveMonth = getMonth(
      leave.fromDate ||
      leave.startDate ||
      leave.date ||
      leave.createdAt
    );

    return !month || leaveMonth === month;
  });

  const filteredSalaries = salaries.filter(
    salary => !month || salary.month === month
  );

  const presentCount = filteredAttendance.filter(record =>
    String(record.status || "").toLowerCase() === "present"
  ).length;

  const absentCount = filteredAttendance.filter(record =>
    String(record.status || "").toLowerCase() === "absent"
  ).length;

  const pendingLeaves = filteredLeaves.filter(leave =>
    String(leave.status || "").toLowerCase() === "pending"
  ).length;

  const approvedLeaves = filteredLeaves.filter(leave =>
    String(leave.status || "").toLowerCase() === "approved"
  ).length;

  const rejectedLeaves = filteredLeaves.filter(leave =>
    String(leave.status || "").toLowerCase() === "rejected"
  ).length;

  const totalPayroll = filteredSalaries.reduce(
    (total, salary) => total + Number(salary.netSalary || 0),
    0
  );

  const totalDeductions = filteredSalaries.reduce(
    (total, salary) => total + Number(salary.deductions || 0),
    0
  );

  const exportCSV = () => {
    const rows = [
      ["HR Management System - Reports"],
      ["Report Month", month || "All Months"],
      [],
      ["Category", "Metric", "Value"],
      ["Employees", "Total Employees", employees.length],
      ["Attendance", "Present", presentCount],
      ["Attendance", "Absent", absentCount],
      ["Attendance", "Total Records", filteredAttendance.length],
      ["Leave", "Pending Requests", pendingLeaves],
      ["Leave", "Approved Requests", approvedLeaves],
      ["Leave", "Rejected Requests", rejectedLeaves],
      ["Salary", "Salary Records", filteredSalaries.length],
      ["Salary", "Total Net Payroll", totalPayroll],
      ["Salary", "Total Deductions", totalDeductions]
    ];

    const csv = rows
      .map(row =>
        row.map(value =>
          `"${String(value ?? "").replace(/"/g, '""')}"`
        ).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `HR-Report-${month || "All-Months"}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return (
      <div className="reports-page">
        <h2>Access Restricted</h2>
        <p>Only Admin users can view reports.</p>
        <button onClick={onBack} className="reports-back-button">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <button
            onClick={onBack}
            className="reports-back-button"
          >
            ← Back to Dashboard
          </button>

          <h1>Reports & Analytics</h1>
          <p>View your HR management system summary.</p>
        </div>

        <div className="reports-header-actions">
          <button
            onClick={() => setRefreshKey(value => value + 1)}
            className="reports-refresh-button"
          >
            ↻ Refresh
          </button>

          <button
            onClick={exportCSV}
            className="reports-export-button"
          >
            ↓ Export CSV
          </button>

          <button
            onClick={() => window.print()}
            className="reports-print-button"
          >
            Print
          </button>
        </div>
      </div>

      <section className="reports-filter">
        <label htmlFor="report-month">Select Report Month</label>
        <input
          id="report-month"
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
        />

        <button onClick={() => setMonth("")}>
          Show All
        </button>
      </section>

      <h2 className="reports-section-title">Employee Overview</h2>

      <div className="reports-grid">
        <div className="reports-card">
          <span>Total Employees</span>
          <h2>{employees.length}</h2>
          <p>Registered employees</p>
        </div>

        <div className="reports-card">
          <span>Attendance Records</span>
          <h2>{filteredAttendance.length}</h2>
          <p>Records for selected period</p>
        </div>

        <div className="reports-card">
          <span>Leave Requests</span>
          <h2>{filteredLeaves.length}</h2>
          <p>Total requests in selected period</p>
        </div>

        <div className="reports-card">
          <span>Salary Records</span>
          <h2>{filteredSalaries.length}</h2>
          <p>Salary entries in selected period</p>
        </div>
      </div>

      <h2 className="reports-section-title">Attendance Report</h2>

      <div className="reports-grid reports-grid-three">
        <div className="reports-card reports-present">
          <span>Present</span>
          <h2>{presentCount}</h2>
        </div>

        <div className="reports-card reports-absent">
          <span>Absent</span>
          <h2>{absentCount}</h2>
        </div>

        <div className="reports-card">
          <span>Total Attendance Entries</span>
          <h2>{filteredAttendance.length}</h2>
        </div>
      </div>

      <h2 className="reports-section-title">Leave Report</h2>

      <div className="reports-grid reports-grid-three">
        <div className="reports-card reports-pending">
          <span>Pending Requests</span>
          <h2>{pendingLeaves}</h2>
        </div>

        <div className="reports-card reports-approved">
          <span>Approved Requests</span>
          <h2>{approvedLeaves}</h2>
        </div>

        <div className="reports-card reports-rejected">
          <span>Rejected Requests</span>
          <h2>{rejectedLeaves}</h2>
        </div>
      </div>

      <h2 className="reports-section-title">Salary Report</h2>

      <div className="reports-grid reports-grid-three">
        <div className="reports-card">
          <span>Total Net Payroll</span>
          <h2>{formatCurrency(totalPayroll)}</h2>
          <p>Based on available salary records</p>
        </div>

        <div className="reports-card">
          <span>Total Deductions</span>
          <h2>{formatCurrency(totalDeductions)}</h2>
        </div>

        <div className="reports-card">
          <span>Salary Records</span>
          <h2>{filteredSalaries.length}</h2>
        </div>
      </div>

      <div className="reports-note">
        <strong>Note:</strong> Reports are calculated from the information
        currently saved in your browser. If a section shows zero records,
        check that module's localStorage key and data structure.
      </div>
    </div>
  );
}