import cursor from './cursor.js'
import { setupTablero } from "./setups.js"
import { drawBoard } from "./onScreen.js"
import validMove from './rules.js'

const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d")
let tablero = []
const piezas = []
const mano = new cursor(0, 0, canvas.width / 8, tablero, c)
const turno_de = document.getElementById("turno-de")
let movimientos = []
let prevTablero = []


const setup = function () {
    canvas.width = 60 * 8
    canvas.height = 60 * 8
    setupTablero(piezas, tablero)
    setMovimientos();

}


const draw = function () {
    updateMoveCounts()
    mano.sqrSize = canvas.width / 8
    drawBoard('white', 'pink', c, tablero, piezas)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('click', manejarClic)
    mano.signal(tablero, movimientos)

    if (mano.turn == 1) { turno_de.textContent = "Turno de: Blancas" }
    if (mano.turn == 0) { turno_de.textContent = "Turno de: Negras" }

    let checkmate=0
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            checkmate+= validMove(i,j,i,j,tablero[i+j*8],tablero,mano.turn,true,movimientos)[3]
        }
    }
    if(checkmate==0){ turno_de.textContent="Jaquemate" }
    if(checkmate!=0){
        requestAnimationFrame(draw)
    }
    
}


//////////////////////////
function setMovimientos() {
    for (let i = 0; i < 64; i++) {
        movimientos[i] = 0
        prevTablero[i] = tablero[i]
    }
}
function updateMoveCounts() {
    for (let i = 0; i < 64; i++) {
        if (prevTablero[i] != tablero[i]) {
            movimientos[i] += 1
            prevTablero[i] = tablero[i]
        }
    }
}
//////////////////////////
let clicActivo = true;
function manejarClic() {
    if (clicActivo) {
        clicActivo = false
        mano.click(tablero, movimientos)
        setTimeout(() => { clicActivo = true; console.log('Clic reactivado.') }, 50);
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

