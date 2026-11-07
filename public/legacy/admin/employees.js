/* =====================================================
   EMPLOYEE MANAGEMENT MODULE
   JAVASCRIPT
   ===================================================== */


/* =====================================================
   1. CHECK ADMIN LOGIN
   ===================================================== */

const currentUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );


if (
    !currentUser ||
    currentUser.role !== "admin"
) {

    window.location.href =
        "../index.html";

}


/* =====================================================
   2. LOAD ADMIN NAME
   ===================================================== */

if (currentUser) {

    const adminName =
        document.getElementById("adminName");

    if (adminName) {

        adminName.textContent =
            currentUser.name || "Admin";

    }

}


/* =====================================================
   3. GET USERS
   ===================================================== */

let users =
    JSON.parse(
        localStorage.getItem("users")
    ) || [];


/* =====================================================
   4. GET EMPLOYEES
   ===================================================== */

function getEmployees() {

    return users.filter(function(user) {

        return user.role === "employee";

    });

}


/* =====================================================
   5. DISPLAY EMPLOYEES
   ===================================================== */

function displayEmployees(employeeData = getEmployees()) {

    const tableBody =
        document.getElementById(
            "employeeTableBody"
        );

    const emptyMessage =
        document.getElementById(
            "emptyMessage"
        );


    tableBody.innerHTML = "";


    if (employeeData.length === 0) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    employeeData.forEach(
        function(employee) {


            const row =
                document.createElement("tr");


            const firstLetter =
                employee.name
                    .charAt(0)
                    .toUpperCase();


            row.innerHTML = `

                <td>

                    <div class="employee-name">

                        <div class="employee-avatar">
                            ${firstLetter}
                        </div>

                        <strong>
                            ${employee.name}
                        </strong>

                    </div>

                </td>


                <td>
                    ${employee.email}
                </td>


                <td>

                    <span class="role-badge">

                        ${employee.jobRole || "Employee"}

                    </span>

                </td>


                <td>

                    <span class="status-badge">
                        Active
                    </span>

                </td>


                <td>

                    <div class="actions">

                        <button
                            class="edit-button"
                            onclick="editEmployee('${employee.email}')"
                            title="Edit"
                        >
                            ✎
                        </button>


                        <button
                            class="delete-button"
                            onclick="deleteEmployee('${employee.email}')"
                            title="Delete"
                        >
                            ×
                        </button>

                    </div>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


/* =====================================================
   6. UPDATE STATISTICS
   ===================================================== */

function updateStatistics() {

    const employees =
        getEmployees();


    document.getElementById(
        "totalEmployees"
    ).textContent =
        employees.length;


    document.getElementById(
        "activeEmployees"
    ).textContent =
        employees.length;


    document.getElementById(
        "employeeAccounts"
    ).textContent =
        employees.length;

}


/* =====================================================
   7. SEARCH
   ===================================================== */

function searchEmployees() {

    const searchValue =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const employees =
        getEmployees();


    const filteredEmployees =
        employees.filter(
            function(employee) {

                return (

                    employee.name
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    employee.email
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    (
                        employee.jobRole || ""
                    )
                        .toLowerCase()
                        .includes(searchValue)

                );

            }
        );


    displayEmployees(
        filteredEmployees
    );

}


/* =====================================================
   8. OPEN ADD FORM
   ===================================================== */

function openAddEmployeeForm() {

    document.getElementById(
        "employeeModal"
    ).classList.add("show");


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Employee";


    document.getElementById(
        "employeeForm"
    ).reset();


    document.getElementById(
        "employeeEmail"
    ).disabled = false;


    document.getElementById(
        "passwordGroup"
    ).style.display =
        "block";


    document.getElementById(
        "employeeForm"
    ).dataset.editingEmail =
        "";

}


/* =====================================================
   9. CLOSE FORM
   ===================================================== */

function closeEmployeeForm() {

    document.getElementById(
        "employeeModal"
    ).classList.remove("show");

}


/* =====================================================
   10. ADD / EDIT EMPLOYEE
   ===================================================== */

document
    .getElementById("employeeForm")
    .addEventListener(
        "submit",
        function(event) {


            event.preventDefault();


            const name =
                document
                    .getElementById("employeeName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("employeeEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("employeePassword")
                    .value;


            const jobRole =
                document
                    .getElementById("employeeRole")
                    .value;


            const editingEmail =
                this.dataset.editingEmail;


            /* ================= EDIT ================= */

            if (editingEmail) {

                const index =
                    users.findIndex(
                        function(user) {

                            return (
                                user.email ===
                                editingEmail
                            );

                        }
                    );


                if (index !== -1) {

                    users[index].name =
                        name;

                    users[index].email =
                        email;

                    users[index].jobRole =
                        jobRole;


                    /*
                       Change password only
                       if a new password
                       was entered.
                    */

                    if (password) {

                        users[index].password =
                            password;

                    }


                    localStorage.setItem(
                        "users",
                        JSON.stringify(users)
                    );

                }


                alert(
                    "Employee updated successfully."
                );

            }


            /* ================= ADD ================= */

            else {

                const existing =
                    users.find(
                        function(user) {

                            return (
                                user.email ===
                                email
                            );

                        }
                    );


                if (existing) {

                    alert(
                        "An account with this email already exists."
                    );

                    return;

                }


                if (!password) {

                    alert(
                        "Please enter a password."
                    );

                    return;

                }


                const newEmployee = {

                    name: name,

                    email: email,

                    password: password,

                    role: "employee",

                    jobRole: jobRole

                };


                users.push(
                    newEmployee
                );


                localStorage.setItem(
                    "users",
                    JSON.stringify(users)
                );


                alert(
                    "Employee added successfully."
                );

            }


            closeEmployeeForm();


            /*
               Reload users from Local Storage
            */

            users =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];


            displayEmployees();

            updateStatistics();

        }
    );


/* =====================================================
   11. EDIT EMPLOYEE
   ===================================================== */

function editEmployee(email) {

    const employee =
        users.find(
            function(user) {

                return (
                    user.email === email &&
                    user.role === "employee"
                );

            }
        );


    if (!employee) {

        return;

    }


    document.getElementById(
        "employeeModal"
    ).classList.add("show");


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Employee";


    document.getElementById(
        "employeeName"
    ).value =
        employee.name;


    document.getElementById(
        "employeeEmail"
    ).value =
        employee.email;


    document.getElementById(
        "employeeEmail"
    ).disabled =
        true;


    document.getElementById(
        "employeeRole"
    ).value =
        employee.jobRole ||
        "Developer";


    document.getElementById(
        "employeePassword"
    ).value =
        "";


    document.getElementById(
        "passwordGroup"
    ).style.display =
        "block";


    document.getElementById(
        "employeeForm"
    ).dataset.editingEmail =
        email;

}


/* =====================================================
   12. DELETE EMPLOYEE
   ===================================================== */

function deleteEmployee(email) {

    const employee =
        users.find(
            function(user) {

                return (
                    user.email === email &&
                    user.role === "employee"
                );

            }
        );


    if (!employee) {

        return;

    }


    const confirmed =
        confirm(
            "Are you sure you want to delete " +
            employee.name +
            "?"
        );


    if (!confirmed) {

        return;

    }


    users =
        users.filter(
            function(user) {

                return user.email !== email;

            }
        );


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    displayEmployees();

    updateStatistics();


    alert(
        "Employee deleted successfully."
    );

}


/* =====================================================
   13. LOGOUT
   ===================================================== */

function logout() {

    localStorage.removeItem(
        "currentUser"
    );


    window.location.href =
        "../index.html";

}


/* =====================================================
   14. TEMPORARY MESSAGE
   ===================================================== */

function showMessage(moduleName) {

    alert(
        moduleName +
        " will be implemented in the next module."
    );

}


/* =====================================================
   15. INITIAL LOAD
   ===================================================== */

displayEmployees();

updateStatistics();