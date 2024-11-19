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
    
    //const pAficion = document.getElementById("profile-hobbies");
    //pAficion.value += userHobby.;
    
});
