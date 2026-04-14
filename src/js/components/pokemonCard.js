export function renderPokemon(pokemon, containerId = "#result") {
  const container = document.querySelector(containerId);

  if (!pokemon) {
    container.innerHTML = "<p>Pokemon not found</p>";
    return;
  }

  container.innerHTML = `
    <div class="card">

      <div class="card-left">
        <h2>${pokemon.name.toUpperCase()}</h2>

        <img src="${pokemon.sprites.other['official-artwork'].front_default}" 
             alt="${pokemon.name}" />

        <p><strong>ID:</strong> ${pokemon.id}</p>
        <p><strong>Height:</strong> ${pokemon.height}</p>
        <p><strong>Weight:</strong> ${pokemon.weight}</p>

        <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(", ")}</p>

        <p><strong>Abilities:</strong> ${pokemon.abilities
          .map(a => a.ability.name)
          .join(", ")}</p>
      </div>

      <div class="card-right">
        <h3>Stats</h3>

        ${pokemon.stats.map(stat => `
          <div class="stat">
            <span class="stat-name">${stat.stat.name}</span>

            <div class="bar">
              <div class="bar-fill ${stat.stat.name}" 
                   style="width: ${stat.base_stat}%">
              </div>
            </div>

            <span class="stat-value">${stat.base_stat}</span>
          </div>
        `).join("")}

      </div>

    </div>
  `;
}