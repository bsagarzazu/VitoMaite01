let map;
let userMarker;
let radius = 2000; // 2 km in meters
let markers = [];

document.addEventListener("DOMContentLoaded", function () {
    initLoc();
});

function initLoc() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
                (position) => {
            const {latitude, longitude} = position.coords;
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

function initMap(lat, lng) {
    const userLocation = {lat, lng};

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
}