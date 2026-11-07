// ===============================
// EMPLOYEE DASHBOARD
// ===============================

// Get logged-in user
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Check login
if (!currentUser) {
    window.location.href = "../index.html";
}

// Check employee role
if (currentUser && currentUser.role !== "employee") {
    window.location.href = "../admin/admin-dashboard.html";
}


// ===============================
// DISPLAY EMPLOYEE INFORMATION
// ===============================

const employeeName = document.getElementById("employeeName");
const headerName = document.getElementById("headerName");
const accountName = document.getElementById("accountName");
const accountEmail = document.getElementById("accountEmail");
const accountRole = document.getElementById("accountRole");
const profileAvatar = document.getElementById("profileAvatar");
const welcomeMessage = document.getElementById("welcomeMessage");


if (currentUser) {

    employeeName.textContent = currentUser.name;
    headerName.textContent = currentUser.name;

    accountName.textContent = currentUser.name;
    accountEmail.textContent = currentUser.email;

    accountRole.textContent = currentUser.jobRole || "Employee";

    const firstLetter = currentUser.name
        ? currentUser.name.charAt(0).toUpperCase()
        : "E";

    profileAvatar.textContent = firstLetter;

    welcomeMessage.textContent =
        "Welcome to your dashboard, " + currentUser.name + "!";
}


// ===============================
// ATTENDANCE COUNT
// ===============================

function loadAttendanceCount() {

    const attendance =
        JSON.parse(localStorage.getItem("attendance")) || [];

    if (!currentUser) return;

    const employeeAttendance = attendance.filter(function(record) {

        return record.employeeEmail === currentUser.email;

    });

    document.getElementById("attendanceCount").textContent =
        employeeAttendance.length;
}


// ===============================
// LEAVE COUNT
// ===============================

function loadLeaveCount() {

    const leaveRequests =
        JSON.parse(localStorage.getItem("leaveRequests")) || [];

    if (!currentUser) return;

    const employeeLeaves = leaveRequests.filter(function(request) {

        return request.employeeEmail === currentUser.email;

    });

    document.getElementById("leaveCount").textContent =
        employeeLeaves.length;
}


// ===============================
// LATEST SALARY
// ===============================

function loadLatestSalary() {

    const salaryRecords =
        JSON.parse(localStorage.getItem("salaryRecords")) || [];

    if (!currentUser) return;

    const employeeSalary = salaryRecords.filter(function(record) {

        return record.employeeEmail === currentUser.email;

    });

    if (employeeSalary.length === 0) {

        document.getElementById("salaryAmount").textContent = "₹0";

        return;
    }

    // Sort by generated date
    employeeSalary.sort(function(a, b) {

        return new Date(b.generatedOn) - new Date(a.generatedOn);

    });

    const latestSalary = employeeSalary[0];

    document.getElementById("salaryAmount").textContent =
        "₹" + Number(latestSalary.netSalary).toLocaleString("en-IN");
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "../index.html";
}


// ===============================
// INITIAL LOAD
// ===============================

loadAttendanceCount();
loadLeaveCount();
loadLatestSalary();