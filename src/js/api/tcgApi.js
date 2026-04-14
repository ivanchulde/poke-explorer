export async function getPokemonCard(name) {
  try {
    const res = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=name:${name}`
    );

    const data = await res.json();

    return data.data[0]; // primera carta
  } catch (error) {
    console.error("Error fetching TCG card:", error);
  }
}