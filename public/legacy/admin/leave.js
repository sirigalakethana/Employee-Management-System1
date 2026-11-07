// ===============================
// ADMIN ACCESS CHECK
// ===============================

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "../index.html";
}


// ===============================
// DISPLAY ADMIN NAME
// ===============================

const adminNameElement = document.getElementById("adminName");

if (adminNameElement && currentUser) {
    adminNameElement.textContent = currentUser.name;
}


// ===============================
// GET LEAVE REQUESTS
// ===============================

function getLeaveRequests() {
    return JSON.parse(localStorage.getItem("leaveRequests")) || [];
}


// ===============================
// SAVE LEAVE REQUESTS
// ===============================

function saveLeaveRequests(requests) {
    localStorage.setItem("leaveRequests", JSON.stringify(requests));
}


// ===============================
// DISPLAY LEAVE REQUESTS
// ===============================

function displayLeaveRequests() {

    const tableBody = document.getElementById("leaveTableBody");
    const emptyMessage = document.getElementById("emptyMessage");

    const searchText =
        document.getElementById("searchInput").value
        .toLowerCase()
        .trim();

    const selectedStatus =
        document.getElementById("statusFilter").value;

    let requests = getLeaveRequests();

    // Search filter
    if (searchText) {
        requests = requests.filter(function(request) {

            return (
                request.employeeName.toLowerCase().includes(searchText) ||
                request.employeeEmail.toLowerCase().includes(searchText) ||
                request.leaveType.toLowerCase().includes(searchText)
            );

        });
    }

    // Status filter
    if (selectedStatus !== "All") {
        requests = requests.filter(function(request) {
            return request.status === selectedStatus;
        });
    }

    tableBody.innerHTML = "";

    if (requests.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    requests.forEach(function(request) {

        const row = document.createElement("tr");

        let actionButtons = "";

        if (request.status === "Pending") {

            actionButtons = `
                <div class="action-buttons">

                    <button
                        class="action-btn approve-btn"
                        onclick="approveLeave(${request.id})">
                        Approve
                    </button>

                    <button
                        class="action-btn reject-btn"
                        onclick="rejectLeave(${request.id})">
                        Reject
                    </button>

                </div>
            `;

        } else {

            actionButtons = `
                <button
                    class="action-btn view-btn"
                    onclick="viewLeave(${request.id})">
                    View
                </button>
            `;
        }

        row.innerHTML = `

            <td>
                <div class="employee-name">
                    ${request.employeeName}
                </div>

                <div class="employee-email">
                    ${request.employeeEmail}
                </div>
            </td>

            <td>${request.leaveType}</td>

            <td>${formatDate(request.fromDate)}</td>

            <td>${formatDate(request.toDate)}</td>

            <td>${request.reason}</td>

            <td>${formatDate(request.appliedOn)}</td>

            <td>
                <span class="status ${request.status.toLowerCase()}">
                    ${request.status}
                </span>
            </td>

            <td>
                ${actionButtons}
            </td>
        `;

        tableBody.appendChild(row);
    });

    updateStatistics();
}


// ===============================
// APPROVE LEAVE
// ===============================

function approveLeave(id) {

    const requests = getLeaveRequests();

    const request = requests.find(function(item) {
        return item.id === id;
    });

    if (!request) {
        return;
    }

    const confirmApproval =
        confirm(
            "Approve leave request from " +
            request.employeeName +
            "?"
        );

    if (!confirmApproval) {
        return;
    }

    request.status = "Approved";

    saveLeaveRequests(requests);

    displayLeaveRequests();
}


// ===============================
// REJECT LEAVE
// ===============================

function rejectLeave(id) {

    const requests = getLeaveRequests();

    const request = requests.find(function(item) {
        return item.id === id;
    });

    if (!request) {
        return;
    }

    const confirmRejection =
        confirm(
            "Reject leave request from " +
            request.employeeName +
            "?"
        );

    if (!confirmRejection) {
        return;
    }

    request.status = "Rejected";

    saveLeaveRequests(requests);

    displayLeaveRequests();
}


// ===============================
// VIEW LEAVE
// ===============================

function viewLeave(id) {

    const requests = getLeaveRequests();

    const request = requests.find(function(item) {
        return item.id === id;
    });

    if (!request) {
        return;
    }

    alert(
        "Employee: " + request.employeeName +
        "\nEmail: " + request.employeeEmail +
        "\nLeave Type: " + request.leaveType +
        "\nFrom: " + request.fromDate +
        "\nTo: " + request.toDate +
        "\nReason: " + request.reason +
        "\nStatus: " + request.status
    );
}


// ===============================
// UPDATE STATISTICS
// ===============================

function updateStatistics() {

    const requests = getLeaveRequests();

    const total = requests.length;

    const pending = requests.filter(function(request) {
        return request.status === "Pending";
    }).length;

    const approved = requests.filter(function(request) {
        return request.status === "Approved";
    }).length;

    const rejected = requests.filter(function(request) {
        return request.status === "Rejected";
    }).length;

    document.getElementById("totalRequests").textContent = total;
    document.getElementById("pendingRequests").textContent = pending;
    document.getElementById("approvedRequests").textContent = approved;
    document.getElementById("rejectedRequests").textContent = rejected;
}


// ===============================
// FORMAT DATE
// ===============================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "../index.html";
}


// ===============================
// COMING SOON
// ===============================

function showComingSoon(feature) {

    alert(feature + " module will be available soon.");
}


// ===============================
// INITIAL LOAD
// ===============================

displayLeaveRequests();
updateStatistics();