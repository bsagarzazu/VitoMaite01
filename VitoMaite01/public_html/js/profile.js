//profile.js
document.addEventListener("", function() {
    const usu = JSON.parse(sessionStorage.getItem("userLoggedIn"));
    
    const pNombre = document.getElementById("profile-name");
    pNombre.value += usu.nick;
    const pCiudad = document.getElementById("profile-city");
    pCiudad.value += usu.city;
    const pEdad = document.getElementById("profile-age");
    pEdad.value += usu.age;
    const pGenero = document.getElementById("profile-gender");
    pGenero.value += usu.gender;
    const pFoto = document.getElementById("profile-photo");
    pFoto.value += usu.imagen;
    
    /*
    const request = window.indexedDB.open("vitomaite01",1);
    request.onsuccess = (event) =>{
        const db = event.target.result;
        const trans = db.transaction(["hobbies", "userHobby"],"readonly");
        const tableHobbies = trans.objectStore("hobbies");
        const tableUserHobbies = trans.objectStore("userHobby");
        
        tableUserHobbies
    };
     * 
     */
});
