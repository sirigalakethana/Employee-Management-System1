// ==========================================
// ADMIN ACCESS CHECK
// ==========================================

const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "../index.html";
}


// ==========================================
// DISPLAY ADMIN NAME
// ==========================================

const adminNameElement =
    document.getElementById("adminName");

if (adminNameElement && currentUser) {
    adminNameElement.textContent =
        currentUser.name;
}


// ==========================================
// GET EMPLOYEES
// ==========================================

function getEmployees() {

    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    return users.filter(function(user) {
        return user.role === "employee";
    });
}


// ==========================================
// GET SALARY RECORDS
// ==========================================

function getSalaryRecords() {

    return JSON.parse(
        localStorage.getItem("salaryRecords")
    ) || [];
}


// ==========================================
// SAVE SALARY RECORDS
// ==========================================

function saveSalaryRecords(records) {

    localStorage.setItem(
        "salaryRecords",
        JSON.stringify(records)
    );
}


// ==========================================
// LOAD EMPLOYEE OPTIONS
// ==========================================

function loadEmployeeOptions() {

    const employeeSelect =
        document.getElementById("employeeEmail");

    const employees = getEmployees();

    employeeSelect.innerHTML = `
        <option value="">
            Select Employee
        </option>
    `;

    employees.forEach(function(employee) {

        const option =
            document.createElement("option");

        option.value = employee.email;

        option.textContent =
            employee.name + " - " + employee.email;

        employeeSelect.appendChild(option);
    });
}


// ==========================================
// DISPLAY SALARY RECORDS
// ==========================================

function displaySalaryRecords() {

    const tableBody =
        document.getElementById("salaryTableBody");

    const emptyMessage =
        document.getElementById("emptyMessage");

    const searchInput =
        document.getElementById("searchInput");

    const searchText =
        searchInput.value.toLowerCase().trim();

    let records = getSalaryRecords();


    // Search by name or email

    if (searchText) {

        records = records.filter(function(record) {

            return (
                record.employeeName
                    .toLowerCase()
                    .includes(searchText) ||

                record.employeeEmail
                    .toLowerCase()
                    .includes(searchText)
            );
        });
    }


    tableBody.innerHTML = "";


    if (records.length === 0) {

        emptyMessage.style.display = "block";

        updateStatistics();

        return;
    }


    emptyMessage.style.display = "none";


    records.forEach(function(record) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="employee-name">
                    ${record.employeeName}
                </div>

            </td>


            <td>

                <div class="employee-email">
                    ${record.employeeEmail}
                </div>

            </td>


            <td>

                <span class="salary-value">
                    ₹${formatNumber(record.basicSalary)}
                </span>

            </td>


            <td>

                ₹${formatNumber(record.allowances)}

            </td>


            <td>

                ₹${formatNumber(record.deductions)}

            </td>


            <td>

                <span class="net-salary">
                    ₹${formatNumber(record.netSalary)}
                </span>

            </td>


            <td>

                <span class="payslip-status">
                    Generated
                </span>

            </td>


            <td>

                <div class="action-buttons">

                    <button
                        class="action-btn view-btn"
                        onclick="viewPayslip(${record.id})"
                    >
                        View
                    </button>


                    <button
                        class="action-btn edit-btn"
                        onclick="editSalary(${record.id})"
                    >
                        Edit
                    </button>


                    <button
                        class="action-btn delete-btn"
                        onclick="deleteSalary(${record.id})"
                    >
                        Delete
                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });


    updateStatistics();
}


// ==========================================
// OPEN ADD SALARY FORM
// ==========================================

function openSalaryForm() {

    const modal =
        document.getElementById("salaryModal");

    const form =
        document.getElementById("salaryForm");

    const modalTitle =
        document.getElementById("modalTitle");


    form.reset();

    document.getElementById("allowances").value = 0;
    document.getElementById("deductions").value = 0;

    document.getElementById(
        "netSalaryPreview"
    ).textContent = "₹0";


    modalTitle.textContent =
        "Add Salary";


    form.dataset.editingId = "";


    loadEmployeeOptions();


    modal.classList.add("show");
}


// ==========================================
// CLOSE SALARY FORM
// ==========================================

function closeSalaryForm() {

    const modal =
        document.getElementById("salaryModal");

    modal.classList.remove("show");
}


// ==========================================
// CALCULATE NET SALARY
// ==========================================

function calculateNetSalary() {

    const basic =
        Number(
            document.getElementById("basicSalary").value
        ) || 0;


    const allowances =
        Number(
            document.getElementById("allowances").value
        ) || 0;


    const deductions =
        Number(
            document.getElementById("deductions").value
        ) || 0;


    const netSalary =
        basic + allowances - deductions;


    document.getElementById(
        "netSalaryPreview"
    ).textContent =
        "₹" + formatNumber(netSalary);
}


// ==========================================
// FORM INPUT EVENTS
// ==========================================

document
    .getElementById("basicSalary")
    .addEventListener(
        "input",
        calculateNetSalary
    );


document
    .getElementById("allowances")
    .addEventListener(
        "input",
        calculateNetSalary
    );


document
    .getElementById("deductions")
    .addEventListener(
        "input",
        calculateNetSalary
    );


// ==========================================
// SAVE SALARY
// ==========================================

document
    .getElementById("salaryForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const employeeEmail =
                document.getElementById(
                    "employeeEmail"
                ).value;


            const basicSalary =
                Number(
                    document.getElementById(
                        "basicSalary"
                    ).value
                );


            const allowances =
                Number(
                    document.getElementById(
                        "allowances"
                    ).value
                ) || 0;


            const deductions =
                Number(
                    document.getElementById(
                        "deductions"
                    ).value
                ) || 0;


            const salaryMonth =
                document.getElementById(
                    "salaryMonth"
                ).value;


            if (!employeeEmail) {

                alert("Please select an employee.");

                return;
            }


            if (!salaryMonth) {

                alert("Please select salary month.");

                return;
            }


            const employees =
                getEmployees();


            const employee =
                employees.find(function(user) {

                    return user.email === employeeEmail;

                });


            if (!employee) {

                alert("Employee not found.");

                return;
            }


            const netSalary =
                basicSalary +
                allowances -
                deductions;


            const records =
                getSalaryRecords();


            const form =
                document.getElementById(
                    "salaryForm"
                );


            const editingId =
                form.dataset.editingId;


            // ======================================
            // EDIT EXISTING RECORD
            // ======================================

            if (editingId) {

                const record =
                    records.find(function(item) {

                        return item.id ==
                            editingId;

                    });


                if (record) {

                    record.employeeName =
                        employee.name;

                    record.employeeEmail =
                        employee.email;

                    record.basicSalary =
                        basicSalary;

                    record.allowances =
                        allowances;

                    record.deductions =
                        deductions;

                    record.netSalary =
                        netSalary;

                    record.salaryMonth =
                        salaryMonth;
                }

            }

            // ======================================
            // ADD NEW RECORD
            // ======================================

            else {

                const existingRecord =
                    records.find(function(record) {

                        return (
                            record.employeeEmail ===
                            employeeEmail &&

                            record.salaryMonth ===
                            salaryMonth
                        );

                    });


                if (existingRecord) {

                    alert(
                        "Salary record for this employee and month already exists."
                    );

                    return;
                }


                const newRecord = {

                    id: Date.now(),

                    employeeName:
                        employee.name,

                    employeeEmail:
                        employee.email,

                    basicSalary:
                        basicSalary,

                    allowances:
                        allowances,

                    deductions:
                        deductions,

                    netSalary:
                        netSalary,

                    salaryMonth:
                        salaryMonth,

                    generatedOn:
                        new Date()
                            .toISOString()
                            .split("T")[0]
                };


                records.push(newRecord);

            }


            saveSalaryRecords(records);


            alert(
                editingId
                    ? "Salary record updated successfully."
                    : "Salary record added successfully."
            );


            closeSalaryForm();

            displaySalaryRecords();

        }
    );


// ==========================================
// EDIT SALARY
// ==========================================

function editSalary(id) {

    const records =
        getSalaryRecords();


    const record =
        records.find(function(item) {

            return item.id === id;

        });


    if (!record) {
        return;
    }


    loadEmployeeOptions();


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Salary";


    document.getElementById(
        "employeeEmail"
    ).value =
        record.employeeEmail;


    document.getElementById(
        "basicSalary"
    ).value =
        record.basicSalary;


    document.getElementById(
        "allowances"
    ).value =
        record.allowances;


    document.getElementById(
        "deductions"
    ).value =
        record.deductions;


    document.getElementById(
        "salaryMonth"
    ).value =
        record.salaryMonth;


    document.getElementById(
        "salaryForm"
    ).dataset.editingId =
        record.id;


    calculateNetSalary();


    document
        .getElementById("salaryModal")
        .classList.add("show");
}


// ==========================================
// DELETE SALARY
// ==========================================

function deleteSalary(id) {

    const records =
        getSalaryRecords();


    const record =
        records.find(function(item) {

            return item.id === id;

        });


    if (!record) {
        return;
    }


    const confirmDelete =
        confirm(
            "Delete salary record for " +
            record.employeeName +
            "?"
        );


    if (!confirmDelete) {
        return;
    }


    const updatedRecords =
        records.filter(function(item) {

            return item.id !== id;

        });


    saveSalaryRecords(updatedRecords);


    displaySalaryRecords();
}


// ==========================================
// VIEW PAYSLIP
// ==========================================

function viewPayslip(id) {

    const records =
        getSalaryRecords();


    const record =
        records.find(function(item) {

            return item.id === id;

        });


    if (!record) {
        return;
    }


    const month =
        formatSalaryMonth(
            record.salaryMonth
        );


    alert(

        "========== PAYSLIP ==========\n\n" +

        "Employee: " +
        record.employeeName +

        "\nEmail: " +
        record.employeeEmail +

        "\nSalary Month: " +
        month +

        "\n\nBasic Salary: ₹" +
        formatNumber(record.basicSalary) +

        "\nAllowances: ₹" +
        formatNumber(record.allowances) +

        "\nDeductions: ₹" +
        formatNumber(record.deductions) +

        "\n-----------------------------" +

        "\nNet Salary: ₹" +
        formatNumber(record.netSalary) +

        "\n\nGenerated On: " +
        record.generatedOn

    );
}


// ==========================================
// FORMAT NUMBER
// ==========================================

function formatNumber(number) {

    return Number(number).toLocaleString("en-IN");
}


// ==========================================
// FORMAT SALARY MONTH
// ==========================================

function formatSalaryMonth(month) {

    if (!month) {
        return "-";
    }


    const date =
        new Date(month + "-01");


    return date.toLocaleDateString(
        "en-IN",
        {
            month: "long",
            year: "numeric"
        }
    );
}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {

    const employees =
        getEmployees();


    const records =
        getSalaryRecords();


    const totalPayroll =
        records.reduce(
            function(total, record) {

                return total +
                    Number(record.netSalary);

            },
            0
        );


    document.getElementById(
        "totalEmployees"
    ).textContent =
        employees.length;


    document.getElementById(
        "totalPayroll"
    ).textContent =
        "₹" + formatNumber(totalPayroll);


    document.getElementById(
        "totalPayslips"
    ).textContent =
        records.length;


    document.getElementById(
        "generatedPayslips"
    ).textContent =
        records.length;
}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "../index.html";
}


// ==========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ==========================================

document
    .getElementById("salaryModal")
    .addEventListener(
        "click",
        function(event) {

            if (event.target === this) {

                closeSalaryForm();

            }

        }
    );


// ==========================================
// INITIAL LOAD
// ==========================================

loadEmployeeOptions();

displaySalaryRecords();

updateStatistics();