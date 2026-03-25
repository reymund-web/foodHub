document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Temporary account credentials
        const testUser = "customer";
        const testPass = "password";

        const testAdmin = "admin";
        const testAdminPass = "admin";

        if (username === testUser && password === testPass) {
            // Success, redirect to menu.html
            window.location.href = "menu.html";
        } else if (username === testAdmin && password === testAdminPass) {
            // Success, redirect to admin.html
            window.location.href = "admin.html";
        } else {
            // Failed
            alert("Invalid credentials. For testing, use username 'customer' and password 'password'.");
        }
    });
});
