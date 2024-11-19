//YUYUAN
document.addEventListener("DOMContentLoaded", function () {
    let hobbies = getHobbies();
    
});

function getHobbies() {
    let request = window.indexedDB.open("vitomaite01", 1);

    let db;
    request.onsucces = (event) => {
        db = event.target.result;
    };

    const transaction = db.transaction(['hobbies'], 'readonly');
    const objectStore = transaction.objectStore('hobbies');

    request = objectStore.getAll();
    request.onsucces = function (event) {
        const hobbies = event.target.result;
        return hobbies;
    };
    request.onerror = (event) => {
        console.error("An error occurred during database opening: ${event.target.error?.message}");
    };
}