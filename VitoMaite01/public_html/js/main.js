document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const userInfo = document.getElementById("user-info");
    const userLogged = document.getElementById("user-logged");
    const userGuest = document.getElementById("user-guest");
    const userAvatar = document.getElementById("user-avatar");
    const usernameSpan = document.getElementById("username");
    const hobbiesSection = document.getElementById("hobbies-section");

    // Verifica si el usuario está logueado
    if (sessionStorage.getItem("userLoggedIn")) {
        const user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
        userLogged.style.display = "flex";
        userGuest.style.display = "none";
        userAvatar.src = user.image || "img/placeholder.png";
        usernameSpan.textContent = user.nick;

        // Mostrar el botón de logout
        logoutBtn.addEventListener("click", function() {
            sessionStorage.removeItem("userLoggedIn");
            window.location.reload();
        });

        // Mostrar el desplegable de aficiones
        hobbiesSection.style.display = "block";
    } else {
        userLogged.style.display = "none";
        userGuest.style.display = "flex";
    }

    // Login click
    loginBtn.addEventListener("click", function() {
        window.location.href = "login.html";
    });

    // Lógica de búsqueda
    const searchBtn = document.getElementById("search-btn");

    searchBtn.addEventListener("click", function() {
        const gender = document.getElementById("search-gender").value;
        const ageRange = document.getElementById("age-range").value;
        const city = document.getElementById("city").value;
        
        // Almacena los datos de búsqueda en el almacenamiento de sesión o pasa por URL
        const searchData = { gender, ageRange, city };

        // Redirigir a la página de resultados
        sessionStorage.setItem("searchData", JSON.stringify(searchData));
        window.location.href = "resultados.html"; // Página de resultados
    });
});
