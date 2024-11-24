//YUYUAN
//editProfile.js
document.addEventListener("DOMContentLoaded", () => {
    const dbRequest = window.indexedDB.open("vitomaite01", 1);

    // Variables para interactuar con los elementos HTML
    const profileImageContainer = document.getElementById("profileImageContainer");
    const profileImageInput = document.getElementById("profileImageInput");
    const citySelect = document.getElementById("city");
    const deleteHobbySelect = document.getElementById("deleteHobbySelect");
    const addHobbySelect = document.getElementById("addHobbySelect");
    const deleteHobbiesBtn = document.getElementById("deleteHobbiesBtn");
    const addHobbiesBtn = document.getElementById("addHobbiesBtn");
    const acceptChangesBtn = document.getElementById("acceptChangesBtn");

    let db;

    dbRequest.onsuccess = (event) => {
        db = event.target.result;
        loadUserProfile(); // Cargar los datos del perfil
        loadHobbies(); // Cargar las aficiones
    };

    // Si la base de datos necesita ser actualizada (primer uso)
    dbRequest.onupgradeneeded = (event) => {
        db = event.target.result;
    };

    // Función para cargar los datos de perfil
    function loadUserProfile() {
        const transaction = db.transaction(["users", "userHobby"], "readonly");
        const usersStore = transaction.objectStore("users");
        const userHobbyStore = transaction.objectStore("userHobby");

        const userRequest = usersStore.get("user@example.com"); // Asume que el email es 'user@example.com'

        userRequest.onsuccess = () => {
            const user = userRequest.result;
            if (user) {
                // Mostrar foto de perfil si existe
                if (user.photo) {
                    const img = new Image();
                    img.src = URL.createObjectURL(user.photo);
                    profileImageContainer.innerHTML = "";
                    profileImageContainer.appendChild(img);
                }

                // Mostrar ciudad actual en el select
                citySelect.value = user.city || "";
            }
        };
    }

    // Función para cargar las aficiones del usuario
    function loadHobbies() {
        const transaction = db.transaction(["hobbies", "userHobby"], "readonly");
        const hobbyStore = transaction.objectStore("hobbies");
        const userHobbyStore = transaction.objectStore("userHobby");

        const hobbyRequest = hobbyStore.getAll();
        hobbyRequest.onsuccess = () => {
            const allHobbies = hobbyRequest.result;
            const userHobbies = [];

            // Obtener las aficiones del usuario
            const userHobbyRequest = userHobbyStore.index("byEmail").getAll("user@example.com"); // Asume que el email es 'user@example.com'
            userHobbyRequest.onsuccess = () => {
                const userHobbyList = userHobbyRequest.result;
                userHobbyList.forEach(item => {
                    userHobbies.push(item.hobbyId);
                });

                // Poner las aficiones disponibles en el "Añadir"
                allHobbies.forEach(hobby => {
                    if (!userHobbies.includes(hobby.hobbyId)) {
                        const option = document.createElement("option");
                        option.value = hobby.hobbyId;
                        option.textContent = hobby.name;
                        addHobbySelect.appendChild(option);
                    }
                });

                // Poner las aficiones del usuario en el "Eliminar"
                userHobbyList.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.hobbyId;
                    option.textContent = `Hobby: ${item.hobbyId}`; // Puedes cambiar esto por el nombre de la afición
                    deleteHobbySelect.appendChild(option);
                });
            };
        };
    }

    // Función para manejar el drag-and-drop de la foto de perfil
    profileImageContainer.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    profileImageContainer.addEventListener("drop", (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            displayImage(file);
            saveImage(file);
        }
    });

    profileImageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            displayImage(file);
            saveImage(file);
        }
    });

    function displayImage(file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        profileImageContainer.innerHTML = ""; // Limpiar texto
        profileImageContainer.appendChild(img);
    }

    // Función para guardar la nueva foto en IndexedDB
    function saveImage(file) {
        const transaction = db.transaction(["users"], "readwrite");
        const usersStore = transaction.objectStore("users");

        const userRequest = usersStore.get("user@example.com"); // Usar el email adecuado

        userRequest.onsuccess = () => {
            const user = userRequest.result;
            if (user) {
                user.photo = file; // Guardar la nueva foto
                const updateRequest = usersStore.put(user);
                updateRequest.onsuccess = () => {
                    console.log("Foto de perfil actualizada.");
                };
            }
        };
    }

    // Manejo de la carga de imagen
    document.getElementById('profileImageInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const image = new Image();
                image.src = e.target.result;
                image.onload = function () {
                    const container = document.getElementById('profileImageContainer');
                    container.innerHTML = ''; // Limpiar el contenedor
                    container.appendChild(image); // Agregar la imagen cargada
                }
            }
            reader.readAsDataURL(file);
        }
    });

    // Función para eliminar aficiones seleccionadas
    deleteHobbiesBtn.addEventListener("click", () => {
        const selectedHobbies = Array.from(deleteHobbySelect.selectedOptions).map(option => option.value);
        if (selectedHobbies.length > 0) {
            const transaction = db.transaction(["userHobby"], "readwrite");
            const userHobbyStore = transaction.objectStore("userHobby");

            selectedHobbies.forEach(hobbyId => {
                const request = userHobbyStore.delete(["user@example.com", parseInt(hobbyId)]);
                request.onsuccess = () => {
                    console.log(`Afición ${hobbyId} eliminada.`);
                };
            });
            alert("Aficiones eliminadas.");
        }
    });

    // Función para añadir aficiones seleccionadas
    addHobbiesBtn.addEventListener("click", () => {
        const selectedHobbies = Array.from(addHobbySelect.selectedOptions).map(option => option.value);
        if (selectedHobbies.length > 0) {
            const transaction = db.transaction(["userHobby"], "readwrite");
            const userHobbyStore = transaction.objectStore("userHobby");

            selectedHobbies.forEach(hobbyId => {
                const newHobby = {
                    userEmail: "user@example.com", // Asegúrate de usar el email correcto
                    hobbyId: parseInt(hobbyId)
                };
                const request = userHobbyStore.add(newHobby);
                request.onsuccess = () => {
                    console.log(`Afición ${hobbyId} añadida.`);
                };
            });
            alert("Aficiones añadidas.");
        }
    });

    // Función para aceptar los cambios
    acceptChangesBtn.addEventListener("click", () => {
        const newCity = citySelect.value;
        const transaction = db.transaction(["users"], "readwrite");
        const usersStore = transaction.objectStore("users");

        const userRequest = usersStore.get("user@example.com");

        userRequest.onsuccess = () => {
            const user = userRequest.result;
            if (user) {
                user.city = newCity; // Actualizar la ciudad
                const updateRequest = usersStore.put(user);
                updateRequest.onsuccess = () => {
                    alert("Cambios guardados exitosamente.");
                    window.location.href = "profile.html"; // Redirigir al perfil
                };
            }
        };
    });
});