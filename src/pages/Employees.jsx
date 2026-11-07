import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function Employees({ onBack, onLogout }) {

  const [employees, setEmployees] = useState(() => {
    const saved = JSON.parse(
      localStorage.getItem("employees") || "[]"
    );

    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const registered = users
      .filter(user => user.role === "employee")
      .map((user, index) => ({
        id: user.id || `registered-${index}`,
        name: user.name || "",
        email: user.email || "",
        department: "",
        position: "",
        salary: ""
      }));

    const merged = [...saved];

    registered.forEach(user => {
      const exists = merged.some(
        emp => emp.email?.toLowerCase() === user.email.toLowerCase()
      );

      if (!exists) merged.push(user);
    });

    return merged;
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    salary: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const menuItems = [
    { id: "employees", label: "Employees", icon: "👥" },
    { id: "attendance", label: "Attendance", icon: "📅" },
    { id: "leave", label: "Leave Management", icon: "📋" },
    { id: "salary", label: "Salary & Payslip", icon: "₹" },
    { id: "performance", label: "Performance", icon: "📈" },
    { id: "skills", label: "Skills", icon: "⭐" },
    { id: "announcements", label: "Announcements", icon: "📢" }
  ];

  const saveForm = (e) => {
    e.preventDefault();

    const email = formData.email.trim().toLowerCase();

    const duplicate = employees.some(
      emp =>
        emp.email?.toLowerCase() === email &&
        emp.id !== editingId
    );

    if (duplicate) {
      setMessage("An employee with this email already exists.");
      return;
    }

    if (editingId !== null) {
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === editingId
            ? { ...formData, email, id: editingId }
            : emp
        )
      );

      setMessage("Employee updated successfully!");
    } else {
      setEmployees(prev => [
        ...prev,
        {
          ...formData,
          email,
          id: Date.now()
        }
      ]);

      setMessage("Employee added successfully!");
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      department: "",
      position: "",
      salary: ""
    });

    setEditingId(null);
    setShowForm(false);
  };

  const editEmployee = (employee) => {
    setFormData({
      name: employee.name || "",
      email: employee.email || "",
      department: employee.department || "",
      position: employee.position || "",
      salary: employee.salary || ""
    });

    setEditingId(employee.id);
    setShowForm(true);
    setMessage("");
  };

  const deleteEmployee = (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setMessage("Employee deleted successfully!");
  };

  const departments = [
    "All",
    ...new Set(
      employees.map(emp => emp.department).filter(Boolean)
    )
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      departmentFilter === "All" ||
      emp.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  return (
    <DashboardLayout
      title="Employee Management"
      userName={
        JSON.parse(localStorage.getItem("currentUser") || "null")?.name
      }
      menuItems={menuItems}
      activeModule="employees"
      onNavigate={(module) => {
        if (module === "employees") return;
        onBack?.(module);
      }}
      onLogout={onLogout}
    >

      <div className="page-content">

        <div className="section-heading">
          <div>
            <h2>Employee Management</h2>
            <p>Manage your organization's employee information.</p>
          </div>

          <button
            className="employee-add-button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Add Employee
          </button>
        </div>

        {/* Statistics */}

        <div className="employee-stats">

          <div className="employee-stat-card">
            <span>Total Employees</span>
            <h2>{employees.length}</h2>
          </div>

          <div className="employee-stat-card">
            <span>Departments</span>
            <h2>{departments.length - 1}</h2>
          </div>

          <div className="employee-stat-card">
            <span>Showing Results</span>
            <h2>{filteredEmployees.length}</h2>
          </div>

        </div>

        {/* Add / Edit Form */}

        {showForm && (
          <div className="employee-form-card">

            <h3>
              {editingId !== null
                ? "Update Employee"
                : "Add New Employee"}
            </h3>

            <form onSubmit={saveForm}>

              <div className="employee-form-grid">

                <div>
                  <label>Employee Name</label>
                  <input
                    type="text"
                    placeholder="Enter employee name"
                    value={formData.name}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        name: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        email: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label>Department</label>
                  <input
                    type="text"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        department: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label>Job Position</label>
                  <input
                    type="text"
                    placeholder="Enter job position"
                    value={formData.position}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        position: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label>Monthly Salary (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter salary"
                    value={formData.salary}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        salary: e.target.value
                      })
                    }
                    required
                  />
                </div>

              </div>

              <div className="employee-form-actions">

                <button type="submit">
                  {editingId !== null
                    ? "Update Employee"
                    : "Save Employee"}
                </button>

                <button
                  type="button"
                  className="employee-cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {message && (
          <p className="employee-message">{message}</p>
        )}

        {/* Employee Table */}

        <div className="employee-table-card">

          <div className="employee-table-heading">
            <div>
              <h3>Employee Directory</h3>
              <p>View and manage employee records.</p>
            </div>
          </div>

          <div className="employee-filters">

            <input
              type="search"
              placeholder="Search employees..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
            >
              {departments.map(department => (
                <option key={department} value={department}>
                  {department === "All"
                    ? "All Departments"
                    : department}
                </option>
              ))}
            </select>

          </div>

          <div className="employee-table-wrapper">

            <table className="employee-table">

              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="employee-empty">
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(employee => (
                    <tr key={employee.id}>

                      <td>
                        <div className="employee-name-cell">
                          <div className="employee-avatar">
                            {employee.name?.charAt(0).toUpperCase()}
                          </div>

                          <strong>{employee.name}</strong>
                        </div>
                      </td>

                      <td>{employee.email}</td>
                      <td>{employee.department || "-"}</td>
                      <td>{employee.position || "-"}</td>
                      <td>
                        {employee.salary
                          ? `₹${Number(employee.salary).toLocaleString("en-IN")}`
                          : "-"}
                      </td>

                      <td>
                        <div className="employee-actions">

                          <button
                            className="employee-edit-button"
                            onClick={() => editEmployee(employee)}
                          >
                            Edit
                          </button>

                          <button
                            className="employee-delete-button"
                            onClick={() => deleteEmployee(employee.id)}
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}