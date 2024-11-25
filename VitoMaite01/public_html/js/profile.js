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

    if (sessionStorage.getItem("userLoggedIn")) {
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

// Mostrar el modal para seleccionar una imagen
    const editPhotoBtn = document.getElementById("editPhoto-btn");
    editPhotoBtn.addEventListener("click", function () {
        const modal = document.getElementById("edit-photo-modal");
        modal.style.display = "block";
    });

// Cerrar el modal de editar foto
    document.getElementById("edit-photo-close-btn").addEventListener("click", function () {
        const modal = document.getElementById("edit-photo-modal");
        modal.style.display = "none";
    });

// Aceptar cambios de la foto y cerrarla
    document.getElementById("accept-photo-changes-btn").addEventListener("click", function () {
        const modal = document.getElementById("edit-photo-modal");
        modal.style.display = "none";
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
                            allHobbies.push({id: hobbyCursorResult.value.hobbyId, name: hobbyCursorResult.value.hobbyName});
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

/*
 * Si isCity es true cambia la ciudad por data
 * Si isCity es false cambia la imagen por date
 */
function updateUserData(email, data, isCity) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("vitomaite01", 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            // Acceder al objectStore "users" que contiene los datos de los usuarios
            const userStore = db.transaction("users", "readwrite").objectStore("users");

            // Crear la clave de búsqueda para el índice por email
            const index = userStore.index("byEmail");
            const userRequest = index.get(email); // Buscar el usuario por email

            userRequest.onsuccess = (event) => {
                const user = event.target.result;

                if (user) {
                    if (isCity) {
                        // Si isCity es true, actualizamos la ciudad
                        user.city = data;
                    } else {
                        // Si isCity es false, actualizamos la imagen (Base64)
                        user.image = data;
                    }

                    // Actualizamos el objeto usuario con los nuevos datos
                    const updateRequest = userStore.put(user);

                    updateRequest.onsuccess = () => {
                        resolve("Usuario actualizado correctamente.");
                    };

                    updateRequest.onerror = () => {
                        reject("Error al actualizar el usuario.");
                    };
                } else {
                    reject("Usuario no encontrado.");
                }
            };

            userRequest.onerror = () => {
                reject("Error al buscar el usuario.");
            };
        };

        request.onerror = () => {
            reject("Error al abrir la base de datos.");
        };
    });
}

//Funciones de modificar la foto
// Función para cargar la imagen desde la base de datos y mostrarla en el perfil
function loadProfileImage(email) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("vitomaite01", 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const userStore = db.transaction("users", "readonly").objectStore("users");
            const index = userStore.index("byEmail");
            const userRequest = index.get(email);

            userRequest.onsuccess = (event) => {
                const user = event.target.result;

                if (user && user.image) {
                    // Si existe una imagen guardada, actualizar la etiqueta <img> con la imagen
                    const profilePhotoElement = document.getElementById("profile-photo");
                    profilePhotoElement.src = user.image; // Actualiza la fuente de la imagen con Base64
                    resolve("Imagen cargada correctamente.");
                } else {
                    reject("No se encontró imagen para este usuario.");
                }
            };

            userRequest.onerror = () => {
                reject("Error al buscar el usuario.");
            };
        };

        request.onerror = () => {
            reject("Error al abrir la base de datos.");
        };
    });
}

// Función para gestionar la carga de la imagen desde el archivo
document.getElementById("profileImageInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onloadend = function () {
            const base64Image = reader.result; // Obtener la imagen en Base64
            const email = "user@example.com"; // Cambiar esto por el email del usuario autenticado

            // Usamos la función updateUserData para guardar la imagen
            updateUserData(email, base64Image, false) // Actualizamos la imagen (isCity = false)
                    .then(() => {
                        console.log("Imagen guardada correctamente.");
                        loadProfileImage(email); // Volver a cargar la imagen del perfil
                    })
                    .catch((error) => {
                        console.error("Error al guardar la imagen:", error);
                    });
        };

        reader.onerror = function () {
            console.error("Error al leer la imagen.");
        };

        // Lee el archivo de imagen como URL de datos (Base64)
        reader.readAsDataURL(file);
    }
});