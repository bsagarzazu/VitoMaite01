let map;
let userMarker;
let radius = 500; // 2 km in meters
let markers = []; // Array to store map markers (Google Maps markers)
let mapMarkers = []; // Array to store Google Maps Marker objects

document.addEventListener("DOMContentLoaded", function () {
    const rangeInput = document.getElementById("map-range");
    const valueDisplay = document.getElementById("range-value");

    initLoc();
    
    // Update the radius when the input slider changes
    rangeInput.addEventListener("input", function () {
        radius = rangeInput.value * 1000; // Convert from kilometers to meters
        valueDisplay.textContent = rangeInput.value;
        initLoc();
    });
});

function initLoc() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                initMap(latitude, longitude);
            },
            (error) => {
                alert("Activa la ubicación para poder utilizar el servicio");
            }
        );
    } else {
        alert("Geolocalización no soportada por este navegador.");
    }
}

function getMarkers() {
    const request = indexedDB.open("vitomaite01", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("users", "readonly");
        const objectStore = transaction.objectStore("users");

        const query = objectStore.getAll();

        query.onsuccess = function (event) {
            const users = event.target.result;

            markers = users.map(user => ({
                lat: user.latitude,
                lng: user.longitude,
                name: `${user.nick}, ${user.age}`
            }));

            console.log(markers.length + " markers loaded.");
            // Show markers in the radius after loading
            if (map) {
                showMarkersInRadius({ lat: map.getCenter().lat(), lng: map.getCenter().lng() });
            }
        };

        query.onerror = function (event) {
            console.log("Error al obtener los usuarios:", event.target.error);
        };
    };

    request.onerror = function (event) {
        console.log("Error al abrir la base de datos:", event.target.error);
    };
}

function initMap(lat, lng) {
    const userLocation = { lat, lng };

    // Create the map
    map = new google.maps.Map(document.getElementById("map"), {
        center: userLocation,
        zoom: 14
    });

    // Add the user marker
    userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Tu ubicación",
        icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
    });

    // Draw a circle around the user's location
    const userCircle = new google.maps.Circle({
        map: map,
        radius: radius, // Radius in meters
        fillColor: "#AA0000",
        fillOpacity: 0.2,
        strokeColor: "#AA0000",
        strokeOpacity: 0.5
    });
    userCircle.setCenter(userLocation);

    // Get and display markers after initializing the map
    getMarkers();
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Show markers within the radius
function showMarkersInRadius(userLocation) {
    // Remove old markers from the map
    mapMarkers.forEach(marker => marker.setMap(null));
    mapMarkers = []; // Reset array of map markers

    markers.forEach((marker) => {
        const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            marker.lat,
            marker.lng
        );

        if (distance <= radius) {
            // Create a new marker for users within the radius
            const newMarker = new google.maps.Marker({
                position: { lat: marker.lat, lng: marker.lng },
                map: map,
                title: marker.name
            });

            // Store the marker to remove later if needed
            mapMarkers.push(newMarker);
        }
    });
}

// CLAVE: AIzaSyCl1NZDkN3lZ3JuKg1t7speq5S3SNYwpcU