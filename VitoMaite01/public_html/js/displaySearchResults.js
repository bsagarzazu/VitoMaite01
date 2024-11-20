document.addEventListener("DOMContentLoaded", (event) => {
    const request = window.indexedDB.open("vitomaite01", 1);

    request.onsuccess = (event) => {
        const db = event.target.result;
        
        const users = [
            {email: "inigo4592@gmail.com", password: "a3f1g2k8", nick: "Iñigo", city: "Donostia", age: 34, gender: "H", latitde: 0, longitude: 0, image: ""},
            {email: "ane7281@gmail.com", password: "w8d4k1j3", nick: "Ane", city: "Vitoria", age: 26, gender: "M", latitde: 0, longitude: 0,  image: ""},
            {email: "jon6328@gmail.com", password: "t4k9f1d8", nick: "Jon", city: "Bilbo", age: 41, gender: "H", latitde: 0, longitude: 0,  image: ""},
            {email: "nerea9104@gmail.com", password: "g2h8k3l7", nick: "Nerea", city: "Donostia", age: 41, gender: "M", latitde: 0, longitude: 0,  image: ""},
            {email: "markel2845@gmail.com", password: "z9r3h2k1", nick: "Markel", city: "Vitoria", age: 50, gender: "H", latitde: 0, longitude: 0,  image: ""},
            {email: "amaia1738@gmail.com", password: "p8q2d3k6", nick: "Amaia", city: "Bilbo", age: 31, gender: "M", latitde: 0, longitude: 0,  image: ""},
            {email: "aitor3871@gmail.com", password: "k2l7q8h4", nick: "Aitor", city: "Donostia", age: 47, gender: "H", latitde: 0, longitude: 0,  image: ""},
            {email: "maite5824@gmail.com", password: "b7n4j3k9", nick: "Maite", city: "Vitoria", age: 22, gender: "M", latitde: 0, longitude: 0,  image: ""},
            {email: "ander4910@gmail.com", password: "n5h8r2k3", nick: "Ander", city: "Bilbo", age: 36, gender: "H", latitde: 0, longitude: 0,  image: ""},
            {email: "leire8937@gmail.com", password: "q9k2p1g4", nick: "Leire", city: "Donostia", age: 27, gender: "M", latitde: 0, longitude: 0,  image: ""},
            {email: "unai1427@gmail.com", password: "w6f9k3r2", nick: "Unai", city: "Vitoria", age: 60, gender: "H", latitde: 0, longitude: 0,  image: ""},
            {email: "miren3478@gmail.com", password: "t3j2k9h8", nick: "Miren", city: "Bilbo", age: 33, gender: "M", latitde: 0, longitude: 0,  image: ""},
            {email: "mikel2593@gmail.com", password: "q4p8k1r7", nick: "Mikel", city: "Donostia", age: 44, gender: "H", latitde: 0, longitude: 0,  image: ""},
            {email: "irati6725@gmail.com", password: "z1h9l3k8", nick: "Irati", city: "Vitoria", age: 21, gender: "M", latitde: 0, longitude: 0,  image: ""},
            {email: "asier8034@gmail.com", password: "b2k7g3r9", nick: "Asier", city: "Bilbo", age: 39, gender: "H", latitde: 0, longitude: 0,  image: ""},
            {email: "uxue5367@gmail.com", password: "p3h4k8r2", nick: "Uxue", city: "Donostia", age: 25, gender: "M", latitde: 0, longitude: 0,  image: ""}
        ];
        
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
        nameAgePara.innerHTML = `<span class="name">${user.nick}</span>  ${user.age}`;
        nameAgeDiv.appendChild(nameAgePara);
        
        // Añadirlo todo al perfil
        profileDiv.appendChild(profileImageDiv);
        profileDiv.appendChild(nameAgeDiv);
        
        // Show profile info when clicked
        profileDiv.addEventListener("click", () => showProfile(user));
        
        resultsDiv.appendChild(profileDiv);
    });
}

/**function getImageFor(user) {
    if(!sessionStorage.getItem("userLoggedIn")) {
        // Devolver una imagen difuminada si tiene imagen, si no en negro
        return user.image ? blurredImage(user.image) : "img/black.png";
    }
    return user.image ? decodeImage(user.image) : "img/black.png";
}**/

function setImageFor(user, imgElement) {
    if(user.image) {
        if(!sessionStorage.getItem("userLoggedIn")) {
            imgElement.src = user.image;
            imgElement.className = "blurred";
        }
        else {
            imgElement.src = user.image;
        }
    }
    else {
        imgElement.src = "img/icon.png";
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
    // aficiones-modal: width: 80% o asi, contiene una ul
    if(sessionStorage.getItem("userLoggedIn")) {
        profileDetails.innerHTML += '<label for="div-aficiones"><strong>Aficiones:</strong></p>';
        profileDetails.innerHTML += '<div id="div-aficiones" class="aficiones-modal"></div>';
        showHobbyNames(user, profileDetails);
    }
    
    // TODO: establecer la imagen
            


    /**Object.entries(userData).forEach(([key, value]) => {
        console.log(key, value);
        //profileDetails.innerHTML += `<p><strong>${capitalized(key)}:</strong> ${value}</p>`;
    });**/

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