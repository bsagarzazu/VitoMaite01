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
    /*const hobbiesSection = document.getElementById("hobbies-section");
    const hobbiesSelect = document.getElementById("hobbies");*/

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
/*
        // Mostrar el desplegable de aficiones
        hobbiesSection.style.display = "block";
        fillHobbies(hobbiesSelect);*/
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

    /*// Lógica de búsqueda
    const searchBtn = document.getElementById("search-btn");

    searchBtn.addEventListener("click", function () {
        const gender = document.getElementById("search-gender").value;
        const minAge = document.getElementById("age-min").value;
        const maxAge = document.getElementById("age-max").value;
        const city = document.getElementById("city").value;
        const hobbies = Array.from(document.getElementById("hobbies").selectedOptions).map(option => option.value);

        searchUsers(gender, minAge, maxAge, city, hobbies);
    });*/
});

/*function fillHobbies(hobbiesSelect) {
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

function searchUsers(gender, minAge, maxAge, city, hobbies) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("vitomaite01", 1);

        request.onerror = (event) => {
            console.error(`An error occurred during database opening: ${event.target.error?.message}`);
        };

        request.onsuccess = (event) => {
            console.log("Database opened successfully");
            const db = event.target.result;

            const transaction = db.transaction(["users", "userHobby", "hobbies"], "readonly");
            const objStoreUsers = transaction.objectStore("users");
            const objStoreUserHobby = transaction.objectStore("userHobby");
            const objStoreHobbies = transaction.objectStore("hobbies");

            let matchingUsers = [];

            // Primero busca por hobbies si los hay
            let hobbyIds = [];
            if (hobbies.length > 0) {
                // Obtiene los IDs de los hobbies a buscar
                const hobbyRequests = hobbies.map(hobbyName => {
                    return new Promise((resolve, reject) => {
                        const hobbyRequest = objStoreHobbies.index("hobbyName").get(hobbyName); // Necesito un indice sobre el nombre
                        hobbyRequest.onsuccess = () => {
                            if (hobbyRequest.result) {
                                hobbyIds.push(hobbyRequest.result.hobbyId);
                                resolve();
                            } else {
                                reject(`Hobby ${hobbyName} no encontrado`);
                            }
                        };
                        hobbyRequest.onerror = (event) => reject(event.target.error);
                    });
                });
                // Espera a haber terminado lo anterior, sin promesas no esperaría
                Promise.all(hobbyRequests).then(() => {
                    // Busca correos con IDs de hobbies seleccionados
                    let userEmails = new Set();
                    const userHobbyRequests = hobbyIds.map(hobbyId => {
                        return new Promise((resolve, reject) => {
                            const index = objStoreUserHobby.index("hobbyId"); // Necesito índice sobre IDs
                            const request = index.openCursor(IDBKeyRange.only(hobbyId));
                            request.onsuccess = (event) => {
                                const cursor = event.target.result;
                                if (cursor) {
                                    userEmails.add(cursor.value.userEmail);
                                    cursor.continue();
                                } else {
                                    resolve();
                                }
                            };
                            request.onerror = (event) => reject(event.target.error);
                        });
                    });

                    Promise.all(userHobbyRequests).then(() => {
                        // Filtrar usuarios por género, edad y ciudad
                        const userEmailsArray = Array.from(userEmails);
                        const userRequest = objStoreUsers.index("email").openCursor();
                        userRequest.onsuccess = (event) => {
                            const cursor = event.target.result;
                            if (cursor) {
                                const user = cursor.value;

                                // Solo considerar usuarios cuyos emails estén en el conjunto de `userEmails`
                                if (userEmails.has(user.email)) {
                                    const isGenderMatch = gender ? user.gender === gender : true;
                                    const isAgeMatch = user.age >= minAge && user.age <= maxAge;
                                    const isCityMatch = city ? user.city === city : true;

                                    // Si todos los filtros coinciden, agregar usuario
                                    if (isGenderMatch && isAgeMatch && isCityMatch) {
                                        matchingUsers.push(user);
                                    }
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
                    }).catch(reject);

                }).catch(reject);

            }
        };
    });
};*/