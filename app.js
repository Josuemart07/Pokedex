const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

// Obtener información de los primeros  Pokémon
for (let i = 1; i <= 204; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}

// Función para mostrar información de un Pokémon
function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

// Agregar eventos de escucha para los botones de filtrado
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 204; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
                if(botonId === "todos") {
                    mostrarPokemon(data);
                } else if (data.types.some(type => type.type.name === botonId)) {
                    mostrarPokemon(data);
                }
            });
    }
}));

// Agregar evento de escucha para el botón de búsqueda
const botonBuscar = document.querySelector("#botonBuscar");
botonBuscar.addEventListener("click", buscarPokemon);

// Función para manejar la búsqueda de Pokémon
function buscarPokemon() {
    const inputBusqueda = document.querySelector("#buscarPokemon");
    const nombrePokemon = inputBusqueda.value.toLowerCase().trim();

    if (nombrePokemon === "") {
        alert("Por favor, ingresa el nombre de un Pokémon.");
        return;
    }

    const URL = `https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`;
    fetch(URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error("No se encontró ningún Pokémon con ese nombre.");
            }
            return response.json();
        })
        .then(data => {
            // Limpiar la lista de Pokémon existente
            listaPokemon.innerHTML = "";

            // Mostrar el Pokémon buscado
            mostrarPokemon(data);
        })
        .catch(error => {
            alert(error.message);
        });
}
