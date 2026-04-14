import { getPokemon } from "./api/pokeApi.js";
import { renderPokemon } from "./components/pokemonCard.js";
import {updateFooterDates } from "./components/time.js";

const input = document.querySelector("#searchInput");
const button = document.querySelector("#searchBtn");


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

// At the end of main.js after DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  updateFooterDates(); // updates current year and last modified
});