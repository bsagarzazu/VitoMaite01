//YUYUAN
//editProfile.js
document.addEventListener("DOMContentLoaded", function() {
    let db;
    const request = indexedDB.open('vitomaite01', 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;

        // Crear almacenes de objetos si no existen
        if (!db.objectStoreNames.contains('userHobby')) {
            const userHobbyObjStore = db.createObjectStore("userHobby", { keyPath: ["userEmail", "hobbyId"] });
            userHobbyObjStore.createIndex("byEmail", "userEmail", { unique: false });
            userHobbyObjStore.createIndex("byHobbyId", "hobbyId", { unique: false });
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;

        // Cargar aficiones del usuario logueado
        loadUserHobbies(db);

        // Cargar todas las aficiones disponibles
        loadAvailableHobbies(db);
    };

    function loadUserHobbies(db) {
        const transaction = db.transaction("userHobby", "readonly");
        const store = transaction.objectStore("userHobby");

        // Obtener los hobbies del usuario
        const hobbiesRequest = store.getAll();
        hobbiesRequest.onsuccess = function() {
            const hobbies = hobbiesRequest.result;

            const deleteSelect = document.getElementById('deleteHobbySelect');
            hobbies.forEach(hobby => {
                const option = document.createElement('option');
                option.value = hobby.hobbyId;
                option.text = hobby.hobbyId; // Aquí puedes mostrar el nombre de la afición si lo tienes
                deleteSelect.appendChild(option);
            });
        };
    }

    function loadAvailableHobbies(db) {
        const transaction = db.transaction("hobbies", "readonly");
        const store = transaction.objectStore("hobbies");

        // Obtener todas las aficiones disponibles
        const hobbiesRequest = store.getAll();
        hobbiesRequest.onsuccess = function() {
            const hobbies = hobbiesRequest.result;

            const addSelect = document.getElementById('addHobbySelect');
            hobbies.forEach(hobby => {
                // Verificar si la afición ya está en la colección del usuario
                const userHobbies = document.getElementById('deleteHobbySelect').options;
                let exists = false;
                for (let option of userHobbies) {
                    if (option.value == hobby.hobbyId) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    const option = document.createElement('option');
                    option.value = hobby.hobbyId;
                    option.text = hobby.hobbyId; // Aquí puedes mostrar el nombre de la afición si lo tienes
                    addSelect.appendChild(option);
                }
            });
        };
    }

    // Cargar y mostrar la imagen de perfil
    const profileImageInput = document.getElementById('profileImageInput');
    const profileImageContainer = document.getElementById('profileImageContainer');

    profileImageInput.addEventListener('change', handleFileSelect);
    profileImageContainer.addEventListener('dragover', handleDragOver);
    profileImageContainer.addEventListener('drop', handleDrop);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            previewImage(file);
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            previewImage(file);
        }
    }

    function previewImage(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const image = new Image();
            image.src = e.target.result;
            image.onload = function() {
                const imgPreview = document.createElement('img');
                imgPreview.src = image.src;
                profileImageContainer.innerHTML = ''; // Limpiar el contenedor
                profileImageContainer.appendChild(imgPreview);
            };
        };
        reader.readAsDataURL(file);
    }

    // Función para aceptar cambios y modificar el perfil
    document.getElementById('acceptChangesBtn').addEventListener('click', function() {
        const city = document.getElementById('city').value;
        const newProfileImage = profileImageContainer.querySelector('img') ? profileImageContainer.querySelector('img').src : null;

        const userEmail = 'user@example.com'; // Este debe ser el correo del usuario logueado
        console.log('Ciudad: ' + city);
        console.log('Imagen de perfil: ' + newProfileImage);

        // Aquí puedes realizar la lógica para actualizar los datos del usuario (ciudad, imagen) en la base de datos
        updateProfile(userEmail, city, newProfileImage);
        updateUserHobbies(userEmail);
    });

    // Función para actualizar la ciudad y la imagen del perfil del usuario
    function updateProfile(userEmail, city, profileImage) {
        const transaction = db.transaction("users", "readwrite");
        const store = transaction.objectStore("users");

        const userRequest = store.get(userEmail);
        userRequest.onsuccess = function() {
            const user = userRequest.result;
            if (user) {
                user.city = city;
                user.profileImage = profileImage; // Actualizar la imagen del perfil
                const updateRequest = store.put(user);
                updateRequest.onsuccess = function() {
                    console.log('Perfil actualizado correctamente');
                };
            }
        };
    }

    // Función para añadir y eliminar aficiones
    function updateUserHobbies(userEmail) {
        const deleteSelect = document.getElementById('deleteHobbySelect');
        const addSelect = document.getElementById('addHobbySelect');

        // Eliminar aficiones seleccionadas
        const hobbiesToDelete = Array.from(deleteSelect.selectedOptions).map(option => option.value);
        const transaction = db.transaction("userHobby", "readwrite");
        const store = transaction.objectStore("userHobby");

        hobbiesToDelete.forEach(hobbyId => {
            const deleteRequest = store.delete([userEmail, hobbyId]);
            deleteRequest.onsuccess = function() {
                console.log('Afición eliminada: ' + hobbyId);
            };
        });

        // Añadir nuevas aficiones seleccionadas
        const hobbiesToAdd = Array.from(addSelect.selectedOptions).map(option => option.value);
        hobbiesToAdd.forEach(hobbyId => {
            const hobby = { userEmail: userEmail, hobbyId: hobbyId };
            const addRequest = store.add(hobby);
            addRequest.onsuccess = function() {
                console.log('Afición añadida: ' + hobbyId);
            };
        });
    }
});

