import React, { useEffect, useMemo, useState } from "react";

export default function LeaveManagement({ onBack, currentUser }) {
  const user = currentUser ||
    JSON.parse(localStorage.getItem("currentUser") || "{}");

  const [requests, setRequests] = useState(() =>
    JSON.parse(localStorage.getItem("leaveRequests") || "[]")
  );

  const [formData, setFormData] = useState({
    leaveType: "Casual Leave",
    fromDate: "",
    toDate: "",
    reason: ""
  });

  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isAdmin = user.role === "admin";

  useEffect(() => {
    localStorage.setItem("leaveRequests", JSON.stringify(requests));
  }, [requests]);

  const today = new Date().toLocaleDateString("en-CA");

  const visibleRequests = useMemo(() => {
    const filtered = isAdmin
      ? requests
      : requests.filter(
          request =>
            request.employeeEmail?.toLowerCase() ===
            user.email?.toLowerCase()
        );

    return filtered.filter(request => {
      const text = search.toLowerCase();

      return (
        request.employeeName?.toLowerCase().includes(text) ||
        request.leaveType?.toLowerCase().includes(text) ||
        request.status?.toLowerCase().includes(text)
      );
    });
  }, [requests, isAdmin, user.email, search]);

  const pendingCount = visibleRequests.filter(
    request => request.status === "Pending"
  ).length;

  const approvedCount = visibleRequests.filter(
    request => request.status === "Approved"
  ).length;

  const rejectedCount = visibleRequests.filter(
    request => request.status === "Rejected"
  ).length;

  const getLeaveDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 0;

    const start = new Date(`${fromDate}T00:00:00`);
    const end = new Date(`${toDate}T00:00:00`);

    return Math.round((end - start) / 86400000) + 1;
  };

  const formatDate = value => {
    if (!value) return "";

    return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const handleSubmit = event => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!user.email) {
      setError("Your account information could not be found.");
      return;
    }

    if (!formData.fromDate || !formData.toDate || !formData.reason.trim()) {
      setError("Please complete all leave application fields.");
      return;
    }

    if (formData.fromDate < today) {
      setError("Leave start date cannot be in the past.");
      return;
    }

    if (formData.toDate < formData.fromDate) {
      setError("To date cannot be before From date.");
      return;
    }

    const overlapping = requests.some(request =>
      request.employeeEmail?.toLowerCase() === user.email.toLowerCase() &&
      request.status !== "Rejected" &&
      formData.fromDate <= request.toDate &&
      formData.toDate >= request.fromDate
    );

    if (overlapping) {
      setError("You already have a pending or approved leave request for these dates.");
      return;
    }

    const newRequest = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      employeeId: user.id,
      employeeName: user.name || "Employee",
      employeeEmail: user.email,
      leaveType: formData.leaveType,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      reason: formData.reason.trim(),
      days: getLeaveDays(formData.fromDate, formData.toDate),
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    setRequests(previous => [...previous, newRequest]);

    setFormData({
      leaveType: "Casual Leave",
      fromDate: "",
      toDate: "",
      reason: ""
    });

    setMessage("Your leave request was submitted successfully.");
  };

  const updateStatus = (id, status) => {
    if (!isAdmin) return;

    setRequests(previous =>
      previous.map(request =>
        request.id === id
          ? { ...request, status, updatedAt: new Date().toISOString() }
          : request
      )
    );

    setMessage(`Leave request ${status.toLowerCase()} successfully.`);
    setError("");
  };

  return (
    <div className="leave-page">

      <div className="leave-header">
        <div>
          <h1>Leave Management</h1>
          <p>
            {isAdmin
              ? "Review and manage employee leave applications."
              : "Apply for leave and track your application status."}
          </p>
        </div>

        {onBack && (
          <button className="leave-back-button" onClick={onBack}>
            ← Back to Dashboard
          </button>
        )}
      </div>

      {/* SUMMARY CARDS */}

      <div className="leave-summary-grid">

        <div className="leave-summary-card pending">
          <span>Pending Requests</span>
          <h2>{pendingCount}</h2>
        </div>

        <div className="leave-summary-card approved">
          <span>Approved Requests</span>
          <h2>{approvedCount}</h2>
        </div>

        <div className="leave-summary-card rejected">
          <span>Rejected Requests</span>
          <h2>{rejectedCount}</h2>
        </div>

      </div>

      {/* EMPLOYEE APPLICATION FORM */}

      {!isAdmin && (
        <div className="leave-card">
          <h2>Apply for Leave</h2>
          <p className="leave-description">
            Complete the form to submit a new leave application.
          </p>

          <form className="leave-form" onSubmit={handleSubmit}>

            <div className="leave-form-grid">

              <div>
                <label htmlFor="leave-type">Leave Type</label>
                <select
                  id="leave-type"
                  value={formData.leaveType}
                  onChange={event =>
                    setFormData({
                      ...formData,
                      leaveType: event.target.value
                    })
                  }
                >
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Earned Leave</option>
                  <option>Personal Leave</option>
                </select>
              </div>

              <div>
                <label htmlFor="leave-from">From Date</label>
                <input
                  id="leave-from"
                  type="date"
                  min={today}
                  value={formData.fromDate}
                  onChange={event =>
                    setFormData({
                      ...formData,
                      fromDate: event.target.value,
                      toDate:
                        formData.toDate &&
                        formData.toDate < event.target.value
                          ? ""
                          : formData.toDate
                    })
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="leave-to">To Date</label>
                <input
                  id="leave-to"
                  type="date"
                  min={formData.fromDate || today}
                  value={formData.toDate}
                  onChange={event =>
                    setFormData({
                      ...formData,
                      toDate: event.target.value
                    })
                  }
                  required
                />
              </div>

              <div>
                <label>Leave Duration</label>
                <div className="leave-duration">
                  {formData.fromDate && formData.toDate &&
                  formData.toDate >= formData.fromDate
                    ? `${getLeaveDays(formData.fromDate, formData.toDate)} day(s)`
                    : "Select leave dates"}
                </div>
              </div>

            </div>

            <div>
              <label htmlFor="leave-reason">Reason for Leave</label>
              <textarea
                id="leave-reason"
                placeholder="Enter your reason for requesting leave..."
                value={formData.reason}
                onChange={event =>
                  setFormData({
                    ...formData,
                    reason: event.target.value
                  })
                }
                rows="4"
                required
              />
            </div>

            <button type="submit" className="leave-submit-button">
              Submit Leave Request
            </button>

          </form>
        </div>
      )}

      {/* LEAVE REQUEST TABLE */}

      <div className="leave-card">

        <div className="leave-table-heading">
          <div>
            <h2>
              {isAdmin ? "All Leave Requests" : "My Leave Requests"}
            </h2>
            <p className="leave-description">
              Review leave application details and statuses.
            </p>
          </div>

          <input
            type="search"
            className="leave-search"
            placeholder="Search requests..."
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
        </div>

        {visibleRequests.length === 0 ? (

          <div className="leave-empty">
            <h3>No Leave Requests Found</h3>
            <p>
              {search
                ? "Try another search term."
                : "There are no leave applications to display."}
            </p>
          </div>

        ) : (

          <div className="leave-table-wrapper">

            <table className="leave-table">

              <thead>
                <tr>
                  {isAdmin && <th>Employee</th>}
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  {isAdmin && <th>Action</th>}
                </tr>
              </thead>

              <tbody>

                {visibleRequests.map(request => (

                  <tr key={request.id}>

                    {isAdmin && (
                      <td>
                        <strong>{request.employeeName}</strong>
                        <small className="leave-email">
                          {request.employeeEmail}
                        </small>
                      </td>
                    )}

                    <td>{request.leaveType}</td>
                    <td>{formatDate(request.fromDate)}</td>
                    <td>{formatDate(request.toDate)}</td>

                    <td>
                      {request.days ||
                        getLeaveDays(request.fromDate, request.toDate)}
                    </td>

                    <td className="leave-reason-cell">
                      {request.reason}
                    </td>

                    <td>
                      <span
                        className={`leave-status ${
                          request.status === "Approved"
                            ? "leave-approved"
                            : request.status === "Rejected"
                            ? "leave-rejected"
                            : "leave-pending"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>

                    {isAdmin && (
                      <td>
                        {request.status === "Pending" ? (
                          <div className="leave-actions">

                            <button
                              className="leave-approve-button"
                              onClick={() =>
                                updateStatus(request.id, "Approved")
                              }
                            >
                              Approve
                            </button>

                            <button
                              className="leave-reject-button"
                              onClick={() =>
                                updateStatus(request.id, "Rejected")
                              }
                            >
                              Reject
                            </button>

                          </div>
                        ) : (
                          <span className="leave-completed">
                            Completed
                          </span>
                        )}
                      </td>
                    )}

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

        {message && (
          <div className="leave-message" role="status">
            {message}
          </div>
        )}

        {error && (
          <div className="leave-error" role="alert">
            {error}
          </div>
        )}

      </div>

    </div>
  );
}