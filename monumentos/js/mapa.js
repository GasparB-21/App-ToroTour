// Punto inicial (Salamanca aprox)
const START = { lat: 40.965, lng: -5.664 };

// 1) Inicializa el mapa
const map = L.map('map', { zoomControl: false }).setView(START, 14);

// 2) Tiles OSM (para producción valora un proveedor con SLA/token)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap',
  maxZoom: 19
}).addTo(map);

// 3) Marcadores de ejemplo
const POIS = [
  { name:'Catedral Nueva',   type:'Cathedral',   coords:[40.9619,-5.6673] },
  { name:'Catedral Vieja',   type:'Cathedral',   coords:[40.9613,-5.6681] },
  { name:'Casa de las Conchas', type:'Building', coords:[40.9642,-5.6645] },
];

const pin = L.icon({
  iconUrl: '/favorites/img/pin-black.png', // pon aquí tu pin
  iconSize: [28, 28],
  iconAnchor: [14, 28]
});

POIS.forEach(poi => {
  L.marker(poi.coords, { icon: pin })
   .addTo(map)
   .on('click', () => updateSheet(poi));
});

// 4) Localización del usuario (punto azul)
if (navigator.geolocation){
  navigator.geolocation.getCurrentPosition(
    ({coords}) => {
      const you = [coords.latitude, coords.longitude];
      L.circleMarker(you, {
        radius: 8, color:'#1976ff', fillColor:'#1976ff',
        fillOpacity: 1, weight: 3
      }).addTo(map);
      // map.setView(you, 14); // si quieres centrar en ti
    },
    console.warn,
    { enableHighAccuracy:true, timeout:5000 }
  );
}

// 5) Actualiza la bottom sheet con los datos del pin
function updateSheet(poi){
  document.querySelector('.sheet__title').textContent = poi.name;
  document.querySelector('.sheet__meta').innerHTML =
    `<strong>Monument type:</strong> ${poi.type}`;
  // puedes actualizar href del CTA, etc.
}
