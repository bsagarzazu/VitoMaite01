let map;
let userMarker;
const radius = 2000; // 2 km en metros

document.addEventListener("DOMContentLoaded", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        initMap(latitude, longitude);
      },
      (error) => {
        alert("Error al obtener la ubicación: " + error.message);
      }
    );
  } else {
    alert("Geolocalización no soportada por este navegador.");
  }
});

// Marcadores de ejemplo (latitud y longitud)
const markers = [
  { lat: 42.8616922, lng: -2.7380206,  name: "Aligobeo" }, // Fuera de 2 km 
  { lat: 42.8412704, lng: -2.6762743, name: "Parque de la Florida" }, // Dentro de 2 km
  { lat: 42.8403004, lng: -2.6845562, name: "Estadio de Mendizorrotza" }, // Dentro de 2 km
  { lat: 42.8501865, lng: -2.6433496, name: "Elorriaga" } // Fuera de 2 km
];

// Función para inicializar el mapa
function initMap(lat, lng) {
  const userLocation = { lat, lng };

  // Crear el mapa
  map = new google.maps.Map(document.getElementById("map"), {
    center: userLocation,
    zoom: 14
  });

  // Agregar marcador del usuario
  userMarker = new google.maps.Marker({
    position: userLocation,
    map: map,
    title: "Tu ubicación",
    icon: {
      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    },
  });

  // Dibujar círculo alrededor de la ubicación del usuario
  const userCircle = new google.maps.Circle({
    map: map,
    radius: radius, // Radio en metros
    fillColor: "#AA0000",
    fillOpacity: 0.2,
    strokeColor: "#AA0000",
    strokeOpacity: 0.5
  });
  userCircle.setCenter(userLocation);

  // Mostrar marcadores dentro del radio
  showMarkersInRadius(userLocation);
}

// Calcular distancia entre dos coordenadas (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
}

// Mostrar marcadores dentro del radio
function showMarkersInRadius(userLocation) {
  markers.forEach((marker) => {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      marker.lat,
      marker.lng
    );

    if (distance <= radius) {
      new google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: map,
        title: marker.name
      });
    }
  });
}