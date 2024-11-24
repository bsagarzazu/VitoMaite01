//YUYUAN
//editProfile.js
document.addEventListener("DOMContentLoaded", () => {
    const profilePhoto = document.getElementById("profile-photo");
    const profilePhotoInput = document.getElementById("profile-photo-input");
    const citySelect = document.getElementById("city");
    const acceptBtn = document.getElementById("accept-btn");
    const addHobbiesBtn = document.getElementById("add-hobbies-btn");
    const deleteHobbiesBtn = document.getElementById("delete-hobbies-btn");
    const hobbiesSelect = document.getElementById("hobbies");

    // Obtener los datos del usuario
    const usu = JSON.parse(sessionStorage.getItem("userLoggedIn"));
    if (!usu) {
        console.error("No hay datos de usuario en sessionStorage.");
        return;
    }

    // Inicializar la foto de perfil y la ciudad
    if (usu.imagen) {
        profilePhoto.src = "data:image/png;base64," + usu.imagen;
    } else {
        profilePhoto.src = "img/placeholder.jpg";  // Imagen por defecto si no hay
    }
    citySelect.value = usu.city || "Gasteiz";  // Establecer la ciudad actual

    // Cargar aficiones del usuario
    cargarAficiones(usu);

    // Mostrar el selector de foto de perfil al hacer clic en la imagen
    profilePhoto.addEventListener("click", () => {
        profilePhotoInput.click();
    });

    // Manejar la carga de una nueva imagen de perfil
    profilePhotoInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                profilePhoto.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Gestionar los cambios cuando se hace clic en "Aceptar"
    acceptBtn.addEventListener("click", () => {
        // Actualizar la foto y la ciudad en sessionStorage
        const newImage = profilePhoto.src.split(",")[1];  // Guardar solo la parte base64
        const newCity = citySelect.value;

        // Actualizar el objeto de usuario
        usu.imagen = newImage;
        usu.city = newCity;

        // Guardar los cambios en sessionStorage
        sessionStorage.setItem("userLoggedIn", JSON.stringify(usu));

        alert("Cambios guardados.");
    });

    // Añadir aficiones (botón "Añadir Aficiones")
    addHobbiesBtn.addEventListener("click", () => {
        // Mostrar una lista de aficiones disponibles para añadir (que no estén ya en el perfil)
        mostrarAñadirAficiones(usu);
    });

    // Eliminar aficiones (botón "Eliminar Aficiones")
    deleteHobbiesBtn.addEventListener("click", () => {
        // Mostrar una lista de aficiones actuales con checkboxes para eliminar
        mostrarEliminarAficiones(usu);
    });
});

function cargarAficiones(usu) {
    const hobbiesSelect = document.getElementById("hobbies");
    hobbiesSelect.innerHTML = "";  // Limpiar la lista actual de aficiones

    // Mostrar las aficiones actuales del usuario
    if (usu && usu.userHobby) {
        usu.userHobby.forEach((hobby) => {
            const option = document.createElement("option");
            option.value = hobby.hobbyId;
            option.textContent = hobby.hobbyName;
            hobbiesSelect.appendChild(option);
        });
    }
}

function mostrarAñadirAficiones(usu) {
    const availableHobbies = getAvailableHobbies(usu);

    if (availableHobbies.length > 0) {
        // Crear un modal o sección con las aficiones disponibles
        const addHobbiesSection = document.createElement("div");
        addHobbiesSection.innerHTML = "<h3>Añadir Aficiones</h3>";

        availableHobbies.forEach((hobby) => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = hobby.hobbyId;
            const label = document.createElement("label");
            label.textContent = hobby.hobbyName;

            const div = document.createElement("div");
            div.appendChild(checkbox);
            div.appendChild(label);

            addHobbiesSection.appendChild(div);
        });

        // Mostrar las aficiones disponibles en el DOM
        document.body.appendChild(addHobbiesSection);
        // Añadir un botón para confirmar la selección
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "Añadir seleccionadas";
        addHobbiesSection.appendChild(confirmBtn);

        confirmBtn.addEventListener("click", () => {
            const selectedHobbies = [];
            const checkboxes = addHobbiesSection.querySelectorAll("input[type='checkbox']:checked");
            checkboxes.forEach((checkbox) => {
                selectedHobbies.push(checkbox.value);
            });

            // Añadir las aficiones seleccionadas al perfil del usuario
            selectedHobbies.forEach((hobbyId) => {
                const hobby = availableHobbies.find((h) => h.hobbyId === hobbyId);
                if (hobby) {
                    usu.userHobby.push(hobby);
                }
            });

            sessionStorage.setItem("userLoggedIn", JSON.stringify(usu));
            alert("Aficiones añadidas.");
            location.reload();
        });
    } else {
        alert("No hay aficiones disponibles para añadir.");
    }
}

function mostrarEliminarAficiones(usu) {
    const hobbiesToDeleteSection = document.createElement("div");
    hobbiesToDeleteSection.innerHTML = "<h3>Eliminar Aficiones</h3>";

    if (usu && usu.userHobby) {
        usu.userHobby.forEach((hobby) => {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = hobby.hobbyId;
            const label = document.createElement("label");
            label.textContent = hobby.hobbyName;

            const div = document.createElement("div");
            div.appendChild(checkbox);
            div.appendChild(label);

            hobbiesToDeleteSection.appendChild(div);
        });

        // Mostrar las aficiones en el DOM
        document.body.appendChild(hobbiesToDeleteSection);
        // Añadir un botón para confirmar la eliminación
        const confirmDeleteBtn = document.createElement("button");
        confirmDeleteBtn.textContent = "Eliminar seleccionadas";
        hobbiesToDeleteSection.appendChild(confirmDeleteBtn);

        confirmDeleteBtn.addEventListener("click", () => {
            const selectedHobbies = [];
            const checkboxes = hobbiesToDeleteSection.querySelectorAll("input[type='checkbox']:checked");
            checkboxes.forEach((checkbox) => {
                selectedHobbies.push(checkbox.value);
            });

            // Eliminar las aficiones seleccionadas
            usu.userHobby = usu.userHobby.filter((hobby) => !selectedHobbies.includes(hobby.hobbyId));
            sessionStorage.setItem("userLoggedIn", JSON.stringify(usu));

            alert("Aficiones eliminadas.");
            location.reload();
        });
    } else {
        alert("No tienes aficiones para eliminar.");
    }
}

function getAvailableHobbies(usu) {
    // Obtener todas las aficiones disponibles que no están en el perfil del usuario
    const allHobbies = [
        { hobbyId: 1, hobbyName: "Fútbol" },
        { hobbyId: 2, hobbyName: "Ciclismo" },
        { hobbyId: 3, hobbyName: "Lectura" },
        { hobbyId: 4, hobbyName: "Música" },
    ];

    // Filtrar las aficiones que el usuario ya tiene
    const availableHobbies = allHobbies.filter((hobby) => {
        return !usu.userHobby.some((uh) => uh.hobbyId === hobby.hobbyId);
    });

    return availableHobbies;
}
