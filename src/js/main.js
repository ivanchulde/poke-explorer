import { getPokemon } from "./api/pokeApi.js";
import { renderPokemon } from "./components/pokemonCard.js";
import {updateFooterDates } from "./components/time.js";

const input = document.querySelector("#searchInput");
const button = document.querySelector("#searchBtn");
const home = document.getElementById("homeSection");
const map = document.getElementById("mapSection");
const fav = document.getElementById("favSection");
const buttons = document.querySelectorAll(".nav-buttons button");
const zones = document.querySelectorAll(".zone");
const captureResult = document.getElementById("captureResult");
const favContainer = document.getElementById("favoritesContainer");


function setActive(activeBtn) {
  buttons.forEach(btn => btn.classList.remove("active"));
  activeBtn.classList.add("active");
}

document.getElementById("homeBtn").addEventListener("click", (e) => {
  home.style.display = "block";
  map.style.display = "none";
  fav.style.display = "none";

  setActive(e.target);
});

document.getElementById("mapBtn").addEventListener("click", (e) => {
  home.style.display = "none";
  map.style.display = "block";
  fav.style.display = "none";

  setActive(e.target);
});

document.getElementById("favBtn").addEventListener("click", (e) => {
  home.style.display = "none";
  map.style.display = "none";
  fav.style.display = "block";

  setActive(e.target);
});


// Evento 1: click
button.addEventListener("click", async () => {
  const name = input.value.toLowerCase().trim();

  if (!name) return;

  const pokemon = await getPokemon(name);
  renderPokemon(pokemon);
});

// Evento 2: enter
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    button.click();
  }
});


//CAPTURE PAGE
zones.forEach(zone => {
  zone.addEventListener("click", async () => {

    const zoneName = zone.dataset.zone;

    // Pokémon aleatorio (1–151)
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

  // evitar duplicados
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

//My Pokedex
function loadPokedex() {
  const saved = JSON.parse(localStorage.getItem("pokedex")) || [];

  if (saved.length === 0) {
    favContainer.innerHTML = "<p>No Pokémon captured yet 😢</p>";
    return;
  }

  favContainer.innerHTML = saved.map(pokemon => `
    <div class="fav-card">
      <h3>${pokemon.name.toUpperCase()}</h3>
      <img src="${pokemon.image}" />
      <button class="delete-btn" data-id="${pokemon.id}">
        ❌ Remove
      </button>
    </div>
  `).join("");

  // eventos eliminar
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      removePokemon(btn.dataset.id);
    });
  });
}

function removePokemon(id) {
  let saved = JSON.parse(localStorage.getItem("pokedex")) || [];

  saved = saved.filter(p => p.id != id);

  localStorage.setItem("pokedex", JSON.stringify(saved));

  loadPokedex(); // recargar vista
}


// At the end of main.js after DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  updateFooterDates(); // updates current year and last modified
});

document.getElementById("homeBtn").classList.add("active");
document.getElementById("favBtn").addEventListener("click", (e) => {
  home.style.display = "none";
  map.style.display = "none";
  fav.style.display = "block";

  setActive(e.target);

  loadPokedex(); // 🔥 clave
});