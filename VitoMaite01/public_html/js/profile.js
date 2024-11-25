document.addEventListener("DOMContentLoaded", function () {
    const profile = document.getElementById("profile-photo");
    const name = document.getElementById("profile-name");
    const gender = document.getElementById("profile-gender");
    const city = document.getElementById("profile-city");
    const age = document.getElementById("profile-age");
    
    const addHobbies = document.getElementById("");
    const deleteHobbies = document.getElementById("");
    let selected;
    let unselected;
    
    if(sessionStorage.getItem("userLoggedIn")) {
        const user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
        
        profile.src = "data:image/png;base64," + (user.image || "") || "img/placeholder.jpg";
        name.textContent = "Nombre: " + user.nick;
        gender.textContent = "Género: " + (user.gender === "H" ? "Hombre" : "Mujer");
        city.textContent = "Ciudad: " + user.city;
        age.textContent = "Edad: " + user.age;
        
        selected = getUserHobbies(user.email, true);
        unselected = getUserHobbies(user.email, false);
        
        displayHobbies(selected);
    }
    
    const editHobbiesBtn = document.getElementById("editHobbies-btn");
    editHobbiesBtn.addEventListener("click", (event) => {
        const editHobbiesModal = document.getElementById("edit-hobbies-modal");
        fillHobbies(addHobbies, unselected);
        fillHobbies(deleteHobbies, selected);
        editHobbiesModal.style.display = "flex";
    });
});

function displayHobbies(hobbies) {
    if (hobbies && hobbies.length > 0) {
        // Extraemos solo los nombres de los hobbies
        const hobbyNames = hobbies.map(hobby => hobby.name);
        document.getElementById("hobbies").textContent = "Aficiones: " + hobbyNames.join(", ");
    } else {
        document.getElementById("hobbies").textContent = "Aficiones: No especificadas";
    }
}

function fillHobbies(selectElement, hobbies) {
    selectElement.innerHTML = '';
    hobbies.forEach(hobby => {
        const option = document.createElement('option');
        option.value = hobby.id;
        option.textContent = hobby.name;
        selectElement.appendChild(option);
    });
}

/*
 * Si includeUserHobbies = true devuelve los hobbyId y hobbyName que tiene el usuario
 * Si includeUserHobbies = false devuelve los hobbyId y hobbyName que NO tiene el usuario
 */
function getUserHobbies(userEmail, includeUserHobbies) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("vitomaite01", 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;

            // Acceder al objectStore "userHobby"
            const userHobbyStore = db.transaction("userHobby").objectStore("userHobby");
            const index = userHobbyStore.index("byEmail");
            const hobbyRequest = index.openCursor(IDBKeyRange.only(userEmail));

            const hobbyIds = [];
            hobbyRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    hobbyIds.push(cursor.value.hobbyId);
                    cursor.continue();
                } else {
                    // Una vez tengamos todos los hobbyIds, obtenemos los nombres
                    const hobbyStore = db.transaction("hobbies").objectStore("hobbies");
                    const allHobbies = [];
                    const userHobbies = [];

                    // Obtener todos los hobbies disponibles
                    const hobbyCursor = hobbyStore.openCursor();
                    hobbyCursor.onsuccess = (event) => {
                        const hobbyCursorResult = event.target.result;
                        if (hobbyCursorResult) {
                            allHobbies.push({ id: hobbyCursorResult.value.hobbyId, name: hobbyCursorResult.value.hobbyName });
                            hobbyCursorResult.continue();
                        } else {
                            // Filtrar los hobbies del usuario y los que no tiene
                            allHobbies.forEach(hobby => {
                                if (hobbyIds.includes(hobby.id)) {
                                    userHobbies.push(hobby); // Hobbies que el usuario tiene
                                }
                            });

                            // Si queremos los hobbies que el usuario tiene
                            if (includeUserHobbies) {
                                resolve(userHobbies);
                            } else {
                                // Si queremos los hobbies que el usuario no tiene
                                const nonUserHobbies = allHobbies.filter(hobby => !hobbyIds.includes(hobby.id));
                                resolve(nonUserHobbies);
                            }
                        }
                    };

                    hobbyCursor.onerror = () => {
                        reject("Error al obtener los hobbies.");
                    };
                }
            };

            hobbyRequest.onerror = () => {
                reject("Error al obtener los hobbies del usuario.");
            };
        };

        request.onerror = () => {
            reject("Error al abrir la base de datos.");
        };
    });
}
/*
 * Si addHobbies = true añade los hobbies pasados como parámetro
 * Si addHobbies = false elimina los hobbies pasados como parámetro
 */
function updateUserHobbies(userEmail, hobbies, addHobbies) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("vitomaite01", 1);

        request.onsuccess = (event) => {
            const db = event.target.result;

            // Acceder al objectStore "userHobby"
            const userHobbyStore = db.transaction("userHobby", "readwrite").objectStore("userHobby");

            if (addHobbies) {
                // Si addHobbies es true, añadimos los hobbies para el usuario
                hobbies.forEach(hobbyId => {
                    const hobbyRecord = {
                        email: userEmail,
                        hobbyId: hobbyId
                    };
                    const addRequest = userHobbyStore.add(hobbyRecord);
                    addRequest.onerror = () => {
                        reject("Error al añadir hobby para el usuario.");
                    };
                });
                resolve("Hobbies añadidos correctamente.");
            } else {
                // Si addHobbies es false, eliminamos los hobbies del usuario
                hobbies.forEach(hobbyId => {
                    const hobbyKey = IDBKeyRange.only(userEmail); // Usamos el email para buscar el hobby específico
                    const hobbyRequest = userHobbyStore.index("byEmail").openCursor(hobbyKey);
                    hobbyRequest.onsuccess = (event) => {
                        const cursor = event.target.result;
                        if (cursor) {
                            if (cursor.value.hobbyId === hobbyId) {
                                userHobbyStore.delete(cursor.primaryKey);
                            }
                            cursor.continue();
                        }
                    };
                    hobbyRequest.onerror = () => {
                        reject("Error al eliminar hobby para el usuario.");
                    };
                });
                resolve("Hobbies eliminados correctamente.");
            }
        };

        request.onerror = () => {
            reject("Error al abrir la base de datos.");
        };
    });
}