//YUYUAN
//profile.js

document.addEventListener("DOMContentLoaded", function () {
    const usu = JSON.parse(sessionStorage.getItem("userLoggedIn"));
    console.log(usu); // Verifica si el objeto contiene los datos correctamente
    if (!usu) {
        console.error("No se encontró el usuario en sessionStorage.");
        return;
    }

    if (usu && usu.imagen && usu.nick && usu.gender && usu.city && usu.age && usu.userHobby && usu.hobbyNames) {
        updateProfile();
    } else {
        console.error("Faltan datos del usuario.");
    }
    
    const editBtn = document.getElementById("edit-btn");
    editBtn.addEventListener("click", function () {
        window.location.href = "edit.html";
    });
    
// Función para actualizar el perfil
    function updateProfile() {
        // Actualizar los campos con la información del usuario
        document.getElementById("profile-photo").src = usu.imagen;
        document.getElementById("profile-name").textContent = "Nombre: " + usu.nick;
        document.getElementById("profile-gender").textContent = "Género: " + usu.gender;
        document.getElementById("profile-city").textContent = "Ciudad: " + usu.city;
        document.getElementById("profile-age").textContent = "Edad: " + usu.age;
        document.getElementById("profile-hobbies").textContent = "Aficiones: " + getUserHobbies(usu.email);
    }


    function getUserHobbies(userEmail) {
// Filtrar los hobbies del usuario por su email
        const userHobbies = usu.userHobby.filter(uh => uh.userEmail === userEmail);
        // Mapear los hobbyId a los nombres de los hobbies
        const hobbyIds = userHobbies.map(uh => uh.hobbyId);
        // Buscar los nombres de los hobbies en hobbyNames
        const userHobbyNames = hobbyIds.map(id => {
            return usu.hobbyNames.find(hobby => usu.hobbyNames.indexOf(hobby) === id - 1)?.hobbyName;
        });
        return userHobbyNames;
    }
});
