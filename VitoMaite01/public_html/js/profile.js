//YUYUAN
//profile.js
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente cargado");

    // Obtener el usuario desde el sessionStorage
    const user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
    console.log("Usuario cargado:", user);

    // Verifica si el usuario está logueado
    if (user) {
        updateProfile(user);
    } else {
        console.error("Faltan datos del usuario.");
    }
});

// Función para actualizar el perfil con la información del usuario
async function updateProfile(user) {
    console.log("Actualizando perfil con:", user);
    updateProfileFields(user);

    // Obtener y mostrar los hobbies del usuario
    const hobbies = await getUserHobbies(user.email);
    displayHobbies(hobbies);
}

// Función para actualizar los campos del perfil
function updateProfileFields(user) {
    document.getElementById("profile-photo").src = "data:image/png;base64," + (user.image || "") || "img/placeholder.jpg";
    document.getElementById("profile-name").textContent = "Nombre: " + user.nick;
    document.getElementById("profile-gender").textContent = "Género: " + (user.gender === 'H' ? "Hombre" : "Mujer");
    document.getElementById("profile-city").textContent = "Ciudad: " + user.city;
    document.getElementById("profile-age").textContent = "Edad: " + user.age;
}

// Función para mostrar los hobbies del usuario
function displayHobbies(hobbies) {
    if (hobbies && hobbies.length > 0) {
        document.getElementById("hobbies").textContent = "Aficiones: " + hobbies.join(", ");
    } else {
        document.getElementById("hobbies").textContent = "Aficiones: No especificadas";
    }
}

// Función para obtener los hobbies del usuario desde IndexedDB
function getUserHobbies(userEmail) {
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
                    // Una vez tengamos todos los hobbyIds, buscamos los nombres en el objectStore "hobbies"
                    getHobbyNames(hobbyIds, db, resolve);
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

// Función para obtener los nombres de los hobbies utilizando los IDs
function getHobbyNames(hobbyIds, db, resolve) {
    const hobbyStore = db.transaction("hobbies").objectStore("hobbies");
    const hobbyNames = [];

    hobbyIds.forEach((hobbyId) => {
        const hobbyRequest = hobbyStore.get(hobbyId);
        hobbyRequest.onsuccess = (event) => {
            const hobby = event.target.result;
            if (hobby) {
                hobbyNames.push(hobby.hobbyName);
            }

            // Resolver cuando todos los hobbies estén cargados
            if (hobbyNames.length === hobbyIds.length) {
                resolve(hobbyNames);
            }
        };
    });
}