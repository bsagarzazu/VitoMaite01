document.addEventListener("DOMContentLoaded", (event) => {
    const request = window.indexedDB.open("vitomaite01", 1);

    request.onsuccess = (event) => {
        const db = event.target.result;
        
        const users = JSON.parse(sessionStorage.getItem("searchResults"));
        
        // Ordenar por edad en orden ascendente
        users.sort((u1, u2) => u1.age - u2.age);
        
        displaySearchResults(users);
        
        const closeModalBtn = document.getElementById("close-btn");
        closeModalBtn.addEventListener("click", (event) => {
            const modal = document.getElementById("profile-modal");
            modal.style.display = "none";
        });
        
    };
});

function displaySearchResults(users) {
    const resultsDiv = document.getElementById("result-list");
    resultsDiv.innerHTML = "";

    users.forEach((user) => {
        const profileDiv = document.createElement("div");
        profileDiv.className = "profile";
        // TODO: display the actual image
        
        /**const usrImage = getImageFor(user);
        
        profileDiv.innerHTML = `
            <div class="profile-img">
                <img src="img/icon.png">
            </div>
            <div id="name-age">
                <p><span class="name">${user.nick}</span>  ${user.age}</p>
            </div>
        `;*/
        
        // Imagen de usuario
        const profileImageDiv = document.createElement("div");
        profileImageDiv.className = "profile-img";
        
        const imgElement = document.createElement("img");
        setImageFor(user, imgElement);
        profileImageDiv.appendChild(imgElement);
        
        // Bloque de nombre y edad
        const nameAgeDiv = document.createElement("div");
        nameAgeDiv.id = "name-age";
        const nameAgePara = document.createElement("p");
        nameAgePara.innerHTML = `&nbsp<span class="name">   ${user.nick}</span>  ${user.age}`;
        nameAgeDiv.appendChild(nameAgePara);
        
        // Añadirlo todo al perfil
        profileDiv.appendChild(profileImageDiv);
        profileDiv.appendChild(nameAgeDiv);
        
        // Show profile info when clicked
        if(sessionStorage.getItem("userLoggedIn")) {
            profileDiv.addEventListener("click", () => showProfile(user));
        }
        else {
            profileDiv.addEventListener("click", () => window.location.href = "login.html");
        }
        
        resultsDiv.appendChild(profileDiv);
    });
}

function setImageFor(user, imgElement) {
    if(user.image !== "") {
        if(!sessionStorage.getItem("userLoggedIn")) {
            imgElement.src = "data:image/png;base64," + user.image;
            imgElement.className = "blurred";
        }
        else {
            imgElement.src = "data:image/png;base64," + user.image;
        }
    }
    else {
        imgElement.src = "img/black.png";
    }
}

function showProfile(user) {
    // Display info
    const profileDetails = document.getElementById("profile-details");
    
    profileDetails.innerHTML = `
        <h2><strong>${user.nick}</strong></h2>
        <h4><strong>${user.gender === "H" ? "Hombre" : "Mujer"}</strong></h4>
        <p><strong>Edad:</strong> ${user.age}</p>
        <p><strong>Ciudad:</strong> ${user.city}</p>
    `;

    profileDetails.innerHTML += '<label for="div-aficiones"><strong>Aficiones:</strong></p>';
    profileDetails.innerHTML += '<div id="div-aficiones" class="aficiones-modal"></div>';
    showHobbyNames(user, profileDetails);
    
    // TODO: establecer la imagen
    const modalProfileImg = document.getElementById("modal-profile-img");
    setImageFor(user, modalProfileImg);

    const modal = document.getElementById("profile-modal");
    modal.style.display = "flex";
}

function getUserHobbies(user) {
    return new Promise((resolve, reject) => {
        // Open db
        const request = window.indexedDB.open("vitomaite01", 1);
            
        request.onsuccess = (event) => {
            const db = event.target.result;
            
            // Get every hobby id of this user
            const transaction = db.transaction(["userHobby"], "readonly");
            const objStore = transaction.objectStore("userHobby");

            const index = objStore.index("byEmail");
            const cursorRequest = index.openCursor(IDBKeyRange.only(user.email));

            const hobbyIds = [];

            cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if(cursor) {
                    hobbyIds.push(cursor.value.hobbyId);
                    cursor.continue();
                }
                else {
                    // Resolve if there are no more hobby ids
                    resolve(hobbyIds);
                }
            };

            request.onerror = (event) => {
                reject("Error while getting user hobbies: " + event.target.error);
            };
        };
    });
}

function getHobbyNames(hobbyIds) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("vitomaite01", 1);
            
        request.onsuccess = (event) => {
            const db = event.target.result;
            
            const transaction = db.transaction(["hobbies"], "readonly");
            const objStore = transaction.objectStore("hobbies");
            const index = objStore.index("byHobbyId");

            const hobbyNames = [];

            // Request for each hobby
            let processedHobbies = 0;
            hobbyIds.forEach((hobbyId) => {
                const request = index.get(hobbyId);

                request.onsuccess = (event) => {
                    const hobby = event.target.result;
                    if(hobby) {
                        hobbyNames.push(hobby.hobbyName);
                    }

                    processedHobbies++;

                    // Resolve when every hobby has been processed
                    if(processedHobbies === hobbyIds.length) {
                        resolve(hobbyNames);
                    }
                };

                request.onerror = (event) => {
                    reject(`Error getting hobby name for hobbyId ${hobbyId}: ${event.target.error}`);
                };
            });
        };
            
    });
}

function showHobbyNames(user, profileDetails) {
    getUserHobbies(user)
        .then((hobbyIds) => {
            return getHobbyNames(hobbyIds);
        })
        .then((hobbyNames) => {
            const hobbyDiv = profileDetails.querySelector("div");
            
            // Clear its content
            hobbyDiv.innerHTML = "";
            
            const ul = document.createElement("ul");
            hobbyNames.forEach((hobbyName) => {
                const li = document.createElement("li");
                li.textContent = hobbyName;
                ul.appendChild(li);
            });
            
            hobbyDiv.appendChild(ul);
        })
        .catch((error) => {
           console.log("Error:", error); 
        });
}