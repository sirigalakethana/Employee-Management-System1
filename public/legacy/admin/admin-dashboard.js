// ================= ADMIN DASHBOARD =================

// Check whether admin is logged in
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "../index.html";
}

if (currentUser && currentUser.role !== "admin") {
    window.location.href = "../user/user-dashboard.html";
}


// ================= DISPLAY ADMIN NAME =================

const adminName =
    currentUser && currentUser.name
        ? currentUser.name
        : "Admin";

const sidebarAdminName =
    document.getElementById("sidebarAdminName");

const headerAdminName =
    document.getElementById("headerAdminName");

const welcomeAdminName =
    document.getElementById("welcomeAdminName");

if (sidebarAdminName) {
    sidebarAdminName.textContent = adminName;
}

if (headerAdminName) {
    headerAdminName.textContent = adminName;
}

if (welcomeAdminName) {
    welcomeAdminName.textContent = adminName;
}


// ================= CURRENT DATE =================

const currentDateElement =
    document.getElementById("currentDate");

if (currentDateElement) {

    const today = new Date();

    currentDateElement.textContent =
        today.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
}


// ================= GET EMPLOYEES =================

function getEmployees() {

    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    return users.filter(function(user) {

        return user.role === "employee";

    });
}


// ================= EMPLOYEE COUNT =================

function updateEmployeeCount() {

    const employees = getEmployees();

    const employeeCount =
        document.getElementById("employeeCount");

    if (employeeCount) {
        employeeCount.textContent =
            employees.length;
    }
}


// ================= ATTENDANCE COUNT =================

function updateAttendanceCount() {

    const attendance =
        JSON.parse(localStorage.getItem("attendance")) || [];

    const today =
        new Date().toISOString().split("T")[0];

    const presentToday =
        attendance.filter(function(record) {

            return (
                record.date === today &&
                record.status === "Present"
            );

        });

    const attendanceCount =
        document.getElementById("attendanceCount");

    if (attendanceCount) {

        attendanceCount.textContent =
            presentToday.length;
    }
}


// ================= LEAVE COUNT =================

function updateLeaveCount() {

    const leaveRequests =
        JSON.parse(
            localStorage.getItem("leaveRequests")
        ) || [];

    const pendingRequests =
        leaveRequests.filter(function(request) {

            return request.status === "Pending";

        });

    const leaveCount =
        document.getElementById("leaveCount");

    if (leaveCount) {

        leaveCount.textContent =
            pendingRequests.length;
    }
}


// ================= SALARY COUNT =================

function updateSalaryCount() {

    const salaryRecords =
        JSON.parse(
            localStorage.getItem("salaryRecords")
        ) || [];

    let totalPayroll = 0;

    salaryRecords.forEach(function(record) {

        totalPayroll +=
            Number(record.netSalary) || 0;

    });

    const salaryCount =
        document.getElementById("salaryCount");

    if (salaryCount) {

        salaryCount.textContent =
            "₹" +
            totalPayroll.toLocaleString("en-IN");
    }
}


// ================= RECENT EMPLOYEES =================

function displayRecentEmployees() {

    const employeeList =
        document.getElementById("employeeList");

    if (!employeeList) {
        return;
    }

    const employees =
        getEmployees();

    employeeList.innerHTML = "";


    if (employees.length === 0) {

        employeeList.innerHTML = `
            <div style="
                padding: 30px;
                text-align: center;
                color: #777;
            ">
                No employees registered yet.
            </div>
        `;

        return;
    }


    // Show latest 5 employees
    const recentEmployees =
        employees.slice(-5).reverse();


    recentEmployees.forEach(function(employee) {

        const employeeItem =
            document.createElement("div");

        employeeItem.className =
            "employee-item";


        const firstLetter =
            employee.name
                ? employee.name.charAt(0).toUpperCase()
                : "E";


        employeeItem.innerHTML = `

            <div class="employee-avatar">
                ${firstLetter}
            </div>

            <div class="employee-info">

                <strong>
                    ${employee.name}
                </strong>

                <span>
                    ${employee.email}
                </span>

            </div>

            <div class="employee-status">
                Active
            </div>

        `;


        employeeList.appendChild(employeeItem);

    });
}


// ================= LOGOUT =================

function logout() {

    localStorage.removeItem("currentUser");

    window.location.href =
        "../index.html";
}


// ================= INITIAL LOAD =================

updateEmployeeCount();

updateAttendanceCount();

updateLeaveCount();

updateSalaryCount();

displayRecentEmployees();