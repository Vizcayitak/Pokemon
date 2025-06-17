
const container = document.getElementById("pokemon-container");
const searchInput = document.getElementById("search");

let offset = 0;
const limit = 20;
let loading = false;

const getPokemon = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  return res.json();
};

const renderPokemon = async (id) => {
  try {
    const pokemon = await getPokemon(id);

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = \`
      <img src="\${pokemon.sprites.front_default}" alt="\${pokemon.name}" />
      <h3>#\${pokemon.id} \${pokemon.name}</h3>
      <p>Tipo: \${pokemon.types.map(t => t.type.name).join(', ')}</p>
    \`;

    container.appendChild(card);
  } catch (err) {
    console.error(\`Error al cargar el Pokémon con ID: \${id}\`);
  }
};

const loadMorePokemon = async () => {
  if (loading) return;
  loading = true;

  for (let i = offset + 1; i <= offset + limit; i++) {
    await renderPokemon(i);
  }

  offset += limit;
  loading = false;
};

const searchPokemon = async (value) => {
  container.innerHTML = "";
  if (value === "") {
    offset = 0;
    await loadMorePokemon();
    return;
  }

  try {
    await renderPokemon(value.toLowerCase());
  } catch (err) {
    container.innerHTML = `<p style="text-align:center; color:red;">Pokémon no encontrado</p>`;
  }
};

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.trim();
  searchPokemon(value);
});

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadMorePokemon();
  }
});

loadMorePokemon();
