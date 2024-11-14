// login.js
document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById("login-btn");
    
    loginBtn.addEventListener("click", function() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (email && password) {
            // Simular login correcto
            const user = { email: email, nick: email.split('@')[0] }; // Simplificación
            localStorage.setItem("userLoggedIn", JSON.stringify(user));
            window.location.href = "index.html";
        } else {
            alert("Por favor ingresa un correo y una contraseña válidos.");
        }
    });
});
