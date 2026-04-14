export function showCapture(pokemon, zone, container) {
  container.innerHTML = `
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

export function savePokemon(pokemon) {
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