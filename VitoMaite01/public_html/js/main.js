//BEÑAT
document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    const mapBtn = document.getElementById("map-btn");
    const likesBtn = document.getElementById("likes-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const profileBtn = document.getElementById("view-profile-btn");
    const userInfo = document.getElementById("user-info");
    const userLogged = document.getElementById("user-logged");
    const userGuest = document.getElementById("user-guest");
    const userAvatar = document.getElementById("user-avatar");
    const usernameSpan = document.getElementById("username");
    const userGreeting = document.getElementById("hello-user");
    const hobbiesSection = document.getElementById("hobbies-section");
    const hobbiesSelect = document.getElementById("hobbies");

    // Verifica si el usuario está logueado
    if (sessionStorage.getItem("userLoggedIn")) {
        const user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
        userLogged.style.display = "flex";
        userGuest.style.display = "none";
        userAvatar.src = user.image || "img/placeholder.jpg";
        usernameSpan.textContent = user.nick;
        userGreeting.textContent = "Hola, " + user.nick;

        // Mostrar el botón de logout
        logoutBtn.addEventListener("click", function () {
            sessionStorage.removeItem("userLoggedIn");
            window.location.reload();
        });

        // Mostrar el desplegable de aficiones
        hobbiesSection.style.display = "block";
        fillHobbies(hobbiesSelect);
    } else {
        userLogged.style.display = "none";
        userGuest.style.display = "flex";
    }

    // Login click
    loginBtn.addEventListener("click", function () {
        window.location.href = "login.html";
    });

    profileBtn.addEventListener("click", function () {
        window.location.href = "profile.html";
    });

    mapBtn.addEventListener("click", function () {
        window.location.href = "map.html";
    });

    likesBtn.addEventListener("click", function () {
        window.location.href = "likes.html";
    });

    // Lógica de búsqueda
    const searchBtn = document.getElementById("search-btn");

    searchBtn.addEventListener("click", function () {
        const gender = document.getElementById("search-gender").value;
        const minAge = document.getElementById("age-min").value;
        const maxAge = document.getElementById("age-max").value;
        const city = document.getElementById("city").value;
        const hobbies = "";
        if (sessionStorage.getItem("userLoggedIn")) {
            const hobbies = document.getElementById("hobbies").value;
        }
        // Almacena los datos de búsqueda en el almacenamiento de sesión o pasa por URL
        const searchData = {gender, minAge, maxAge, city, hobbies};

        // Redirigir a la página de resultados
        sessionStorage.setItem("searchData", JSON.stringify(searchData));
        window.location.href = "resultados.html"; // Página de resultados
    });
});

function fillHobbies(hobbiesSelect) {
    let request = window.indexedDB.open("vitomaite01", 1);

    console.log("Cargando hobbies...");
    request.onsuccess = (event) => {
        const db = event.target.result;

        console.log("Conectado a IndexedDB...");

        const transaction = db.transaction(['hobbies'], 'readonly');
        const objectStore = transaction.objectStore('hobbies');

        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = function (event) {
            console.log("Cargado hobbies...");
            const hobbies = event.target.result;
            if (hobbies.length > 0) {
                hobbies.forEach(function (hobby) {
                    const option = document.createElement("option");
                    option.value = hobby.hobbyId;
                    option.textContent = hobby.hobbyName;
                    hobbiesSelect.appendChild(option);
                });
            }
        };

        getAllRequest.onerror = function (event) {
            console.error("Error al obtener los hobbies:", event.target.error);
        };
    };

    request.onerror = (event) => {
        console.error("An error occurred during database opening: ${event.target.error?.message}");
    };
}