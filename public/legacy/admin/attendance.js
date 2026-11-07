/* ================= ADMIN ACCESS CHECK ================= */

const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "../index.html";
}


/* ================= ADMIN NAME ================= */

if (currentUser) {

    const sidebarAdminName =
        document.getElementById("sidebarAdminName");

    const headerAdminName =
        document.getElementById("headerAdminName");

    if (sidebarAdminName) {
        sidebarAdminName.textContent =
            currentUser.name || "Admin";
    }

    if (headerAdminName) {
        headerAdminName.textContent =
            currentUser.name || "Admin";
    }
}


/* ================= GET EMPLOYEES ================= */

function getEmployees() {

    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    return users.filter(function(user) {
        return user.role === "employee";
    });
}


/* ================= GET ATTENDANCE ================= */

function getAttendance() {

    return JSON.parse(
        localStorage.getItem("attendance")
    ) || [];
}


/* ================= SAVE ATTENDANCE ================= */

function saveAttendance(records) {

    localStorage.setItem(
        "attendance",
        JSON.stringify(records)
    );
}


/* ================= TODAY DATE ================= */

function getToday() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* ================= LOAD EMPLOYEES INTO SELECT ================= */

function loadEmployeeOptions() {

    const select =
        document.getElementById("employeeSelect");

    if (!select) {
        return;
    }

    const employees = getEmployees();

    select.innerHTML =
        '<option value="">Select Employee</option>';

    employees.forEach(function(employee) {

        const option =
            document.createElement("option");

        option.value = employee.email;

        option.textContent =
            employee.name + " - " + employee.email;

        select.appendChild(option);

    });
}


/* ================= OPEN FORM ================= */

function openAttendanceForm() {

    const modal =
        document.getElementById("attendanceModal");

    const form =
        document.getElementById("attendanceForm");

    const message =
        document.getElementById("attendanceMessage");

    form.reset();

    document.getElementById("formDate").value =
        getToday();

    document.getElementById("modalTitle").textContent =
        "Mark Attendance";

    message.textContent = "";

    loadEmployeeOptions();

    modal.classList.add("show");
}


/* ================= CLOSE FORM ================= */

function closeAttendanceForm() {

    document
        .getElementById("attendanceModal")
        .classList.remove("show");
}


/* ================= FORM SUBMIT ================= */

document
    .getElementById("attendanceForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const employeeEmail =
            document.getElementById("employeeSelect").value;

        const date =
            document.getElementById("formDate").value;

        const status =
            document.getElementById("attendanceStatus").value;

        const message =
            document.getElementById("attendanceMessage");

        if (!employeeEmail || !date || !status) {

            message.textContent =
                "Please fill all fields.";

            message.style.color = "#c63c3c";

            return;
        }


        const employees =
            getEmployees();

        const employee =
            employees.find(function(user) {

                return user.email === employeeEmail;

            });


        if (!employee) {

            message.textContent =
                "Employee not found.";

            message.style.color = "#c63c3c";

            return;
        }


        let records =
            getAttendance();


        /* CHECK DUPLICATE */

        const existingRecord =
            records.find(function(record) {

                return (
                    record.email === employeeEmail &&
                    record.date === date
                );

            });


        if (existingRecord) {

            existingRecord.name =
                employee.name;

            existingRecord.status =
                status;

            message.textContent =
                "Attendance updated successfully.";

        } else {

            records.push({

                id: Date.now(),

                name: employee.name,

                email: employee.email,

                date: date,

                status: status

            });

            message.textContent =
                "Attendance marked successfully.";

        }


        saveAttendance(records);

        message.style.color = "#16845c";

        displayAttendance();

        updateStatistics();


        setTimeout(function() {

            closeAttendanceForm();

        }, 700);

    });


/* ================= DISPLAY ATTENDANCE ================= */

function displayAttendance() {

    const tableBody =
        document.getElementById(
            "attendanceTableBody"
        );

    const searchInput =
        document.getElementById(
            "searchAttendance"
        );

    const selectedDate =
        document.getElementById(
            "attendanceDate"
        ).value;

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    let records =
        getAttendance();


    /* FILTER BY DATE */

    if (selectedDate) {

        records =
            records.filter(function(record) {

                return record.date === selectedDate;

            });

    }


    /* FILTER BY SEARCH */

    if (searchText) {

        records =
            records.filter(function(record) {

                return (
                    record.name
                        .toLowerCase()
                        .includes(searchText) ||

                    record.email
                        .toLowerCase()
                        .includes(searchText)
                );

            });

    }


    tableBody.innerHTML = "";


    if (records.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="5">

                    <div class="empty-state">

                        No attendance records found.

                    </div>

                </td>

            </tr>

        `;

        return;
    }


    records.sort(function(a, b) {

        return b.date.localeCompare(a.date);

    });


    records.forEach(function(record) {

        const row =
            document.createElement("tr");


        let statusClass =
            "status-present";


        if (record.status === "Absent") {

            statusClass =
                "status-absent";

        }

        if (record.status === "Leave") {

            statusClass =
                "status-leave";

        }


        row.innerHTML = `

            <td>

                <div class="employee-cell">

                    <div class="employee-avatar">

                        ${record.name
                            .charAt(0)
                            .toUpperCase()}

                    </div>

                    <div class="employee-info">

                        <strong>
                            ${record.name}
                        </strong>

                        <span>
                            Employee
                        </span>

                    </div>

                </div>

            </td>


            <td>
                ${record.email}
            </td>


            <td>
                ${formatDate(record.date)}
            </td>


            <td>

                <span class="status-badge ${statusClass}">

                    ${record.status}

                </span>

            </td>


            <td>

                <div class="action-buttons">

                    <button
                        class="edit-button"
                        onclick="editAttendance(${record.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteAttendance(${record.id})"
                    >
                        Delete
                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


/* ================= FORMAT DATE ================= */

function formatDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* ================= EDIT ATTENDANCE ================= */

function editAttendance(id) {

    const records =
        getAttendance();

    const record =
        records.find(function(item) {

            return item.id === id;

        });


    if (!record) {
        return;
    }


    loadEmployeeOptions();


    document.getElementById(
        "employeeSelect"
    ).value = record.email;


    document.getElementById(
        "formDate"
    ).value = record.date;


    document.getElementById(
        "attendanceStatus"
    ).value = record.status;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Attendance";


    document
        .getElementById("attendanceModal")
        .classList.add("show");


    const form =
        document.getElementById("attendanceForm");


    form.onsubmit = function(event) {

        event.preventDefault();


        const newStatus =
            document.getElementById(
                "attendanceStatus"
            ).value;


        const newDate =
            document.getElementById(
                "formDate"
            ).value;


        record.status =
            newStatus;

        record.date =
            newDate;


        saveAttendance(records);

        displayAttendance();

        updateStatistics();

        closeAttendanceForm();


        form.onsubmit = null;

    };

}


/* ================= DELETE ATTENDANCE ================= */

function deleteAttendance(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this attendance record?"
        );


    if (!confirmDelete) {
        return;
    }


    let records =
        getAttendance();


    records =
        records.filter(function(record) {

            return record.id !== id;

        });


    saveAttendance(records);

    displayAttendance();

    updateStatistics();

}


/* ================= UPDATE STATISTICS ================= */

function updateStatistics() {

    const employees =
        getEmployees();

    const records =
        getAttendance();


    const today =
        getToday();


    const todayRecords =
        records.filter(function(record) {

            return record.date === today;

        });


    const present =
        todayRecords.filter(function(record) {

            return record.status === "Present";

        }).length;


    const absent =
        todayRecords.filter(function(record) {

            return record.status === "Absent";

        }).length;


    const leave =
        todayRecords.filter(function(record) {

            return record.status === "Leave";

        }).length;


    document.getElementById(
        "totalEmployees"
    ).textContent =
        employees.length;


    document.getElementById(
        "presentCount"
    ).textContent =
        present;


    document.getElementById(
        "absentCount"
    ).textContent =
        absent;


    document.getElementById(
        "leaveCount"
    ).textContent =
        leave;

}


/* ================= DATE FILTER ================= */

document
    .getElementById("attendanceDate")
    .addEventListener("change", function() {

        displayAttendance();

    });


/* ================= LOGOUT ================= */

function logout() {

    localStorage.removeItem("currentUser");

    window.location.href =
        "../index.html";

}


/* ================= COMING SOON ================= */

function showComingSoon(moduleName) {

    alert(
        moduleName +
        " module will be implemented in the next step."
    );

}


/* ================= INITIALIZATION ================= */

document.getElementById(
    "attendanceDate"
).value = getToday();


displayAttendance();

updateStatistics();

loadEmployeeOptions();