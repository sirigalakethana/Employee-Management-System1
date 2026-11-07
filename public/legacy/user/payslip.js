// ================= USER ACCESS =================

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "../index.html";
}

if (currentUser && currentUser.role !== "employee") {
    window.location.href = "../admin/admin-dashboard.html";
}


// ================= USER DETAILS =================

document.getElementById("userName").textContent =
    currentUser.name || "Employee";

const firstLetter = (currentUser.name || "Employee")
    .charAt(0)
    .toUpperCase();

document.getElementById("userAvatar").textContent = firstLetter;


// ================= GET SALARY RECORDS =================

function getSalaryRecords() {

    return JSON.parse(
        localStorage.getItem("salaryRecords")
    ) || [];
}


// ================= GET EMPLOYEE PAYSLIPS =================

function getMyPayslips() {

    const records = getSalaryRecords();

    return records
        .filter(function(record) {
            return record.employeeEmail === currentUser.email;
        })
        .sort(function(a, b) {

            return new Date(b.salaryMonth) -
                   new Date(a.salaryMonth);

        });
}


// ================= FORMAT MONEY =================

function formatMoney(value) {

    return "₹" + Number(value || 0).toLocaleString("en-IN");
}


// ================= FORMAT MONTH =================

function formatMonth(month) {

    if (!month) {
        return "-";
    }

    const date = new Date(month + "-01");

    return date.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
    });
}


// ================= FORMAT DATE =================

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


// ================= DISPLAY PAYSLIPS =================

function displayPayslips() {

    const payslips = getMyPayslips();

    const tableBody =
        document.getElementById("payslipTableBody");

    const emptyMessage =
        document.getElementById("emptyMessage");

    tableBody.innerHTML = "";

    // No records
    if (payslips.length === 0) {

        emptyMessage.style.display = "block";

        document.getElementById("latestSalary").textContent =
            "₹0";

        document.getElementById("payslipCount").textContent =
            "0";

        document.getElementById("latestMonth").textContent =
            "-";

        return;
    }

    emptyMessage.style.display = "none";


    // Summary
    document.getElementById("payslipCount").textContent =
        payslips.length;

    document.getElementById("latestSalary").textContent =
        formatMoney(payslips[0].netSalary);

    document.getElementById("latestMonth").textContent =
        formatMonth(payslips[0].salaryMonth);


    // Table rows
    payslips.forEach(function(record) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${formatMonth(record.salaryMonth)}</td>

            <td class="salary-value">
                ${formatMoney(record.basicSalary)}
            </td>

            <td>
                ${formatMoney(record.allowances)}
            </td>

            <td>
                ${formatMoney(record.deductions)}
            </td>

            <td class="salary-value">
                ${formatMoney(record.netSalary)}
            </td>

            <td>
                <button
                    class="view-btn"
                    onclick="viewPayslip(${record.id})"
                >
                    View Payslip
                </button>
            </td>
        `;

        tableBody.appendChild(row);

    });
}


// ================= VIEW PAYSLIP =================

function viewPayslip(id) {

    const payslips = getMyPayslips();

    const record = payslips.find(function(item) {
        return item.id === id;
    });

    if (!record) {
        alert("Payslip not found.");
        return;
    }


    document.getElementById("modalSalaryMonth").textContent =
        formatMonth(record.salaryMonth);

    document.getElementById("modalEmployeeName").textContent =
        record.employeeName;

    document.getElementById("modalEmployeeEmail").textContent =
        record.employeeEmail;

    document.getElementById("modalMonth").textContent =
        formatMonth(record.salaryMonth);

    document.getElementById("modalGeneratedOn").textContent =
        formatDate(record.generatedOn);

    document.getElementById("modalBasic").textContent =
        formatMoney(record.basicSalary);

    document.getElementById("modalAllowances").textContent =
        formatMoney(record.allowances);

    document.getElementById("modalDeductions").textContent =
        formatMoney(record.deductions);

    document.getElementById("modalNetSalary").textContent =
        formatMoney(record.netSalary);


    document.getElementById("payslipModal")
        .classList.add("show");
}


// ================= CLOSE PAYSLIP =================

function closePayslip() {

    document.getElementById("payslipModal")
        .classList.remove("show");
}


// ================= PRINT PAYSLIP =================

function printPayslip() {

    const payslipContent =
        document.querySelector(".payslip-content").innerHTML;

    const printWindow = window.open(
        "",
        "_blank",
        "width=800,height=700"
    );

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>

            <title>Employee Payslip</title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #222;
                }

                .company-section {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #2563eb;
                }

                .company-logo {
                    width: 48px;
                    height: 48px;
                    background: #2563eb;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                    font-weight: bold;
                }

                .employee-details {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    padding: 25px 0;
                }

                .employee-details div {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .employee-details span {
                    color: #666;
                    font-size: 12px;
                }

                .salary-breakdown {
                    border: 1px solid #ddd;
                }

                .salary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 15px;
                    border-bottom: 1px solid #ddd;
                }

                .salary-row.total {
                    background: #eff6ff;
                    font-weight: bold;
                }

                .payslip-footer {
                    text-align: center;
                    margin-top: 25px;
                    color: #777;
                    font-size: 12px;
                }

            </style>

        </head>

        <body>

            ${payslipContent}

            <script>
                window.onload = function() {
                    window.print();
                };
            <\/script>

        </body>

        </html>
    `);

    printWindow.document.close();
}


// ================= CLOSE MODAL ON OUTSIDE CLICK =================

document.getElementById("payslipModal")
    .addEventListener("click", function(event) {

        if (event.target === this) {
            closePayslip();
        }

    });


// ================= LOGOUT =================

function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "../index.html";
}


// ================= INITIAL LOAD =================

displayPayslips();