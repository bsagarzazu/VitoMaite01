document.addEventListener("DOMContentLoaded", function () {
    const logo = document.getElementById("logo");
    const loginBtn = document.getElementById("login-btn");
    const hobbiesBtn = document.getElementById("hobbies-btn");
    const mapBtn = document.getElementById("map-btn");
    const likesBtn = document.getElementById("likes-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const profileBtn = document.getElementById("view-profile-btn");
    const userInfo = document.getElementById("user-info");
    const userLogged = document.getElementById("user-logged");
    const userGuest = document.getElementById("user-guest");
    const userAvatar = document.getElementById("user-avatar");
    const usernameSpan = document.getElementById("username");
    const userGreeting = document.getElementById("hello-user");


    // Verifica si el usuario está logueado
    if (sessionStorage.getItem("userLoggedIn")) {
        const user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
        userLogged.style.display = "flex";
        userGuest.style.display = "none";
        userAvatar.src = (user.image && !user.image.startsWith("data:image/png;base64,"))
                ? "data:image/png;base64," + user.image
                : user.image || "img/placeholder.jpg";
        usernameSpan.textContent = user.nick;
        userGreeting.textContent = "Hola, " + user.nick;

        // Mostrar el botón de logout
        logoutBtn.addEventListener("click", function () {
            sessionStorage.removeItem("userLoggedIn");
            window.location.href = "index.html";
        });

    } else {
        userLogged.style.display = "none";
        userGuest.style.display = "flex";
    }

    loginBtn.addEventListener("click", function () {
        window.location.href = "login.html";
    });

    profileBtn.addEventListener("click", function () {
        window.location.href = "profile.html";
    });

    mapBtn.addEventListener("click", function () {
        window.location.href = "map.html";
    });

    hobbiesBtn.addEventListener("click", function () {
        window.location.href = "hobbies.html";
    });

    likesBtn.addEventListener("click", function () {
        displayLikesWindow();
    });

    logo.addEventListener("click", function () {
        window.location.href = "index.html";
    });
});

function displayLikesWindow() {
    const likesModal = document.getElementById("likes-profile-modal");

    const closeBtn = document.getElementById("likes-close-btn");
    closeBtn.addEventListener("click", () => {
        likesModal.style.display = "none";
    });

    const likesDiv = document.getElementById("likes");
    likesDiv.innerHTML = "";
    displayData(likesDiv);

    likesModal.style.display = "flex";
}

function displayData(likesDiv) {
    const loggedUser = JSON.parse(sessionStorage.getItem("userLoggedIn"));

    getLikes(loggedUser.email)
            .then((likes) => {
                // TODO: meterlo en el siguiente .then
                return getUsers(likes);
            })
            .then((users) => {
                const likedBy = users.likes;
                const matches = users.matches;

                // Primero se muestran los matches
                matches.forEach((match) => {
                    const matchDiv = document.createElement("div");
                    matchDiv.className = "likes-profile";
                    matchDiv.innerHTML = `
                    <p><span class="name">${match.nick}</span>  ${match.age}  <img class="match-img" src="img/heart_match.png"></p>
                `;
                    likesDiv.appendChild(matchDiv);
                });

                likedBy.forEach((like) => {
                    const likeDiv = document.createElement("div");
                    likeDiv.className = "likes-profile";
                    likeDiv.innerHTML = `
                    <p><span class="name">${like.nick}</span>  ${like.age}</p>
                `;
                    likesDiv.appendChild(likeDiv);
                });
            });
}

function getLikes(userEmail) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("vitomaite01", 1);

        request.onerror = (event) => {
            console.log(`Error opening database: ${event.target.error?.message}`);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const likedBy = {likes: [], matches: []};

            const transaction = db.transaction(["likes"], "readonly");
            const objStore = transaction.objectStore("likes");
            const index = objStore.index("byEmail1");

            const likedUsersPromise = new Promise((resolve, reject) => {
                const likedUsers = index.get(userEmail);
                likedUsers.onsuccess = (event) => {
                    resolve(event.target.result);
                };
            });

            const getAllPromise = new Promise((resolve, reject) => {
                const getAllRequest = objStore.getAll();
                getAllRequest.onsuccess = (event) => {
                    resolve(event.target.result);
                };
            });

            Promise.all([likedUsersPromise, getAllPromise])
                    .then((values) => {
                        const likedUsers = values[0];
                        const allValues = values[1];
                        // Para cada valor en allValues, mirar si email2 coincide con parámetro
                        // Sí -> mirar si email1 está en likedUsers
                        allValues.forEach((value) => {
                            // Cada valor: (email1, email2)
                            if (value.email2 === userEmail) {
                                // Comprobar si está en likedUsers
                                if (search(value.email1, likedUsers)) {
                                    likedBy.matches.push(value.email1);
                                } else {
                                    likedBy.likes.push(value.email1);
                                }
                            }
                        });
                        resolve(likedBy);
                    });
        };
    });
}

function search(email, list) {
    if (list.length === 1 || !Array.isArray(list)) {
        return email === list.email2;
    }

    for (let i = 0; i < list.length; i++) {
        if (email === list[i].email2) {
            return true;
        }
    }
    return false;
}

function getUsers(likedBy) {
    const users = {likes: [], matches: []};

    // Esperar a que se cumplan las promesas de cada usuario
    const likesPromises = likedBy.likes.map((email) => getUser(email));
    const matchesPromises = likedBy.matches.map((email) => getUser(email));

    return Promise.all([Promise.all(likesPromises), Promise.all(matchesPromises)])
            .then(([likes, matches]) => {
                users.likes = likes;
                users.matches = matches;
                return users;
            });
}

function getUser(email) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("vitomaite01", 1);

        request.onerror = (event) => {
            console.log(`Error opening database: ${event.target.error?.message}`);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;

            const index = db
                    .transaction(["users"], "readonly")
                    .objectStore("users")
                    .index("byEmail");

            const getRequest = index.get(email);
            getRequest.onsuccess = (event) => {
                resolve(event.target.result);
            };
        };
    });
}