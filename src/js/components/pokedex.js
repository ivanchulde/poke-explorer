import { getPokemon } from "../api/pokeApi.js";
import { getPokemonCard } from "../api/tcgApi.js";
import { renderPokemon } from "./pokemonCard.js";

export function loadPokedex(container, modal, modalBody) {
  const saved = JSON.parse(localStorage.getItem("pokedex")) || [];

  if (saved.length === 0) {
    container.innerHTML = "<p>No Pokémon captured yet 😢</p>";
    return;
  }

  container.innerHTML = saved.map(pokemon => `
    <div class="fav-card" data-id="${pokemon.id}">
      <h3>${pokemon.name.toUpperCase()}</h3>
      <img src="${pokemon.image}" />

      <div class="fav-actions">
        <button class="view-card-btn" data-name="${pokemon.name}">
          👁️ Card
        </button>

        <button class="delete-btn" data-id="${pokemon.id}">
          ❌ Remove
        </button>
      </div>
    </div>
  `).join("");

  /* DELETE */
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      removePokemon(btn.dataset.id, container, modal, modalBody);
    });
  });

  /* VIEW CARD */
  document.querySelectorAll(".view-card-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();

      const card = await getPokemonCard(btn.dataset.name);

      modalBody.innerHTML = `
        <div class="tcg-card">
          <img src="${card.images.large}" />
          <p><strong>Type:</strong> ${card.types?.join(", ") || "N/A"}</p>
          <p><strong>Set:</strong> ${card.set.name}</p>
          <p><strong>Rarity:</strong> ${card.rarity || "Unknown"}</p>
        </div>
      `;

      modal.classList.remove("hidden");
    });
  });

  /* CLICK CARD */
  document.querySelectorAll(".fav-card").forEach(card => {
    card.addEventListener("click", async () => {
      const pokemon = await getPokemon(card.dataset.id);

      modalBody.innerHTML = "";
      renderPokemon(pokemon, "#modalBody");

      modal.classList.remove("hidden");
    });
  });
}

function removePokemon(id, container, modal, modalBody) {
  let saved = JSON.parse(localStorage.getItem("pokedex")) || [];
  saved = saved.filter(p => p.id != id);

  localStorage.setItem("pokedex", JSON.stringify(saved));

  loadPokedex(container, modal, modalBody);
}