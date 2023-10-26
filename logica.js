let elTiempo = document.querySelector("#tiempo");
let seleccionActual = [];
let celdasAbiertas = [];
let tablero = [];
let celdasOcultas = 0

// Función para inicializar el tablero del juego de memoria
function iniciarMemoria() {
    const selector = parseInt(document.querySelector("#selector").value);
    const matrixN = [2, 4, 6, 2, 3, 4, 5];
    const matrixY = [2, 4, 6, 10, 10, 10, 10];
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
function rellenarMemoria(tablero) {
    const n = tablero.length;
    const m = tablero[0].length;
    const maxImagenes = (n * m) / 2;

    const imagenes = [
        "1.png", "2.png", "3.png", "4.png", "5.png",
        "6.png", "7.png", "8.png", "9.png", "10.png",
        "11.png", "12.png", "13.png", "14.png", "15.png",
        "16.png", "17.png", "18.png", "19.png", "20.png",
        "21.png", "22.png", "23.png", "24.png", "25.png"
    ];

    // Crea un arreglo para almacenar las imágenes duplicadas
    const imagenesDuplicadas = [];
    for (let i = 0; i < maxImagenes; i++) {
        imagenesDuplicadas.push(imagenes[i]);
        imagenesDuplicadas.push(imagenes[i]);
    }

    // Mezcla el arreglo de imágenes duplicadas
    for (let i = imagenesDuplicadas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [imagenesDuplicadas[i], imagenesDuplicadas[j]] = [imagenesDuplicadas[j], imagenesDuplicadas[i]];
    }

    let index = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            tablero[i][j] = imagenesDuplicadas[index];
            index++;
        }
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
    

    while (celdasOcultas < numCeldasOcultas) {
        const fila = Math.floor(Math.random() * n);
        const columna = Math.floor(Math.random() * m);

        if (matrizCubierta[fila][columna] === 0) {
            matrizCubierta[fila][columna] = 1; // Marca la celda como oculta
            celdasOcultas++;
        }
    }

    if (celdasOcultas === 0) {
        alert("GANASTE");
    }
    else {
        // Llama a la función para mostrar el juego de memoria pasando la matriz cubierta
        mostrarMemoria(tablero, matrizCubierta);
    }
}


// Función para mostrar el juego de memoria en la página
function mostrarMemoria(tablero, matrizCubierta) {
    const tableroDiv = document.getElementById("tablero");
    tableroDiv.innerHTML = "";

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
    }

    startTime = new Date();
    updateClock();
}
