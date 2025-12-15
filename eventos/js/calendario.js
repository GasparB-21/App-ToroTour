// ====== Calendario básico sin eventos ======
// Genera una rejilla 7x6 que SIEMPRE cabe en pantalla (el CSS ya lo controla)

const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

// Estado inicial: mes/año actual (cámbialo si quieres empezar en otro)
const today = new Date();
let state = { y: today.getFullYear(), m: today.getMonth() }; // 0..11

// DOM
const $title   = document.getElementById("cal-title");
const $grid    = document.getElementById("cal-grid");
const $picker  = document.getElementById("picker");
const $toggle  = document.getElementById("picker-toggle");
const $selM    = document.getElementById("sel-month");
const $selY    = document.getElementById("sel-year");
const $apply   = document.getElementById("apply");

// Utils
const daysInMonth       = (y,m) => new Date(y, m+1, 0).getDate();
const mondayFirstIndex  = jsDay => (jsDay + 6) % 7; // 0=L .. 6=D
const fill              = (n, fn) => Array.from({length:n}, (_,i)=>fn(i));

// ---------- Picker ----------
function setupPicker(){
  // Meses
  MONTHS.forEach((name, i) => {
    const o = document.createElement("option");
    o.value = i; o.textContent = name;
    $selM.appendChild(o);
  });
  // Años (ajusta el rango a tu gusto)
  for (let y = today.getFullYear() - 2; y <= today.getFullYear() + 5; y++){
    const o = document.createElement("option");
    o.value = y; o.textContent = y;
    $selY.appendChild(o);
  }
  // Selección actual
  $selM.value = String(state.m);
  $selY.value = String(state.y);
}

function togglePicker(force){
  const open = !$picker.hasAttribute("hidden");
  const willOpen = (typeof force === "boolean") ? force : !open;
  if (willOpen){
    $picker.removeAttribute("hidden");
    $toggle.setAttribute("aria-expanded","true");
  } else {
    $picker.setAttribute("hidden","");
    $toggle.setAttribute("aria-expanded","false");
  }
}

// ---------- Render del calendario ----------
function render(){
  const { y, m } = state;
  $title.textContent = `${MONTHS[m]} ${y}`;

  $grid.innerHTML = "";
  const first = new Date(y, m, 1);
  const blanks = mondayFirstIndex(first.getDay()); // huecos antes del día 1
  const total  = daysInMonth(y, m);

  // celdas vacías anteriores
  fill(blanks, () => {
    const c = document.createElement("div");
    c.className = "cal__cell cal__cell--blank";
    c.innerHTML = `<p class="cal__num"></p>`;
    $grid.appendChild(c);
  });

  // días del mes
  fill(total, i => {
    const d = i+1;
    const c = document.createElement("div");
    c.className = "cal__cell";
    c.setAttribute("role","gridcell");
    c.innerHTML = `<p class="cal__num">${d}</p>`;
    $grid.appendChild(c);
  });

  // celdas vacías posteriores (solo para completar la última fila)
  const remainder = (blanks + total) % 7;
  const after = remainder ? 7 - remainder : 0;
  fill(after, () => {
    const c = document.createElement("div");
    c.className = "cal__cell cal__cell--blank";
    c.innerHTML = `<p class="cal__num"></p>`;
    $grid.appendChild(c);
  });
}

// ---------- Listeners ----------
$toggle.addEventListener("click", () => togglePicker());

$apply.addEventListener("click", () => {
  state.m = parseInt($selM.value, 10);
  state.y = parseInt($selY.value, 10);
  render();
  togglePicker(false);
});

// cerrar con Esc o clic fuera
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") togglePicker(false);
});
document.addEventListener("click", (e) => {
  const open = !$picker.hasAttribute("hidden");
  if (open && !$picker.contains(e.target) && !$toggle.contains(e.target)) {
    togglePicker(false);
  }
});

// ---------- Init ----------
setupPicker();
render();
