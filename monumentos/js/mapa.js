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
  iconUrl: '/monumentos/img/mapa/pin.png', // pon aquí tu pin
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

/* =================== */
/* Botón accesibilidad */
/* =================== */
const fab     = document.getElementById('mapFab');
const toggle  = document.getElementById('fabToggle');
const actions = document.getElementById('fabActions');
const buttons = [...actions.querySelectorAll('.map-fab__btn')];

// posiciones personalizadas para el layout en columnas
const FAB_LAYOUT = {
  'pan-left':  { x: -144, y:   0 },
  'pan-up':    { x:  -72, y: -72 },
  'pan-down':  { x:  -72, y:  72 },
  'zoom-in':   { x:    0, y: -72 },
  'zoom-out':  { x:    0, y:  72 },
  'pan-right': { x:   -72, y:   0 },
  'fit':       { x:   72, y:  72 },
};

function layoutCustom(){
  buttons.forEach(btn => {
    const pos = FAB_LAYOUT[btn.dataset.action];
    if (!pos) return;
    btn.style.setProperty('--tx', `${pos.x}px`);
    btn.style.setProperty('--ty', `${pos.y}px`);
  });
}
layoutCustom();

// abrir/cerrar
function openFab(){
  fab.classList.add('map-fab--open');
  actions.hidden = false;
  toggle.setAttribute('aria-expanded','true');
}
function closeFab(){
  fab.classList.remove('map-fab--open');
  // espera a que termine la animación para ocultar y no “salte”
  setTimeout(()=>{ actions.hidden = true; }, 180);
  toggle.setAttribute('aria-expanded','false');
}
toggle.addEventListener('click', () => {
  if (fab.classList.contains('map-fab--open')) {
    closeFab();
  } else {
    openFab();
  }
});

// cierra si haces clic fuera o pulsas ESC
document.addEventListener('click', (e) => {
  if (!fab.contains(e.target)) closeFab();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeFab();
});

/* ========= Acciones del mapa ========= */

function fitMarkers(){
  if (!POIS?.length) return;
  const bounds = L.latLngBounds(POIS.map(p => p.coords));
  map.fitBounds(bounds, { padding: [40,40] });
}

function pan(dx, dy){ map.panBy([dx, dy], { animate:true }); }

actions.addEventListener('click', (e) => {
  const btn = e.target.closest('.map-fab__btn');
  if (!btn) return;
  const act = btn.dataset.action;

  switch(act){
    case 'zoom-in':    map.zoomIn(); break;
    case 'zoom-out':   map.zoomOut(); break;
    case 'fit':        fitMarkers(); closeFab(); break;
    case 'pan-up':     pan(0, -120); break;
    case 'pan-down':   pan(0, 120);  break;
    case 'pan-left':   pan(-120, 0); break;
    case 'pan-right':  pan(120, 0);  break;
  }
});
