import { setupPiezas , setupTablero} from "./setups.js"
import { drawBoard, drawPossible , translatePiece} from "./onScreen.js"
import { board } from './board.js'
import cursor from './cursor.js'
const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d")


const juego = new board()
const piezas = []
let turno = 1
const turno_de = document.getElementById("turno-de")
const moves_left = document.getElementById("moves-left")
const mano = new cursor(0, 0, 50)
let jugadas= document.getElementById("sheet")

const setup = function () {
    setupPiezas(piezas)
    setupTablero(juego.tablero)
    /*
    for(let i=0;i<64;i++){juego.tablero[i]=0}
    juego.tablero[20]=8
    juego.tablero[30]=7
    juego.tablero[38]=3
    */
    juego.movimientosTotales()
}


const draw = function () {
    drawBoard('white', 'pink', c, juego.tablero, piezas)
    if(turno==1){
        canvas.addEventListener("click", manejarClic)
        canvas.addEventListener("mousemove", onMouseMove)
    }
    if(turno==0){
        bot()
    }
    if (mano.hand == 1) {
        drawPossible('white', 'pink', c, juego.tablero, piezas, juego.validArray,[mano.x,mano.y])
    }
    if (juego.movesLeft > 0) {
        if (turno == 1) {
            turno_de.textContent = "Turno de: Blancas"
        }
        if (turno == 0) {
            turno_de.textContent = "Turno de: Negras"
        }
        moves_left.textContent = "Movimientos posibles totales: " + juego.movesLeft
        requestAnimationFrame(draw)
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
    
}

function bot2(){
    let array=[]
    let escape=false
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            let piece=juego.getPieceFromXY(i,j)
            if(piece%2==turno && piece!=0){
                array.concat=[piece,i,j]
            }
        }
    }
    for(let i=0;i<array.length;i++){
        let valid=juego.getValidArrayFromXY(array[i][1],array[i][2])
        for(let j=0;j<64;j++){
            if(valid[j]>1 && valid[j]!=3 ){
                let prev=[]
                let next=[array[i][0],array[i][1]]
                juego.getPos(j,prev)
                juego.moverPieza(prev, next)
                escape=true
                break
            }
        }
    }
}

function bot(){
    let piece=[Math.floor(Math.random()*8) , Math.floor(Math.random()*8)]
    let move=[Math.floor(Math.random()*8) , Math.floor(Math.random()*8)]
    let avanza = juego.moverPieza(piece, move)
    let count=0
        while((avanza==0 || avanza==3) && count <10000){
            piece=[Math.floor(Math.random()*8) , Math.floor(Math.random()*8)]
            move=[Math.floor(Math.random()*8) , Math.floor(Math.random()*8)]
            avanza = juego.moverPieza(piece, move)
            count++
        }
        turno = juego.turno
        console.log("El bot probó "+count+" veces.")

        let pieza=juego.getPieceFromXY(move[0],move[1])
        let movimiento=translatePiece(piece,pieza,move)

        jugadas.innerHTML +="<br>"+(piece[0]+":"+piece[1]+" - "+movimiento+" -> "+move[0]+":"+move[1])
}

let clicActivo = true;
function manejarClic() {
    if (clicActivo) {
        clicActivo = false
        let success = mano.click(juego.tablero,juego.turno)
        if (success) {
            let avanza = juego.moverPieza([mano.prevX, mano.prevY], [mano.x, mano.y])
            if (avanza!=0 && avanza!=3)  {
                const audio = new Audio('assets/sounds/board.mp3');
                if (audio != null ) { audio.play() }
                turno = juego.turno

                let movimiento=juego.getPieceFromXY(mano.x,mano.y)
                let piece=[mano.prevX, mano.prevY]
                let move=[mano.x, mano.y]
                movimiento=translatePiece(piece,movimiento,move)
                jugadas.innerHTML +="<br>"+(piece[0]+":"+piece[1]+" - "+movimiento+" -> "+move[0]+":"+move[1]) 
            }else {
                const audio = new Audio('assets/sounds/error.mp3');
                if (audio != null) { audio.play() }
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

