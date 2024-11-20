//BEÑAT
document.addEventListener("DOMContentLoaded", function () {
    const hobbiesSection = document.getElementById("hobbies-section");
    const hobbiesSelect = document.getElementById("hobbies");
    const searchBtn = document.getElementById("search-btn");

    if (sessionStorage.getItem("userLoggedIn")) {
        hobbiesSection.style.display = "block";
        fillHobbies(hobbiesSelect);
    }
    
    searchBtn.addEventListener("click", function () {
        const gender = document.getElementById("search-gender").value;
        const minAge = document.getElementById("age-min").value;
        const maxAge = document.getElementById("age-max").value;
        const city = document.getElementById("city").value;
        const hobbies = Array.from(document.getElementById("hobbies").selectedOptions).map(option => option.value);

        searchUsers(gender, minAge, maxAge, city, hobbies);
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

function searchUsers(gender, minAge, maxAge, city, hobbies) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("vitomaite01", 1);

        request.onerror = (event) => {
            console.error(`An error occurred during database opening: ${event.target.error?.message}`);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            console.log("Database opened successfully");
            const db = event.target.result;

            const transaction = db.transaction(["users", "userHobby", "hobbies"], "readonly");
            const objStoreUsers = transaction.objectStore("users");
            const objStoreUserHobby = transaction.objectStore("userHobby");
            const objStoreHobbies = transaction.objectStore("hobbies");

            let matchingUsers = [];

            // Si hay hobbies -> búsqueda por hobbies
            if (hobbies && hobbies.length > 0) {
                let hobbyIds = [];
                // Obtiene los IDs de los hobbies a buscar
                const hobbyRequests = hobbies.map(hobbyName => {
                    return new Promise((resolve, reject) => {
                        const hobbyRequest = objStoreHobbies.index("byHobbyName").get(hobbyName); // Necesito índice sobre el nombre
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

                // Espera a que se resuelvan todas las promesas de los hobbies
                Promise.all(hobbyRequests).then(() => {
                    // Busca los correos con los IDs de hobbies seleccionados
                    let userEmails = new Set();
                    const userHobbyRequests = hobbyIds.map(hobbyId => {
                        return new Promise((resolve, reject) => {
                            const index = objStoreUserHobby.index("byHobbyId"); // Necesito índice sobre el ID
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
                        const userRequest = objStoreUsers.index("byEmail").openCursor(); // Necesito índice sobre email
                        userRequest.onsuccess = (event) => {
                            const cursor = event.target.result;
                            if (cursor) {
                                const user = cursor.value;

                                // Solo considerar usuarios cuyos emails estén en el conjunto de `userEmails`
                                if (userEmails.has(user.email)) {
                                    const isGenderMatch = gender === "A" || user.gender === gender;
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

            } else {
                // Si no hay hobbies, buscar solo por género, edad y ciudad
                const userRequest = objStoreUsers.index("byEmail").openCursor(); // Necesito índice sobre email
                userRequest.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        const user = cursor.value;

                        const isGenderMatch = gender === "A" || user.gender === gender;
                        const isAgeMatch = user.age >= minAge && user.age <= maxAge;
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
            }
        };
    });
};