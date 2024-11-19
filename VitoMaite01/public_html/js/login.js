//BEÑAT
// login.js
document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");

    loginBtn.addEventListener("click", function () {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        let isValid = true;
        let errorMessage = "";

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailRegex.test(email)) {
            isValid = false;
            errorMessage += 'Ingresa un correo válido.\n';
        }

        if (!password) {
            isValid = false;
            errorMessage += 'Introduce la contraseña.\n';
        }

        if (isValid) {
            user = checkLogin(email, password);
            if (user !== null) {
                sessionStorage.setItem("userLoggedIn", JSON.stringify(user));
                window.location.href = "index.html";
            }
        } else {
            alert("Por favor ingresa un correo y una contraseña válidos.");
        }
    });
});

function checkLogin(email, password) {
    let request = window.indexedDB.open("vitomaite01", 1);

    let db;
    request.onsucces = (event) => {
        db = event.target.result;
    };
    const transaction = db.transaction(['users'], 'readonly');
    const objectStore = transaction.objectStore('users');

    request = objectStore.get(email);

    request.onsucces = function (event) {
        const user = event.target.result;
        if (user.email) {
            console.log("User found: ", user.email);
            if (user.password === password) {
                console.log("Correct password");
                return user;
            } else {
                console.log("Incorrect password");
            }
        } else {
            console.log("User not found");
        }
    };
    return null;
    request.onerror = (event) => {
        console.error("An error occurred during database opening: ${event.target.error?.message}");
    };
}
