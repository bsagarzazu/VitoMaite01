document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn2");

    loginBtn.addEventListener("click", function () {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        let isValid = true;
        let errorMessage = "";

        // Validar campos
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailRegex.test(email)) {
            isValid = false;
            errorMessage += 'Ingresa un email válido.\n';
        }
        if (!password) {
            isValid = false;
            errorMessage += 'Introduce la contraseña.\n';
        }
        if (!isValid) {
            event.preventDefault();
            alert(errorMessage);
        }

        // Comprobar contra la base de datos
        if (isValid) {
            checkLogin(email, password) // no puedo hacer user = checkLogin() porque aunque no salga bien tiene valor
                    .then((user) => {
                        sessionStorage.setItem("userLoggedIn", JSON.stringify(user));
                        window.location.href = "index.html";
                    });
        }
    });
});

function checkLogin(email, password) {
    return new Promise((resolve, reject) => {
        // Abrir la base de datos
        const request = window.indexedDB.open("vitomaite01", 1);

        request.onerror = (event) => {
            console.error(`An error occurred during database opening: ${event.target.error?.message}`);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            console.log("Database opened successfully");
            const db = event.target.result;

            // Iniciar una transacción solo de lectura
            const transaction = db.transaction(["users"], "readonly");
            const objStoreUsers = transaction.objectStore("users");

            // Usar el índice "byEmail" para buscar por correo electrónico
            const userRequest = objStoreUsers.index("byEmail").openCursor(IDBKeyRange.only(email));

            userRequest.onsuccess = (event) => {
                const cursor = event.target.result;

                if (cursor) {
                    // Si encontramos el usuario, validamos la contraseña
                    const user = cursor.value;

                    if (user.password === password) {
                        console.log("Login successful");
                        resolve(user); // Resolvemos con el usuario si las credenciales son correctas
                    } else {
                        console.log("Invalid password");
                        alert("Contraseña incorrecta.");
                        reject("Invalid password"); // Rechazamos si la contraseña es incorrecta
                    }
                } else {
                    console.log("User not found");
                    alert("No existe una cuenta con esa dirección de correo.")
                    reject("User not found"); // Rechazamos si no encontramos el usuario
                }
            };

            userRequest.onerror = (event) => {
                console.error(`Error while iterating users: ${event.target.error?.message}`);
                reject(event.target.error);
            };
        };
    });
}