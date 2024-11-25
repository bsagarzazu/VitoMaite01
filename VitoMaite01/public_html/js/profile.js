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
        gender.textContent = "Nombre: " + user.nick;
        city.textContent = "Nombre: " + user.nick;
        age.textContent = "Nombre: " + user.nick;
        
        displayHobbies(getUserHobbies(user.email));
    }
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