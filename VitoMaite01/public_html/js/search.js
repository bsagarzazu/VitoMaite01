// search.js
document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search-btn");

    searchBtn.addEventListener("click", function () {
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
        const request = window.indexedDB.open("vitomaite01", 1);

        request.onerror = (event) => {
            console.error(`An error occurred during database opening: ${event.target.error?.message}`);
        };

        request.onsuccess = (event) => {
            console.log("Database opened successfully");

            const db = event.target.result;

            const stores = ["users", "hobbies", "likes", "userHobby"];
                const transaction = db.transaction(["users"], "read");
                const objStore = transaction.objectStore("users");
        };

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
