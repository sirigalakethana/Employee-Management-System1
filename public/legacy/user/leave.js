// ================= USER ACCESS =================

const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

if (!currentUser) {
    window.location.href = "../index.html";
}

if (currentUser && currentUser.role !== "employee") {
    window.location.href = "../admin/admin-dashboard.html";
}


// ================= USER DETAILS =================

document.getElementById("userName").textContent =
    currentUser.name || "Employee";

document.getElementById("userAvatar").textContent =
    (currentUser.name || "Employee")
        .charAt(0)
        .toUpperCase();


// ================= STORAGE =================

function getLeaveRequests() {

    return JSON.parse(
        localStorage.getItem("leaveRequests")
    ) || [];
}


// ================= GET MY REQUESTS =================

function getMyRequests() {

    return getLeaveRequests()
        .filter(function(request) {

            return request.employeeEmail ===
                currentUser.email;

        })
        .sort(function(a, b) {

            return b.id - a.id;

        });
}


// ================= DATE FORMAT =================

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// ================= DISPLAY REQUESTS =================

function displayRequests() {

    const requests = getMyRequests();

    const tableBody =
        document.getElementById("leaveTableBody");

    const emptyMessage =
        document.getElementById("emptyMessage");

    tableBody.innerHTML = "";


    // Statistics

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


    document.getElementById("totalRequests").textContent =
        total;

    document.getElementById("pendingRequests").textContent =
        pending;

    document.getElementById("approvedRequests").textContent =
        approved;

    document.getElementById("rejectedRequests").textContent =
        rejected;


    // Empty state

    if (requests.length === 0) {

        emptyMessage.style.display = "block";

        return;
    }

    emptyMessage.style.display = "none";


    // Table

    requests.forEach(function(request) {

        const row = document.createElement("tr");

        let statusClass = "status-pending";

        if (request.status === "Approved") {
            statusClass = "status-approved";
        }

        if (request.status === "Rejected") {
            statusClass = "status-rejected";
        }


        row.innerHTML = `

            <td>
                ${request.leaveType}
            </td>

            <td>
                ${formatDate(request.fromDate)}
            </td>

            <td>
                ${formatDate(request.toDate)}
            </td>

            <td>
                ${request.reason}
            </td>

            <td>
                ${formatDate(request.appliedOn)}
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${request.status}
                </span>
            </td>

        `;

        tableBody.appendChild(row);

    });
}


// ================= OPEN FORM =================

function openLeaveForm() {

    document.getElementById("leaveModal")
        .classList.add("show");

    document.getElementById("formMessage")
        .textContent = "";

}


// ================= CLOSE FORM =================

function closeLeaveForm() {

    document.getElementById("leaveModal")
        .classList.remove("show");

    document.getElementById("leaveForm")
        .reset();

    document.getElementById("formMessage")
        .textContent = "";

}


// ================= SUBMIT LEAVE =================

document.getElementById("leaveForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const leaveType =
            document.getElementById("leaveType").value;

        const fromDate =
            document.getElementById("fromDate").value;

        const toDate =
            document.getElementById("toDate").value;

        const reason =
            document.getElementById("leaveReason").value.trim();

        const message =
            document.getElementById("formMessage");


        // Date validation

        if (toDate < fromDate) {

            message.textContent =
                "To Date cannot be before From Date.";

            message.style.color = "#dc2626";

            return;
        }


        // Create request

        const newRequest = {

            id: Date.now(),

            employeeName:
                currentUser.name,

            employeeEmail:
                currentUser.email,

            leaveType:
                leaveType,

            fromDate:
                fromDate,

            toDate:
                toDate,

            reason:
                reason,

            status:
                "Pending",

            appliedOn:
                new Date().toISOString().split("T")[0]

        };


        // Get existing requests

        const requests = getLeaveRequests();


        // Save

        requests.push(newRequest);

        localStorage.setItem(
            "leaveRequests",
            JSON.stringify(requests)
        );


        message.textContent =
            "Leave request submitted successfully.";

        message.style.color =
            "#16a34a";


        // Refresh

        displayRequests();


        setTimeout(function() {

            closeLeaveForm();

        }, 1000);

    });


// ================= OUTSIDE CLICK =================

document.getElementById("leaveModal")
    .addEventListener("click", function(event) {

        if (event.target === this) {
            closeLeaveForm();
        }

    });


// ================= LOGOUT =================

function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "../index.html";
}


// ================= INITIAL LOAD =================

displayRequests();