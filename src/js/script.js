let offset = 0;
const limit = 12;
const maxPoke = 151;

const pokemonsList = document.getElementById("pokemons");
const detalhe = document.getElementById("detalhe");
const botaoLoad = document.getElementById("btnLoad");

function pokemonToHtml(pokemon) {
  return `
    <li class="pokemon ${pokemon.types[0].type.name}" data-pokemon-id="${
    pokemon.id
  }">
        <span>#${pokemon.id}</span>
        <h2>${pokemon.name}</h2>
        <div class="desc">
          <ol class="poder">
            <li>${pokemon.types[0].type.name}</li>
            ${pokemon.types[1] ? `<li>${pokemon.types[1].type.name}</li>` : ""}
          </ol>
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${
            pokemon.id
          }.png" alt="${pokemon.id}">
        </div>
      </li>
    </a>
  `;
}

function pokemonDetalheToHtml(pokemon) {
  detalhe.className = `${pokemon.types[0].type.name}`
  return `
  <section>
    <header>
      <button type="button" id="fechar">x</button>
    </header>
    <div>
      <h2>${pokemon.name}</h2>
      <span>#${pokemon.id}</span>
    </div>
    <ol class="descricao poder">
      <li>${pokemon.types[0].type.name}</li>
      ${
        pokemon.types[1] ? `<li>${pokemon.types[1].type.name}</li>` : ""
      }
    </ol>
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${
      pokemon.id
    }.png" alt="${pokemon.id}">
  </section>

  <section class="espc">
    <h3>About</h3>
    <h4>Height <span>${pokemon.height}<span></h3>
    <h4>Weight <span>${pokemon.weight}<span></h3>
    <ol class="abilities">
      <h4>Abilities</h4>
      ${pokemon.abilities
        .map((ability) => `<li>${ability.ability.name}</li>`)
        .join("")}
    </ol>
  </section>
  `;
}

function adicionarEventoFechar() {
  const botaoFechar = document.getElementById("fechar");
  if (botaoFechar) {
    botaoFechar.addEventListener("click", () => {
      detalhe.style.display = "none";
    });
  }
}

botaoLoad.addEventListener("click", () => {
  offset += limit;

  if (offset + limit >= maxPoke) {
    const newLimit = maxPoke - offset;
    loadPokemon(newLimit, offset);

    botaoLoad.style.display = "none";
  } else {
    loadPokemon(limit, offset);
  }
});

function loadPokemon(limit, offset) {
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;

  fetch(url)
    .then((response) => response.json())
    .then((jsonBody = []) => {
      const pokemonPromises = jsonBody.results.map((pokemon) => {
        return fetch(pokemon.url).then((rep) => rep.json());
      });
      return Promise.all(pokemonPromises);
    })
    .then((pokemons) => {
      pokemonsList.innerHTML += pokemons.map(pokemonToHtml).join("");

      pokemonsList.addEventListener("click", (e) => {
        const pokemonElement = e.target.closest(".pokemon"); // Verifica se o clique foi em um Pokémon
        if (pokemonElement) {
          const pokemonId = pokemonElement.dataset.pokemonId;
          const selectedPokemon = pokemons.find((p) => p.id == pokemonId);
          if (selectedPokemon) {
            detalhe.innerHTML = pokemonDetalheToHtml(selectedPokemon);
            detalhe.style.display = "block"; // Exibe o painel de detalhes
            adicionarEventoFechar();
          }
        }
      });
    })
    .catch((error) => console.log(error));
}

loadPokemon(limit, offset);
/*
 * pega a resposta  da Promisse do fetch e converte pra .json
 * pega apenas a parte de "results" da resposta convertida que, no caso dessa API, é um Array, em uma constante
 * percorre cada pokemon do array com o map aplicando um novo fetch para pegar o url com os detalhes e convertendo a nova resposta pra .json (NÃO ESQUECER DO PARÊNTESES NO JSON!)
 * Aguarda todas as promessas do novo fetch serem concluídas
 * concatena de uma só vez o HTML da <ol> percorrendo o Array com o map e aplicando a cada elemento a função
 * o .join("") serve para unir todos os elementos do Array em uma unica String. Por padrão ele faz isso colocando uma vírgula, por isso é preciso colocar como parâmetro uma String vazia
 * Dessa forma, em vez de adicionar cada <li> individualmente ao innerHTML, se cria a string HTML completa de uma vez e a insere no DOM.
 * pega erros se tiver
 */
