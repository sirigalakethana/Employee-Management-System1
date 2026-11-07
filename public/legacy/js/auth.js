// ========================================
// EMPLOYEE MANAGEMENT SYSTEM
// Authentication JavaScript
// ========================================


// Create default admin account
function createDefaultAdmin() {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const adminExists = users.some(
        user => user.email === "admin@gmail.com"
    );

    if (!adminExists) {

        users.push({
            name: "Admin",
            email: "admin@gmail.com",
            password: "admin123",
            role: "admin"
        });

        localStorage.setItem("users", JSON.stringify(users));
    }
}


// Run admin account creation
createDefaultAdmin();


// ========================================
// SIGNUP
// ========================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("signupConfirmPassword").value;

        const role =
            document.getElementById("signupRole").value;

        const message =
            document.getElementById("signupMessage");


        // Check passwords
        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            message.style.color = "red";

            return;
        }


        // Get existing users
        let users =
            JSON.parse(localStorage.getItem("users")) || [];


        // Check existing email
        const existingUser = users.find(
            user => user.email === email
        );

        if (existingUser) {

            message.textContent =
                "An account with this email already exists.";

            message.style.color = "red";

            return;
        }


        // Create new employee
        const newUser = {

            name: name,
            email: email,
            password: password,
            role: role

        };


        // Add user
        users.push(newUser);


        // Save to Local Storage
        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        message.textContent =
            "Account created successfully! Redirecting...";

        message.style.color = "green";


        // Redirect to login
        setTimeout(function() {

            window.location.href = "index.html";

        }, 1500);

    });
}


// ========================================
// ROLE SELECTION + LOGIN
// ========================================

const roleCards = document.querySelectorAll(".role-card");
const continueRole = document.getElementById("continueRole");
const roleSelection = document.getElementById("roleSelection");
const loginForm = document.getElementById("loginForm");
const selectedRoleText = document.getElementById("selectedRoleText");
const changeRole = document.getElementById("changeRole");
const employeeRegisterPrompt = document.getElementById("employeeRegisterPrompt");
const showRegister = document.getElementById("showRegister");
const employeeRegisterForm = document.getElementById("employeeRegisterForm");
const backToEmployeeLogin = document.getElementById("backToEmployeeLogin");

let selectedRole = null;

if (roleCards.length > 0) {

    roleCards.forEach(function(card) {

        card.addEventListener("click", function() {

            roleCards.forEach(function(item) {
                item.classList.remove("selected");
            });

            card.classList.add("selected");
            selectedRole = card.dataset.role;
            continueRole.disabled = false;

        });

    });

}

if (continueRole) {

    continueRole.addEventListener("click", function() {

        if (!selectedRole) return;

        roleSelection.classList.add("hidden");
        loginForm.classList.remove("hidden");

        selectedRoleText.textContent =
            selectedRole === "admin"
                ? "Admin Login"
                : "Employee Login";

        if (employeeRegisterPrompt) {
            employeeRegisterPrompt.classList.toggle(
                "hidden",
                selectedRole !== "employee"
            );
        }

    });

}

if (changeRole) {

    changeRole.addEventListener("click", function() {

        loginForm.classList.add("hidden");
        if (employeeRegisterForm) employeeRegisterForm.classList.add("hidden");
        roleSelection.classList.remove("hidden");

        roleCards.forEach(function(item) {
            item.classList.remove("selected");
        });

        selectedRole = null;
        continueRole.disabled = true;

    });

}

if (showRegister) {

    showRegister.addEventListener("click", function() {

        loginForm.classList.add("hidden");
        employeeRegisterForm.classList.remove("hidden");
        document.getElementById("loginMessage").textContent = "";

    });
}

if (backToEmployeeLogin) {

    backToEmployeeLogin.addEventListener("click", function() {

        employeeRegisterForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
        document.getElementById("loginMessage").textContent = "";

    });
}

if (employeeRegisterForm) {

    employeeRegisterForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("registerConfirmPassword").value;
        const message = document.getElementById("loginMessage");

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            message.style.color = "red";
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const existingUser = users.find(function(user) {
            return user.email.toLowerCase() === email.toLowerCase();
        });

        if (existingUser) {
            message.textContent = "An account with this email already exists. Please sign in.";
            message.style.color = "red";
            return;
        }

        const newEmployee = {
            name: name,
            email: email,
            password: password,
            role: "employee"
        };

        users.push(newEmployee);
        localStorage.setItem("users", JSON.stringify(users));

        document.getElementById("loginEmail").value = email;
        document.getElementById("loginPassword").value = password;

        employeeRegisterForm.classList.add("hidden");
        loginForm.classList.remove("hidden");

        message.textContent = "Employee account created successfully. You can now sign in.";
        message.style.color = "green";
    });
}

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");

        const users =
            JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(function(user) {
            return user.email === email &&
                   user.password === password &&
                   user.role === selectedRole;
        });

        if (!user) {

            message.textContent =
                "Invalid credentials or selected role.";

            message.style.color = "red";
            return;

        }

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        message.textContent =
            "Login successful! Redirecting...";

        message.style.color = "green";

        setTimeout(function() {

            if (user.role === "admin") {
                window.location.href =
                    "admin/admin-dashboard.html";
            } else {
                window.location.href =
                    "user/user-dashboard.html";
            }

        }, 800);

    });

}
