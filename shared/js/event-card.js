const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long" });

export function createEventLi(evt){
  const li = document.createElement("li");

  const isFav = !!evt.isFavorite;
  const dateLabel = fmtDate(evt.date);

  li.innerHTML = `
    <article class="event-card" aria-labelledby="evt-${evt.id}-title">
      <figure class="event-media">
        <img src="${evt.image}" alt="Imagen del evento ${evt.title}">
      </figure>

      <div class="event-content">
        <h3 id="evt-${evt.id}-title">${evt.title}</h3>
        <p><span class="label">Categoría:</span> <span>Cine</span></p>
        <p><span class="label">Fecha:</span>
          <time datetime="${evt.date}">${dateLabel}</time>
        </p>
      </div>

      <div class="event-actions">
        <button class="icon-btn fav-btn"
                aria-pressed="${isFav}"
                aria-label="${isFav ? "Quitar de favoritos" : "Marcar como favorito"}"
                data-id="${evt.id}">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s-7.5-4.6-9.3-8.9C1.7 8.6 3.8 6 6.7 6c1.8 0 3 .9 3.6 2.1C11.3 6.9 12.5 6 14.3 6c2.9 0 5 2.6 3.9 6.1C19.5 16.4 12 21 12 21z"></path>
          </svg>
        </button>

        <a class="icon-link" href="/evento/${evt.id}" aria-label="Ver detalles de ${evt.title}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
        </a>
      </div>
    </article>
  `;

  if (isFav) li.querySelector(".fav-btn path").setAttribute("fill","currentColor");
  return li;
}
