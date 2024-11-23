//BEÑAT
document.addEventListener("DOMContentLoaded", function () {
    const hobbiesSection = document.getElementById("hobbies-section");
    const hobbiesSelect = document.getElementById("hobbies");
    const searchBtn = document.getElementById("search-btn");

    fillHobbies(hobbiesSelect);

    // Prevengo que se escriba a mano
    document.getElementById('age-min').addEventListener('keydown', function () {
        if (![38, 40].includes(event.keyCode)) { // 38: flecha arriba, 40: flecha abajo
            event.preventDefault();
        }
    });

    document.getElementById('age-max').addEventListener('keydown', function () {
        if (![38, 40].includes(event.keyCode)) { // 38: flecha arriba, 40: flecha abajo
            event.preventDefault();
        }
    });

    searchBtn.addEventListener("click", function () {
        const gender = document.getElementById("search-gender").value;
        const minAge = document.getElementById("age-min").value;
        const maxAge = document.getElementById("age-max").value;
        const city = document.getElementById("city").value;
        const hobbies = Array.from(document.getElementById("hobbies").selectedOptions).map(option => option.value);

        let formValid = true;
        let errorMessage = "";

        // Validar que los campos de género, edad y ciudad estén seleccionados
        if (!gender) {
            formValid = false;
            errorMessage = "Por favor, indica el género que buscas.";
        } else if (!minAge || !maxAge) {
            formValid = false;
            errorMessage = "Por favor, indica un rango de edad válido.";
        } else if (!city) {
            formValid = false;
            errorMessage = "Por favor, selecciona una ciudad.";
        }

        if (!formValid) {
            event.preventDefault();
            alert(errorMessage); // Muestra el mensaje de error
        } else {
            searchUsers(gender, minAge, maxAge, city, hobbies);
        }
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
        console.log("Hobbies passed to search:", hobbies);

        request.onerror = (event) => {
            console.error(`An error occurred during database opening: ${event.target.error?.message}`);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            console.log("Database opened successfully");
            const db = event.target.result;
            const transaction = db.transaction(["users", "userHobby"], "readonly");
            const objStoreUsers = transaction.objectStore("users");
            const objStoreUserHobby = transaction.objectStore("userHobby");

            let matchingUsers = [];

            if (hobbies && hobbies.length > 0) {
                let userEmails = new Set();

                const userHobbyRequests = hobbies.map(hobbyId => {
                    return new Promise((resolve, reject) => {
                        const index = objStoreUserHobby.index("byHobbyId");
                        const hobby = parseInt(hobbyId); // Esto ha costado horas y horas
                        const request = index.openCursor(IDBKeyRange.only(hobby));
                        request.onsuccess = (event) => {
                            const cursor = event.target.result;
                            console.log(`Searching for hobbyId: ${hobby}, Cursor:`, cursor);
                            if (cursor) {
                                console.log(`Found user email: ${cursor.value.userEmail}`);
                                userEmails.add(cursor.value.userEmail);
                                cursor.continue();
                            } else {
                                console.log(`No more users found for hobbyId: ${hobbyId}`);
                                resolve();
                            }
                        };

                        request.onerror = (event) => {
                            console.error(`Error while fetching users for hobbyId ${hobbyId}:`, event.target.error);
                            reject(event.target.error);
                        };
                    });
                });

                Promise.all(userHobbyRequests).then(() => {
                    console.log("User Emails collected:", Array.from(userEmails));

                    const index = objStoreUsers.index("byEmail");
                    const userRequest = index.openCursor();
                    userRequest.onsuccess = (event) => {
                        const cursor = event.target.result;
                        if (cursor) {
                            const user = cursor.value;

                            if (userEmails.has(user.email)) {
                                const isGenderMatch = gender === "A" || user.gender === gender;
                                const isAgeMatch = user.age >= minAge && user.age <= maxAge;
                                const isCityMatch = city ? user.city === city : true;

                                let isMe = false;
                                if (sessionStorage.getItem("userLoggedIn")) {
                                    const me = JSON.parse(sessionStorage.getItem("userLoggedIn"));
                                    isMe = user.email === me.email;
                                }

                                if (isGenderMatch && isAgeMatch && isCityMatch && !isMe) {
                                    matchingUsers.push(user);
                                }
                            }

                            cursor.continue();
                        } else {
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
            } else {
                const userRequest = objStoreUsers.index("byEmail").openCursor();
                userRequest.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        const user = cursor.value;

                        const isGenderMatch = gender === "A" || user.gender === gender;
                        const isAgeMatch = user.age >= minAge && user.age <= maxAge;
                        const isCityMatch = city ? user.city === city : true;

                        let isMe = false;
                        if (sessionStorage.getItem("userLoggedIn")) {
                            const me = JSON.parse(sessionStorage.getItem("userLoggedIn"));
                            isMe = user.email === me.email;
                        }

                        if (isGenderMatch && isAgeMatch && isCityMatch && !isMe) {
                            matchingUsers.push(user);
                        }

                        cursor.continue();
                    } else {
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
}