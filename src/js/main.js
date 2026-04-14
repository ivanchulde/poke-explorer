import { getPokemon } from "./api/pokeApi.js";
import { renderPokemon } from "./components/pokemonCard.js";
import { updateFooterDates } from "./components/time.js";

/* =========================
   SELECTORES
========================= */
const input = document.querySelector("#searchInput");
const button = document.querySelector("#searchBtn");

const home = document.getElementById("homeSection");
const map = document.getElementById("mapSection");
const fav = document.getElementById("favSection");

const navButtons = document.querySelectorAll(".nav-buttons button");

const zones = document.querySelectorAll(".zone");
const captureResult = document.getElementById("captureResult");

const favContainer = document.getElementById("favoritesContainer");

/* MODAL */
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

/* =========================
   NAVIGATION
========================= */
function showSection(section) {
  home.style.display = "none";
  map.style.display = "none";
  fav.style.display = "none";

  section.style.display = "block";
}

function setActive(activeBtn) {
  navButtons.forEach(btn => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

document.getElementById("homeBtn").addEventListener("click", (e) => {
  showSection(home);
  setActive(e.target);
});

document.getElementById("mapBtn").addEventListener("click", (e) => {
  showSection(map);
  setActive(e.target);
});

document.getElementById("favBtn").addEventListener("click", (e) => {
  showSection(fav);
  setActive(e.target);
  loadPokedex();
});

/* =========================
   SEARCH
========================= */
button.addEventListener("click", async () => {
  const name = input.value.toLowerCase().trim();
  if (!name) return;

  const pokemon = await getPokemon(name);
  renderPokemon(pokemon);
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") button.click();
});

/* =========================
   CAPTURE SYSTEM
========================= */
zones.forEach(zone => {
  zone.addEventListener("click", async () => {
    const zoneName = zone.dataset.zone;
    const randomId = Math.floor(Math.random() * 151) + 1;

    const pokemon = await getPokemon(randomId);
    showCapture(pokemon, zoneName);
  });
});

function showCapture(pokemon, zone) {
  captureResult.innerHTML = `
    <div class="card">
      <h2>${pokemon.name.toUpperCase()}</h2>
      <img src="${pokemon.sprites.front_default}" />
      <p>📍 Found in ${zone}</p>

      <button id="captureBtn" class="pokeball-btn">
        <span class="pokeball"></span>
        Capture
      </button>
    </div>
  `;

  document.getElementById("captureBtn").addEventListener("click", () => {
    savePokemon(pokemon);
  });
}

function savePokemon(pokemon) {
  let saved = JSON.parse(localStorage.getItem("pokedex")) || [];

  if (saved.find(p => p.id === pokemon.id)) {
    alert("Already captured!");
    return;
  }

  saved.push({
    id: pokemon.id,
    name: pokemon.name,
    image: pokemon.sprites.front_default
  });

  localStorage.setItem("pokedex", JSON.stringify(saved));
  alert("Pokémon captured! 🎉");
}

/* =========================
   MY POKEDEX + MODAL
========================= */
function loadPokedex() {
  const saved = JSON.parse(localStorage.getItem("pokedex")) || [];

  if (saved.length === 0) {
    favContainer.innerHTML = "<p>No Pokémon captured yet 😢</p>";
    return;
  }

  favContainer.innerHTML = saved.map(pokemon => `
    <div class="fav-card" data-id="${pokemon.id}">
      <h3>${pokemon.name.toUpperCase()}</h3>
      <img src="${pokemon.image}" />
      <button class="delete-btn" data-id="${pokemon.id}">
        ❌ Remove
      </button>
    </div>
  `).join("");

  /* DELETE */
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // 🔥 evita abrir modal
      removePokemon(btn.dataset.id);
    });
  });

  /* CLICK CARD → MODAL */
  document.querySelectorAll(".fav-card").forEach(card => {
    card.addEventListener("click", async () => {
      const id = card.dataset.id;
      const pokemon = await getPokemon(id);

      modalBody.innerHTML = ""; // limpiar

      renderPokemon(pokemon, "#modalBody");

      modal.classList.remove("hidden");

      modal.classList.remove("hidden");
    });
  });
}

function removePokemon(id) {
  let saved = JSON.parse(localStorage.getItem("pokedex")) || [];
  saved = saved.filter(p => p.id != id);

  localStorage.setItem("pokedex", JSON.stringify(saved));
  loadPokedex();
}

/* =========================
   MODAL CLOSE
========================= */
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

/* =========================
   INIT
========================= */
window.addEventListener("DOMContentLoaded", () => {
  updateFooterDates();
  document.getElementById("homeBtn").classList.add("active");
});