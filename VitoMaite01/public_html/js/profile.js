document.addEventListener("DOMContentLoaded", function () {
    const profile = document.getElementById("profile-photo");
    const name = document.getElementById("profile-name");
    const gender = document.getElementById("profile-gender");
    const city = document.getElementById("profile-city");
    const age = document.getElementById("profile-age");
    
    if(sessionStorage.getItem("userLoggedIn")) {
        const user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
        
        profile.src = "data:image/png;base64," + (user.image || "") || "img/placeholder.jpg";
        name.textContent = "Nombre: " + user.nick;
        gender.textContent = "Género: " + user.gender;
        city.textContent = "Ciudad: " + user.city;
        age.textContent = "Edad: " + user.age;
        
        displayHobbies(getUserHobbies(user.email));
    }
    
    const editHobbiesBtn = document.getElementById("editHobbies-btn");
    editHobbiesBtn.addEventListener("click", (event) => {
        const editHobbiesModal = document.getElementById("edit-hobbies-modal");
        editHobbiesModal.style.display = "flex";
    });
});

function displayHobbies(hobbies) {
    if (hobbies && hobbies.length > 0) {
        document.getElementById("hobbies").textContent = "Aficiones: " + hobbies.join(", ");
    } else {
        document.getElementById("hobbies").textContent = "Aficiones: No especificadas";
    }
}

function getUserHobbies(userEmail, includeUserHobbies = true) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("vitomaite01", 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;

            // Acceder al objectStore "userHobby"
            const userHobbyStore = db.transaction("userHobby").objectStore("userHobby");
            const index = userHobbyStore.index("byEmail");

            // Excluir el userEmail (utilizamos IDBKeyRange.bound para obtener todo menos el userEmail)
            const hobbyRequest = index.openCursor(IDBKeyRange.bound(null, userEmail, false, true));

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