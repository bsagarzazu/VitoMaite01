//YUYUAN
//editProfile.js
document.addEventListener("DOMContentLoaded", function () {
    const acceptBtn = document.getElementById("accept-btn");
    acceptBtn.addEventListener("click", function () {
        const pFoto = document.getElementById("photo").value;
        const pCiudad = document.getElementById("city").value;
        
        window.location.href = "profile.html";
    });
});

/*
function clickAddHobbies() {
    // Mostrar las aficiones disponibles para añadir (sin incluir las que ya están en usuario_aficion)
    const añadirContainer = document.getElementById("add-hobbies");
    todas_aficiones.forEach(function (aficion) {
        if (!usuario_aficion.includes(aficion)) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = aficion;
            checkbox.value = aficion;

            const label = document.createElement("label");
            label.setAttribute("for", aficion);
            label.textContent = aficion;

            const div = document.createElement("div");
            div.appendChild(checkbox);
            div.appendChild(label);
            añadirContainer.appendChild(div);
        }
    });

    
    // Función para añadir las aficiones seleccionadas
    document.getElementById("añadirBtn").addEventListener("click", function () {
        const checkboxesAñadir = document.querySelectorAll("#añadir-aficiones input[type='checkbox']:checked");
        checkboxesAñadir.forEach(function (checkbox) {
            // Añadir la afición seleccionada al array usuario_aficion
            if (!usuario_aficion.includes(checkbox.value)) {
                usuario_aficion.push(checkbox.value);
            }
        });
        alert("Aficiones añadidas: " + Array.from(checkboxesAñadir).map(cb => cb.value).join(", "));
        actualizarAficiones();
    });

}
);

function clickRemoveHobbies() {
    // Mostrar las aficiones actuales del usuario (para eliminar)
    const eliminarContainer = document.getElementById("remove-hobbies");
    usuario_aficion.forEach(function (aficion) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = aficion;
        checkbox.value = aficion;

        const label = document.createElement("label");
        label.setAttribute("for", aficion);
        label.textContent = aficion;

        const div = document.createElement("div");
        div.appendChild(checkbox);
        div.appendChild(label);
        eliminarContainer.appendChild(div);
    });

    
    // Función para eliminar las aficiones seleccionadas
    document.getElementById("eliminarBtn").addEventListener("click", function () {
        const checkboxesEliminar = document.querySelectorAll("#eliminar-aficiones input[type='checkbox']:checked");
        checkboxesEliminar.forEach(function (checkbox) {
            // Eliminar la afición seleccionada del array usuario_aficion
            const index = usuario_aficion.indexOf(checkbox.value);
            if (index !== -1) {
                usuario_aficion.splice(index, 1);
            }
        });
        alert("Aficiones eliminadas: " + Array.from(checkboxesEliminar).map(cb => cb.value).join(", "));
        actualizarAficiones();
    });

}
);


function actualizarAficiones() {
        // Limpiar los contenedores y volver a mostrar las aficiones
        eliminarContainer.innerHTML = '';
        añadirContainer.innerHTML = '';

        // Volver a mostrar las aficiones para eliminar
        usuario_aficion.forEach(function (aficion) {
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = aficion;
            checkbox.value = aficion;

            const label = document.createElement("label");
            label.setAttribute("for", aficion);
            label.textContent = aficion;

            const div = document.createElement("div");
            div.appendChild(checkbox);
            div.appendChild(label);
            eliminarContainer.appendChild(div);
        });

        // Volver a mostrar las aficiones disponibles para añadir
        todas_aficiones.forEach(function (aficion) {
            if (!usuario_aficion.includes(aficion)) {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = aficion;
                checkbox.value = aficion;

                const label = document.createElement("label");
                label.setAttribute("for", aficion);
                label.textContent = aficion;

                const div = document.createElement("div");
                div.appendChild(checkbox);
                div.appendChild(label);
                añadirContainer.appendChild(div);
            }
        });
    }
});
 * 
 */