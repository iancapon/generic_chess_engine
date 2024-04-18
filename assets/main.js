import { setupPiezas } from "./setups.js"
import { drawBoard, drawPossible } from "./onScreen.js"
import { board } from './board.js'
import cursor from './cursor.js'
const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d")


const juego = new board()
const piezas = []
let turno = 1
const turno_de = document.getElementById("turno-de")
const moves_left = document.getElementById("moves-left")
const mano = new cursor(0, 0, 50, turno)


const setup = function () {
    setupPiezas(piezas)
    //juego.tablero[0+8*5]=7
    juego.movimientosTotales()
}


const draw = function () {
    drawBoard('white', 'pink', c, juego.tablero, piezas)
    canvas.addEventListener("click", manejarClic)
    canvas.addEventListener("mousemove", onMouseMove)
    if (mano.hand == 1) {
        drawPossible('white', 'pink', c, juego.tablero, piezas, juego.validArray, [mano.x, mano.y])
    }
    if (juego.movesLeft > 0) {
        if (turno == 1) {
            turno_de.textContent = "Turno de: Blancas"
        }
        if (turno == 0) {
            turno_de.textContent = "Turno de: Negras"
        }
        moves_left.textContent = "Movimientos posibles totales: " + juego.movesLeft
    }
    
    if (juego.movesLeft == 0) {
        if (turno == 1) {
            moves_left.textContent = "Gana: Negras"
        }
        if (turno == 0) {
            moves_left.textContent = "Gana: Blancas"
        }
        turno_de.textContent = "Jaquemate (o empate)"
    }
    requestAnimationFrame(draw)
}


let clicActivo = true;
function manejarClic() {
    if (clicActivo) {
        clicActivo = false
        let success = mano.click(juego.tablero)
        if (success) {
            let avanza = juego.moverPieza([mano.prevX, mano.prevY], [mano.x, mano.y])
            if (avanza) {
                const audio = new Audio('assets/sounds/board.mp3');
                if (audio != null ) { audio.play() }
                turno = juego.turno
                mano.turno = juego.turno
            }
        }
        setTimeout(() => { clicActivo = true; /*console.log('Clic reactivado.')*/ }, 50);
    } //----------------------------------------------- 1000 milisegundos = 1 segundo
}
function onMouseMove(evt) {
    var mousePos = getMousePos(canvas, evt);
    mano.truex = Math.floor(mousePos.x / mano.sqrSize)
    mano.truey = Math.floor(mousePos.y / mano.sqrSize)
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

setup()
draw()

