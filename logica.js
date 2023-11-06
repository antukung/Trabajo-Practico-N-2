let elTiempo = document.querySelector("#tiempo");
let seleccionActual = [];
let celdasAbiertas = [];
let tablero = [];
let celdasOcultas = 0;
const URL_API_POKEMON = 'https://pokeapi.co/api/v2/pokemon/id'

// Función para inicializar el tablero del juego de memoria
function iniciarMemoria() {
    const selector = parseInt(document.querySelector("#selector").value);
    const matrixN = [2,4,6,8,2,3,4,5];
    const matrixY = [2,4,6,8,10,10,10,10];
    const n = matrixN[selector];
    const m = matrixY[selector];
    tablero = new Array(n);

    for (let i = 0; i < n; i++) {
        tablero[i] = new Array(m).fill(0);
    }

    rellenarMemoria(tablero);
    ocultarCeldas(tablero);
    mostrarMemoria(tablero);
}

// Función para rellenar el tablero del juego de memoria con imágenes
async function rellenarMemoria(tablero) {
    const n = tablero.length;
    const m = tablero[0].length;
    const maxImagenes = (n * m) / 2;

    // Obtener un conjunto de nombres de Pokémon aleatorios
    const pokemonNombres = await obtenerNombresPokemon(maxImagenes);

    // Duplicar los nombres de Pokémon para llenar el tablero
    const pokemonDuplicados = [];
    for (let i = 0; i < maxImagenes; i++) {
        pokemonDuplicados.push(pokemonNombres[i]);
        pokemonDuplicados.push(pokemonNombres[i]);
    }

    // Mezcla el arreglo de nombres de Pokémon duplicados
    for (let i = pokemonDuplicados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pokemonDuplicados[i], pokemonDuplicados[j]] = [pokemonDuplicados[j], pokemonDuplicados[i]];
    }

    let index = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            // Usa la función obtenerImagenPokemon para obtener la URL de la imagen del Pokémon
            const nombrePokemon = pokemonDuplicados[index];
            const imagenURL = await obtenerImagenPokemon(nombrePokemon);
            tablero[i][j] = imagenURL;
            index++;
        }
    }
}

// Función para obtener nombres de Pokémon aleatorios
async function obtenerNombresPokemon(cantidad) {
    const nombres = [];

    while (nombres.length < cantidad) {
        const randomID = Math.floor(Math.random() * 898) + 1; // 898 es el número total de Pokémon en la API
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomID}/`);
        if (response.ok) {
            const data = await response.json();
            const nombre = data.name;
            if (!nombres.includes(nombre)) {
                nombres.push(nombre);
            }
        }
    }

    return nombres;
}

// Función para obtener la URL de la imagen de un Pokémon
async function obtenerImagenPokemon(nombrePokemon) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}/`);
    if (response.ok) {
        const data = await response.json();
        const imagenURL = data.sprites.front_default;
        return imagenURL;
    }
}
// Función para ocultar algunas celdas en el juego de memoria
function ocultarCeldas(tablero) {
    const n = tablero.length;
    const m = tablero[0].length;
    const matrizCubierta = new Array(n);
  
    for (let i = 0; i < n; i++) {
        matrizCubierta[i] = new Array(m).fill(0); // Inicializa la matriz cubierta
    }

    // Decide aleatoriamente cuántas celdas ocultar y cuáles ocultar
    const numCeldasOcultas = Math.floor(Math.random() * (n * m)); // Número de celdas a ocultar

    celdasOcultas=n*m;
}

// Función para mostrar el juego de memoria en la página
function mostrarMemoria(tablero, matrizCubierta) {
    const tableroDiv = document.getElementById("tablero");
    tableroDiv.innerHTML = "";

    let celdasDescubiertas = 0; // Variable para contar las celdas descubiertas

    for (let i = 0; i < tablero.length; i++) {
        for (let j = 0; j < tablero[i].length; j++) {
            const celda = document.createElement("img");
            celda.src = "cubierta.png"; // Ruta de la imagen que cubre las celdas
            celda.id = `button-${i}-${j}`;

            celda.addEventListener("click", () => {
                if (seleccionActual.length < 2) {
                    seleccionActual.push(celda);
                    celda.src = tablero[i][j];
                    if (seleccionActual.length === 2) {
                        const [celda1, celda2] = seleccionActual;
                        if (celda1.src === celda2.src) {
                            celdasAbiertas.push(celda1, celda2);
                            seleccionActual = [];
                            celdasOcultas -= 2; // Decrementa el contador de celdas ocultas
                            verificarGanador(); // Verificar si todas las celdas se han descubierto
                        } else {
                            setTimeout(() => {
                                celda1.src = "cubierta.png";
                                celda2.src = "cubierta.png";
                                seleccionActual = [];
                            }, 1000);
                        }
                    }
                }
            });
            
            tableroDiv.appendChild(celda);
        }
        tableroDiv.appendChild(document.createElement("br"));
    }
}

// Función para iniciar el juego de memoria cuando se carga la página
function memoria() {
    iniciarMemoria();
    iniciarCronometro();
}

// Función para iniciar un cronómetro
function iniciarCronometro() {
    let startTime = null;

    function updateClock() {
        const currentTime = new Date();
        const elapsedTime = currentTime - startTime;

        const minutos = Math.floor(elapsedTime / 60000);
        const segundos = Math.floor((elapsedTime % 60000) / 1000);

        elTiempo.innerHTML = `Tiempo: ${minutos}:${segundos.toString().padStart(2, "0")}`;
        requestAnimationFrame(updateClock);
        verificarGanador(minutos,segundos);
    }

    startTime = new Date();
    updateClock();
}

function verificarGanador() {
    if (celdasOcultas === 0) {
        elTiempo.innerHTML="GANASTE"; // Muestra el mensaje si todas las celdas se han descubierto
        tiempoganador(minutos,segundos)
    }
}


function tiempoganador(minutos, segundos) {
    localStorage.setItem("TIEMPO",JSON.stringify( `${minutos}:${segundos}`));
}