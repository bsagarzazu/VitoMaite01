//ARITZ
document.addEventListener("DOMContentLoaded", (event) => {
    const request = window.indexedDB.open("vitomaite01", 1);
         
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("users")) {
            const userObjStore = db.createObjectStore("users", { keyPath: "email" });
            
            userObjStore.createIndex("byEmail", "email", { unique: true });
        }
        if (!db.objectStoreNames.contains("hobbies")) {
            const hobbyObjStore = db.createObjectStore("hobbies", { keyPath: "hobbyId" , autoIncrement: true});
            
            hobbyObjStore.createIndex("byHobbyId", "hobbyId", { unique: true });
        }
        if (!db.objectStoreNames.contains("likes")) {
            const likesObjStore = db.createObjectStore("likes", { keyPath: ["email1", "email2"] });
        
            likesObjStore.createIndex("byEmail1", "email1", { unique: false });
        }
        if(!db.objectStoreNames.contains("userHobby")) {
            const userHobbyObjStore = db.createObjectStore("userHobby", {keyPath: ["userEmail", "hobbyId"]});
        
            userHobbyObjStore.createIndex("byEmail", "userEmail", { unique: false });
        }
    };
});

// Stop data from loading twice after reloading or closing/entering
window.addEventListener("unload", (event) => {
    const request = window.indexedDB.deleteDatabase("vitomaite01");
});