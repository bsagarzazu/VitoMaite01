//BEÑAT
document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("search-btn");

    searchBtn.addEventListener("click", function () {
        const gender = document.getElementById("search-gender").value;
        const minAge = document.getElementById("age-min").value;
        const maxAge = document.getElementById("age-max").value;
        const city = document.getElementById("city").value;

        searchUsers(gender, minAge, maxAge, city);
    });
});

function searchUsers(gender, minAge, maxAge, city) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("vitomaite01", 1);

        request.onerror = (event) => {
            console.error(`An error occurred during database opening: ${event.target.error?.message}`);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            console.log("Database opened successfully");
            const db = event.target.result;

            const transaction = db.transaction(["users"], "readonly");
            const objStoreUsers = transaction.objectStore("users");

            let matchingUsers = [];

            const userRequest = objStoreUsers.index("byEmail").openCursor(); // Necesito índice sobre email
            userRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const user = cursor.value;
                    console.log(gender + "===" + user.gender);
                    const isGenderMatch = gender === "A" || user.gender === gender;
                    console.log(minAge + "<=" + user.age + "<=" + maxAge);
                    const isAgeMatch = user.age >= minAge && user.age <= maxAge;
                    console.log(city + "===" + user.city);
                    const isCityMatch = city ? user.city === city : true;

                    // Si todos los filtros coinciden, agregar usuario
                    if (isGenderMatch && isAgeMatch && isCityMatch) {
                        matchingUsers.push(user);
                    }

                    cursor.continue();
                } else {
                    // Devuelve los resultados, los almacena en sessionStorage y redirige a resultados
                    sessionStorage.setItem("searchResults", JSON.stringify(matchingUsers));
                    window.location.href = "resultados.html";
                    resolve(matchingUsers);
                }
            };

            userRequest.onerror = (event) => {
                console.error(`Error while iterating users: ${event.target.error?.message}`);
                reject(event.target.error);
            };
        };
    });
}