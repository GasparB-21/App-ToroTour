import { FAVORITES_MOCK_MIN } from "../shared/js/mock.js";
import { createEventLi } from "../shared/js/event-card.js";

const $lista = document.getElementById("lista");

function renderLista(){
  $lista.innerHTML = "";
  FAVORITES_MOCK_MIN
    .filter(x => x.type === "evento")
    .forEach(evt => $lista.appendChild(createEventLi(evt)));
}

// Delegación: toggle favoritos
$lista.addEventListener("click", (e)=>{
  const btn = e.target.closest(".fav-btn");
  if(!btn) return;
  const id = btn.dataset.id;
  const item = FAVORITES_MOCK_MIN.find(x => x.id === id);
  if(!item) return;

  item.isFavorite = !item.isFavorite;
  btn.setAttribute("aria-pressed", String(item.isFavorite));
  btn.setAttribute("aria-label", item.isFavorite ? "Quitar de favoritos" : "Marcar como favorito");

  const path = btn.querySelector("path");
  if(item.isFavorite) path.setAttribute("fill","currentColor");
  else path.removeAttribute("fill");
});

renderLista();
