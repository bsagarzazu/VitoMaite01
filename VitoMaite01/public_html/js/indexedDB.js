document.addEventListener("DOMContentLoaded", (event) => {
    const request = window.indexedDB.open("vitomaite01", 1);
         
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("users")) {
            db.createObjectStore("users", { keyPath: "email" });
        }
        if (!db.objectStoreNames.contains("hobbies")) {
            db.createObjectStore("hobbies", { keyPath: "hobbyId" , autoIncrement: true});
        }
        if (!db.objectStoreNames.contains("likes")) {
            db.createObjectStore("likes", { keyPath: ["email1", "email2"] });
        }
        if(!db.objectStoreNames.contains("userHobby")) {
            db.createObjectStore("userHobby", {keyPath: ["userEmail", "hobbyId"]});
        }
    };
});

// Stop data from loading twice after reloading or closing/entering
window.addEventListener("unload", (event) => {
    const request = window.indexedDB.deleteDatabase("vitomaite01");
});