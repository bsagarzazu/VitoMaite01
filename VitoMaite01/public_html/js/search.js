// search.js
document.addEventListener("DOMContentLoaded", function() {
    const searchBtn = document.getElementById("search-btn");

    searchBtn.addEventListener("click", function() {
        const gender = document.getElementById("search-gender").value;
        const ageRange = document.getElementById("age-range").value;
        const city = document.getElementById("city").value;

        // Simulamos una búsqueda de usuarios
        const results = searchUsers(gender, ageRange, city);
        displaySearchResults(results);
    });

    // Función para simular búsqueda de usuarios
    function searchUsers(gender, ageRange, city) {
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

        users.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.className = "user-result";
            userDiv.innerHTML = `
                <img src="${user.photo}" alt="${user.name}" class="user-photo">
                <p>${user.name} (${user.age})</p>
            `;
            resultsDiv.appendChild(userDiv);
        });
    }
});
