// =========================================
// EMPLOYEE ATTENDANCE
// =========================================

// Get currently logged-in user
const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));


// =========================================
// LOGIN CHECK
// =========================================

if (!currentUser) {

    window.location.href = "../index.html";

}


// =========================================
// ROLE CHECK
// =========================================

if (
    currentUser &&
    currentUser.role !== "employee"
) {

    window.location.href =
        "../admin/admin-dashboard.html";

}


// =========================================
// GET ELEMENTS
// =========================================

const headerName =
    document.getElementById("headerName");

const profileAvatar =
    document.getElementById("profileAvatar");

const attendanceTableBody =
    document.getElementById("attendanceTableBody");

const emptyMessage =
    document.getElementById("emptyMessage");

const dateFilter =
    document.getElementById("dateFilter");

const totalRecords =
    document.getElementById("totalRecords");

const presentDays =
    document.getElementById("presentDays");

const absentDays =
    document.getElementById("absentDays");

const leaveDays =
    document.getElementById("leaveDays");

const attendancePercentage =
    document.getElementById("attendancePercentage");

const progressBar =
    document.getElementById("progressBar");


// =========================================
// DISPLAY EMPLOYEE INFORMATION
// =========================================

function loadEmployeeInfo() {

    if (!currentUser) {
        return;
    }

    const name =
        currentUser.name || "Employee";

    if (headerName) {
        headerName.textContent = name;
    }

    const firstLetter =
        name.charAt(0).toUpperCase();

    if (profileAvatar) {
        profileAvatar.textContent = firstLetter;
    }

}


// =========================================
// GET EMPLOYEE ATTENDANCE
// =========================================

function getEmployeeAttendance() {

    const attendance =
        JSON.parse(
            localStorage.getItem("attendance")
        ) || [];

    if (!currentUser) {
        return [];
    }

    return attendance.filter(function(record) {

        // Admin module stores email
        // User module may use employeeEmail
        const recordEmail =
            record.employeeEmail || record.email;

        return (
            recordEmail &&
            recordEmail.toLowerCase() ===
            currentUser.email.toLowerCase()
        );

    });

}


// =========================================
// FORMAT DATE
// =========================================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date =
        new Date(dateString + "T00:00:00");

    if (isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// =========================================
// STATUS CLASS
// =========================================

function getStatusClass(status) {

    const value =
        String(status || "").toLowerCase();

    if (value === "present") {
        return "status-present";
    }

    if (value === "absent") {
        return "status-absent";
    }

    if (value === "leave") {
        return "status-leave";
    }

    return "";

}


// =========================================
// DISPLAY ATTENDANCE
// =========================================

function displayAttendance(records) {

    attendanceTableBody.innerHTML = "";

    if (records.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }

    emptyMessage.style.display = "none";


    // Newest date first
    records.sort(function(a, b) {

        return new Date(b.date) -
               new Date(a.date);

    });


    records.forEach(function(record) {

        const row =
            document.createElement("tr");


        const status =
            record.status || "Unknown";


        // Support both Admin and User field names
        const employeeName =
            record.employeeName ||
            record.name ||
            currentUser.name;


        const employeeEmail =
            record.employeeEmail ||
            record.email ||
            currentUser.email;


        row.innerHTML = `

            <td>
                ${formatDate(record.date)}
            </td>

            <td>
                ${employeeName}
            </td>

            <td>
                ${employeeEmail}
            </td>

            <td>
                <span class="status-badge ${getStatusClass(status)}">
                    ${status}
                </span>
            </td>

        `;


        attendanceTableBody.appendChild(row);

    });

}


// =========================================
// UPDATE STATISTICS
// =========================================

function updateStatistics(records) {

    const total =
        records.length;


    const present =
        records.filter(function(record) {

            return String(record.status)
                .toLowerCase() === "present";

        }).length;


    const absent =
        records.filter(function(record) {

            return String(record.status)
                .toLowerCase() === "absent";

        }).length;


    const leave =
        records.filter(function(record) {

            return String(record.status)
                .toLowerCase() === "leave";

        }).length;


    if (totalRecords) {
        totalRecords.textContent = total;
    }

    if (presentDays) {
        presentDays.textContent = present;
    }

    if (absentDays) {
        absentDays.textContent = absent;
    }

    if (leaveDays) {
        leaveDays.textContent = leave;
    }


    // Attendance percentage
    let percentage = 0;


    if (total > 0) {

        percentage =
            (present / total) * 100;

    }


    percentage =
        Math.round(percentage);


    if (attendancePercentage) {
        attendancePercentage.textContent =
            percentage + "%";
    }


    if (progressBar) {
        progressBar.style.width =
            percentage + "%";
    }

}


// =========================================
// LOAD ATTENDANCE
// =========================================

function loadAttendance() {

    const records =
        getEmployeeAttendance();


    updateStatistics(records);

    displayAttendance(records);

}


// =========================================
// DATE FILTER
// =========================================

if (dateFilter) {

    dateFilter.addEventListener(
        "change",
        function() {

            const selectedDate =
                dateFilter.value;


            if (!selectedDate) {

                loadAttendance();

                return;

            }


            const records =
                getEmployeeAttendance();


            const filteredRecords =
                records.filter(function(record) {

                    return record.date ===
                           selectedDate;

                });


            // Update stats according to filtered date
            updateStatistics(filteredRecords);

            displayAttendance(filteredRecords);

        }
    );

}


// =========================================
// CLEAR DATE FILTER
// =========================================

function clearDateFilter() {

    if (dateFilter) {
        dateFilter.value = "";
    }

    loadAttendance();

}


// =========================================
// LOGOUT
// =========================================

function logout() {

    localStorage.removeItem(
        "currentUser"
    );


    window.location.href =
        "../index.html";

}


// =========================================
// INITIAL LOAD
// =========================================

loadEmployeeInfo();

loadAttendance();