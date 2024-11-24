//YUYUAN
//profile.js

document.addEventListener("DOMContentLoaded", async function () {
    console.log("DOM completamente cargado");  // Verifica si esto se imprime en la consola
    const usu = JSON.parse(sessionStorage.getItem("userLoggedIn"));
    console.log("Usuario cargado: ", usu);

    if (usu) {
        await updateProfile();
    } else {
        console.error("Faltan datos del usuario.");
    }

    const editBtn = document.getElementById("edit-profile-btn");
    editBtn.addEventListener("click", function () {
        window.location.href = "edit.html";
    });

    // Función para actualizar el perfil
    async function updateProfile(usu) {
        console.log("Actualizando perfil con:", usu);
        // Actualizar los campos con la información del usuario
        //document.getElementById("profile-photo").src = "data:image/png;base64," + usu.imagen || "img/placeholder.jpg";
        document.getElementById("profile-photo").src = "data:image/png;base64," + (usu.imagen || "") || "img/placeholder.jpg";
        document.getElementById("profile-name").textContent = "Nombre: " + usu.nick;
        document.getElementById("profile-gender").textContent = "Género: " + usu.gender;
        document.getElementById("profile-city").textContent = "Ciudad: " + usu.city;
        document.getElementById("profile-age").textContent = "Edad: " + usu.age;
        
        // Cargar los hobbies desde IndexedDB
        const hobbies = await getUserHobbies(usu.email);
        console.log("Hobbies: ", hobbies);
        document.getElementById("profile-hobbies").textContent = "Aficiones: " + hobbies.join(", ");
    }


    // Función asincrónica para obtener los hobbies del usuario desde IndexedDB
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

    // Función para obtener los nombres de los hobbies usando los IDs
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
});
