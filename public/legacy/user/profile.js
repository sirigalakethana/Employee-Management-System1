// ===============================
// EMPLOYEE PROFILE
// ===============================

const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));


// ===============================
// LOGIN CHECK
// ===============================

if (!currentUser) {
    window.location.href = "../index.html";
}


// ===============================
// ROLE CHECK
// ===============================

if (currentUser && currentUser.role !== "employee") {
    window.location.href = "../admin/admin-dashboard.html";
}


// ===============================
// GET ELEMENTS
// ===============================

const profileName =
    document.getElementById("profileName");

const profileRole =
    document.getElementById("profileRole");

const profileAvatar =
    document.getElementById("profileAvatar");

const headerName =
    document.getElementById("headerName");

const largeAvatar =
    document.getElementById("largeAvatar");

const profileFullName =
    document.getElementById("profileFullName");

const profileEmail =
    document.getElementById("profileEmail");

const profileJobRole =
    document.getElementById("profileJobRole");

const accountEmail =
    document.getElementById("accountEmail");

const accountJobRole =
    document.getElementById("accountJobRole");

const profileMessage =
    document.getElementById("profileMessage");


// ===============================
// LOAD PROFILE
// ===============================

function loadProfile() {

    if (!currentUser) {
        return;
    }

    const name = currentUser.name || "Employee";

    const jobRole =
        currentUser.jobRole || "Employee";


    profileName.textContent = name;

    profileRole.textContent = jobRole;

    headerName.textContent = name;

    profileFullName.value = name;

    profileEmail.value =
        currentUser.email || "";

    profileJobRole.value = jobRole;

    accountEmail.textContent =
        currentUser.email || "-";

    accountJobRole.textContent =
        jobRole;


    const firstLetter =
        name.charAt(0).toUpperCase();

    profileAvatar.textContent = firstLetter;

    largeAvatar.textContent = firstLetter;
}


// ===============================
// UPDATE PROFILE
// ===============================

document
    .getElementById("profileForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const newName =
            profileFullName.value.trim();


        if (newName === "") {

            profileMessage.textContent =
                "Name cannot be empty.";

            profileMessage.style.color =
                "#dc2626";

            return;
        }


        // Get all users
        let users =
            JSON.parse(localStorage.getItem("users")) || [];


        // Find current employee
        const userIndex =
            users.findIndex(function(user) {

                return user.email === currentUser.email;

            });


        if (userIndex === -1) {

            profileMessage.textContent =
                "User account not found.";

            profileMessage.style.color =
                "#dc2626";

            return;
        }


        // Update user
        users[userIndex].name = newName;


        // Save users
        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        // Update current user
        currentUser.name = newName;


        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );


        // Update screen
        loadProfile();


        profileMessage.textContent =
            "Profile updated successfully!";

        profileMessage.style.color =
            "#15803d";

    });


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

loadProfile();