import React, { useEffect, useMemo, useState } from "react";

export default function SalaryManagement({ onBack, currentUser }) {
  const employees = JSON.parse(
    localStorage.getItem("employees") || "[]"
  );

  const isAdmin = currentUser?.role === "admin";

  const [salaries, setSalaries] = useState(() =>
    JSON.parse(localStorage.getItem("salaries") || "[]")
  );

  const [formData, setFormData] = useState({
    employeeEmail: "",
    month: "",
    basicSalary: "",
    allowances: "0",
    deductions: "0"
  });

  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("salaries", JSON.stringify(salaries));
  }, [salaries]);

  const visibleSalaries = useMemo(() => {
    return salaries
      .filter(salary =>
        isAdmin
          ? true
          : salary.employeeEmail === currentUser?.email
      )
      .filter(salary => {
        const matchesSearch =
          salary.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
          salary.employeeEmail?.toLowerCase().includes(search.toLowerCase());

        const matchesMonth =
          !monthFilter || salary.month === monthFilter;

        return matchesSearch && matchesMonth;
      })
      .sort((a, b) => b.month.localeCompare(a.month));
  }, [salaries, isAdmin, currentUser?.email, search, monthFilter]);

  const totalNetSalary = visibleSalaries.reduce(
    (total, salary) => total + Number(salary.netSalary || 0),
    0
  );

  const totalDeductions = visibleSalaries.reduce(
    (total, salary) => total + Number(salary.deductions || 0),
    0
  );

  const formatCurrency = value =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    }).format(Number(value) || 0);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setMessage("");

    const employee = employees.find(
      emp => emp.email === formData.employeeEmail
    );

    if (!employee) {
      setMessage("Please select a valid employee.");
      return;
    }

    const basic = Number(formData.basicSalary);
    const allowances = Number(formData.allowances);
    const deductions = Number(formData.deductions);

    if (
      !formData.month ||
      !Number.isFinite(basic) ||
      !Number.isFinite(allowances) ||
      !Number.isFinite(deductions) ||
      basic < 0 ||
      allowances < 0 ||
      deductions < 0
    ) {
      setMessage("Please enter valid salary details.");
      return;
    }

    const grossSalary = basic + allowances;

    if (deductions > grossSalary) {
      setMessage("Deductions cannot exceed basic salary plus allowances.");
      return;
    }

    const exists = salaries.some(
      salary =>
        salary.employeeEmail === formData.employeeEmail &&
        salary.month === formData.month
    );

    if (exists) {
      setMessage("A salary record already exists for this employee and month.");
      return;
    }

    const newSalary = {
      id: Date.now(),
      employeeName: employee.name,
      employeeEmail: employee.email,
      month: formData.month,
      basicSalary: basic,
      allowances,
      deductions,
      grossSalary,
      netSalary: grossSalary - deductions,
      createdAt: new Date().toISOString()
    };

    setSalaries(previous => [...previous, newSalary]);

    setFormData({
      employeeEmail: "",
      month: "",
      basicSalary: "",
      allowances: "0",
      deductions: "0"
    });

    setMessage("Salary record added successfully.");
  };

  const handleDelete = id => {
    if (!window.confirm("Are you sure you want to delete this salary record?")) {
      return;
    }

    setSalaries(previous =>
      previous.filter(salary => salary.id !== id)
    );

    setMessage("Salary record deleted successfully.");
  };

  const generatePayslip = salary => {
    const payslipWindow = window.open("", "_blank");

    if (!payslipWindow) {
      setMessage("Please allow pop-ups to open the payslip.");
      return;
    }

    const safe = value =>
      String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[character]);

    const currency = value =>
      formatCurrency(value);

    payslipWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Salary Payslip - ${safe(salary.month)}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f1f5f9;
              padding: 25px;
              color: #1e293b;
            }
            .payslip {
              max-width: 650px;
              margin: 20px auto;
              padding: 30px;
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
            }
            h1, h2 { text-align: center; }
            h1 { color: #1d4ed8; }
            .details { line-height: 1.9; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            td {
              padding: 13px;
              border-bottom: 1px solid #e2e8f0;
            }
            td:last-child { text-align: right; }
            .total {
              font-weight: bold;
              font-size: 18px;
              background: #eff6ff;
            }
            .print {
              display: block;
              margin: 25px auto 0;
              padding: 11px 24px;
              background: #2563eb;
              color: white;
              border: 0;
              border-radius: 6px;
              cursor: pointer;
            }
            @media print {
              body { background: white; padding: 0; }
              .payslip { border: 0; margin: 0 auto; }
              .print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="payslip">
            <h1>Employee Management System</h1>
            <h2>Salary Payslip</h2>
            <hr />
            <div class="details">
              <p><strong>Employee:</strong> ${safe(salary.employeeName)}</p>
              <p><strong>Email:</strong> ${safe(salary.employeeEmail)}</p>
              <p><strong>Salary Month:</strong> ${safe(salary.month)}</p>
            </div>
            <table>
              <tr><td>Basic Salary</td><td>${currency(salary.basicSalary)}</td></tr>
              <tr><td>Allowances</td><td>${currency(salary.allowances)}</td></tr>
              <tr><td>Gross Salary</td><td>${currency(salary.grossSalary ?? (Number(salary.basicSalary) + Number(salary.allowances)))}</td></tr>
              <tr><td>Deductions</td><td>${currency(salary.deductions)}</td></tr>
              <tr class="total"><td>Net Salary</td><td>${currency(salary.netSalary)}</td></tr>
            </table>
            <button class="print" onclick="window.print()">Print Payslip</button>
          </div>
        </body>
      </html>
    `);

    payslipWindow.document.close();
  };

  return (
    <div className="salary-page">
      <button className="salary-back-button" onClick={onBack}>
        ← Back to Dashboard
      </button>

      <div className="salary-heading">
        <div>
          <h1>Salary & Payslip Management</h1>
          <p>
            {isAdmin
              ? "Manage employee salary records and payslips."
              : "View your salary information and payslips."}
          </p>
        </div>
      </div>

      <div className="salary-summary">
        <div className="salary-summary-card">
          <span>Total Records</span>
          <h2>{visibleSalaries.length}</h2>
        </div>

        <div className="salary-summary-card">
          <span>Total Net Salary</span>
          <h2>{formatCurrency(totalNetSalary)}</h2>
        </div>

        <div className="salary-summary-card">
          <span>Total Deductions</span>
          <h2>{formatCurrency(totalDeductions)}</h2>
        </div>
      </div>

      {isAdmin && (
        <section className="salary-card">
          <h2>Add Salary Details</h2>

          {employees.length === 0 ? (
            <p>No employees found. Add employees first.</p>
          ) : (
            <form className="salary-form" onSubmit={handleSubmit}>
              <div className="salary-form-group">
                <label>Select Employee</label>
                <select
                  name="employeeEmail"
                  value={formData.employeeEmail}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.email}>
                      {employee.name} ({employee.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="salary-form-group">
                <label>Salary Month</label>
                <input
                  type="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="salary-form-group">
                <label>Basic Salary (₹)</label>
                <input
                  type="number"
                  name="basicSalary"
                  min="0"
                  step="0.01"
                  value={formData.basicSalary}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="salary-form-group">
                <label>Allowances (₹)</label>
                <input
                  type="number"
                  name="allowances"
                  min="0"
                  step="0.01"
                  value={formData.allowances}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="salary-form-group">
                <label>Deductions (₹)</label>
                <input
                  type="number"
                  name="deductions"
                  min="0"
                  step="0.01"
                  value={formData.deductions}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="salary-submit-button">
                <span>＋</span> Save Salary
              </button>
            </form>
          )}

          {message && <p className="salary-message">{message}</p>}
        </section>
      )}

      <section className="salary-card">
        <div className="salary-record-heading">
          <div>
            <h2>{isAdmin ? "All Salary Records" : "My Salary Records"}</h2>
            <p>{visibleSalaries.length} record(s) found</p>
          </div>
        </div>

        <div className="salary-filters">
          {isAdmin && (
            <input
              type="search"
              placeholder="Search employee..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          )}

          <input
            type="month"
            value={monthFilter}
            onChange={e => setMonthFilter(e.target.value)}
            aria-label="Filter by salary month"
          />

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setMonthFilter("");
            }}
            className="salary-clear-button"
          >
            Clear Filters
          </button>
        </div>

        {visibleSalaries.length === 0 ? (
          <div className="salary-empty">
            <h3>No salary records found</h3>
            <p>
              {isAdmin
                ? "Add a salary record or change your filters."
                : "Your salary details have not been added yet. Please contact Admin."}
            </p>
          </div>
        ) : (
          <div className="salary-table-wrapper">
            <table className="salary-table">
              <thead>
                <tr>
                  {isAdmin && <th>Employee</th>}
                  <th>Month</th>
                  <th>Basic</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleSalaries.map(salary => (
                  <tr key={salary.id}>
                    {isAdmin && (
                      <td>
                        <strong>{salary.employeeName}</strong>
                        <small>{salary.employeeEmail}</small>
                      </td>
                    )}
                    <td>{salary.month}</td>
                    <td>{formatCurrency(salary.basicSalary)}</td>
                    <td>{formatCurrency(salary.allowances)}</td>
                    <td>{formatCurrency(salary.deductions)}</td>
                    <td className="salary-net">
                      {formatCurrency(salary.netSalary)}
                    </td>
                    <td>
                      <div className="salary-actions">
                        <button
                          className="salary-payslip-button"
                          onClick={() => generatePayslip(salary)}
                        >
                          View Payslip
                        </button>

                        {isAdmin && (
                          <button
                            className="salary-delete-button"
                            onClick={() => handleDelete(salary.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isAdmin && (
          <p className="salary-note">
            Contact Admin if your salary details are missing or incorrect.
          </p>
        )}
      </section>

      {message && !isAdmin && (
        <p className="salary-message">{message}</p>
      )}
    </div>
  );
}