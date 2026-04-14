import { getPokemon } from "./api/pokeApi.js";
import { renderPokemon } from "./components/pokemonCard.js";
import { updateFooterDates } from "./components/time.js";
import { showCapture } from "./components/capture.js";
import { loadPokedex } from "./components/pokedex.js";

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

  // 🔥 carga pokedex
  loadPokedex(favContainer, modal, modalBody);
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

    // 🔥 usando componente externo
    showCapture(pokemon, zoneName, captureResult);
  });
});

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
