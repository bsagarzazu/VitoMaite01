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