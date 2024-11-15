// indexedDB.js
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("vitomaite01", 1);
        
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject("Error opening database: " + event.target.errorCode);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("users")) {
                db.createObjectStore("users", { keyPath: "email" });
            }
            if (!db.objectStoreNames.contains("hobbies")) {
                db.createObjectStore("hobbies", { keyPath: "idHobby" });
            }
            // TODO: this keyPath should take into account both email1 and email2
            if (!db.objectStoreNames.contains("likes")) {
                db.createObjectStore("likes", { keyPath: "email1" });
            }
        };
    });
}
