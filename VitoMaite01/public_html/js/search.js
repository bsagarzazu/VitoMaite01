// search.js
document.addEventListener("DOMContentLoaded", function() {
    const searchBtn = document.getElementById("search-btn");

    searchBtn.addEventListener("click", function() {
        const gender = document.getElementById("search-gender").value;
        const minAge = document.getElementById("age-min").value;
        const maxAge = document.getElementById("age-max").value;
        const city = document.getElementById("city").value;
        // Simulamos una búsqueda de usuarios
        // TODO: obtener el search data del session storage
        const results = searchUsers(gender, minAge, maxAge, city);
        displaySearchResults(results);
    });

    // Función para simular búsqueda de usuarios
    function searchUsers(gender, minAge, maxAge, city) {
        // Simulación de usuarios de base de datos
        const users = [
            { name: "Juan", age: 25, city: "Gasteiz", photo: "https://via.placeholder.com/150" },
            { name: "Pedro", age: 30, city: "Donostia", photo: "https://via.placeholder.com/150" },
            { name: "Ana", age: 22, city: "Bilbo", photo: "https://via.placeholder.com/150" }
        ];

        return users.filter(user => user.city === city && user.age >= 18 && user.age <= 35);
    }

    // Mostrar resultados
    function displaySearchResults(users) {
        const resultsDiv = document.getElementById("search-results");
        resultsDiv.innerHTML = "";
        
        users.forEach((user) => {
            const profileDiv = document.createElement("div");
            profileDiv.className = "profile";
            // TODO: display the actual image
            profileDiv.innerHTML = `
                <div class="profile-img">
                    <img src"img/placeholder.jpg">
                </div>
                <div id="name-age">
                    <p><span class="name">${user.nick}</span>  ${user.age}</p>
                </div>
            `;
            resultsDiv.appendChild(profileDiv);
        });
    }
});
