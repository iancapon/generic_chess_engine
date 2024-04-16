//import {moved} from "./main.js"
export default function validMove(px, py, x, y, piece, tablero, turn, checkcheck, mov) {
    let ret = false
    let valid = []
    for (let i = 0; i < 64; i++) { valid[i] = 0 }
    if (turn % 2 == piece % 2) {

        switch (piece) {
            case 1:
                ret = torre(px, py, x, y, tablero, turn, valid)
                break;
            case 2:
                ret = torre(px, py, x, y, tablero, turn, valid)
                break;
            case 3:
                ret = reina(px, py, x, y, tablero, turn, valid)
                break;
            case 4:
                ret = reina(px, py, x, y, tablero, turn, valid)
                break;
            case 5:
                ret = peon(px, py, x, y, tablero, turn, valid)
                break;
            case 6:
                ret = peon(px, py, x, y, tablero, turn, valid)
                break;
            case 7:
                ret = rey(px, py, x, y, tablero, turn, valid, checkcheck, mov)
                break;
            case 8:
                ret = rey(px, py, x, y, tablero, turn, valid, checkcheck, mov)
                break;
            case 9:
                ret = alfil(px, py, x, y, tablero, turn, valid)
                break;
            case 10:
                ret = alfil(px, py, x, y, tablero, turn, valid)
                break;
            case 11:
                ret = caballo(px, py, x, y, tablero, turn, valid)
                break;
            case 12:
                ret = caballo(px, py, x, y, tablero, turn, valid)
                break;

        }
    }
    let check = false
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (tablero[i + j * 8] == 7 + turn && valid[i + j * 8] == 1) {
                valid[i + j * 8] = 2
                check = true/////jaque al otro

            }
            if (tablero[i + j * 8] != 7 + turn && tablero[i + j * 8] > 0 && valid[i + j * 8] == 1) {
                valid[i + j * 8] = 3
            }
        }
    }
    if (valid[x + y * 8] == 2) {
        ret = false
    }

    if (checkcheck) {
        let nextTablero = []
        for (let i = 0; i < 64; i++) {
            nextTablero[i] = tablero[i]
        }
        nextTablero[x + y * 8] = piece
        nextTablero[px + py * 8] = 0
        if (jaque(1 - turn, nextTablero)[1]) {
            const audio = new Audio('assets/sounds/error.mp3');
            if (audio != null && ret) { audio.play() }
            ret = false
        }

        for (let i = 0; i < 64; i++) {
            if (valid[i] > 0) {
                for (let j = 0; j < 64; j++) {
                    nextTablero[j] = tablero[j]
                }
                nextTablero[px + py * 8] = 0
                nextTablero[i] = piece
                if (jaque(1 - turn, nextTablero)[1]) {
                    valid[i] = 0
                }
            }
        }
    }
    let validNum=0
    for(let i=0;i<64;i++){
        if(valid[i]>0){ validNum++ }
    }
    return [ret, valid, check,validNum]
}




function jaque(turn, tablero) {
    let ret = false
    let valid = []
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            valid[i + j * 8] = 0
            let piece = tablero[i + j * 8]
            if (piece != 0 && validMove(i, j, i, j, piece, tablero, turn, false)[2]) {////tal pieza causa un jaque
                valid[i + j * 8] = 1
                ret = true
            }
        }
    }
    return [valid, ret]
}

function peon(px, py, x, y, tablero, turn, valid) {
    let ret = false
    let dir = 1 - 2 * turn
    let st = 6
    if (dir > 0) { st = 1 }
    if (inboundsCheck(px, py + dir) && tablero[px + (py + dir) * 8] == 0) {//avanzar 1
        inbounds(valid, px, py + dir);
        if (inboundsCheck(px, py + dir * 2) && tablero[px + (py + dir * 2) * 8] == 0 && py == st) {//avenzar 2
            inbounds(valid, px, py + dir * 2);
        }
    }
    ////// COMER NORMAL
    if (inboundsCheck(px - 1, py + dir) && tablero[px - 1 + (py + dir) * 8] % 2 != turn % 2 && tablero[px - 1 + (py + dir) * 8] != 0) {
        inbounds(valid, px - 1, py + dir);
    }
    if (inboundsCheck(px + 1, py + dir) && tablero[px + 1 + (py + dir) * 8] % 2 != turn % 2 && tablero[px + 1 + (py + dir) * 8] != 0) {
        inbounds(valid, px + 1, py + dir);
    }
    /////////////////////// COMER AL PASO
    let enpassantflag = 0
    
    if (inboundsCheck(px - 1, py + dir) && tablero[px - 1 + (py) * 8] ==5+turn && tablero[px - 1 + (py + dir) * 8] == 0) {
        inbounds(valid, px - 1, py + dir);
        enpassantflag=1
    }
    if (inboundsCheck(px + 1, py + dir) && tablero[px + 1 + (py) * 8] ==5+turn && tablero[px + 1 + (py + dir) * 8] == 0) {
        inbounds(valid, px + 1, py + dir);
        enpassantflag=2
    }
    if(enpassantflag==1 && x == px - 1 && y == py+dir){
        tablero[x + (py) * 8] =0
    }
    if(enpassantflag==2 && x == px +1 && y == py+dir){
        tablero[x + (py) * 8] =0
    }
    ////////////////////////////

    if (valid[x + y * 8] > 0) {
        ret = true
    }
    
    return ret
}

function rey(px, py, x, y, tablero, turn, valid, checkcheck, mov) {
    let ret = false

    inbounds(valid, px, py - 1);
    inbounds(valid, px - 1, py - 1);
    inbounds(valid, px + 1, py - 1);
    inbounds(valid, px - 1, py);
    inbounds(valid, px + 1, py);
    inbounds(valid, px, py + 1);
    inbounds(valid, px - 1, py + 1);
    inbounds(valid, px + 1, py + 1);
    for (let i = 0; i < 64; i++) {
        if (valid[i] == 1) {
            if (tablero[i] % 2 == turn % 2 && tablero[i] != 0) { valid[i] = 0 }
        }
    }
    /////////////////////////////////////////////ENROQUE
    let rookflag = 0

    if (tablero[4 + 8 * 7 * turn] == 8 - turn && checkcheck) {///rey 
        if (mov[4 + 8 * 7 * turn] == 0) {
            if (tablero[0 + 8 * 7 * turn] == 2 - turn) {//torre izquierda
                if (mov[0 + 8 * 7 * turn] == 0) {
                    if (tablero[1 + 8 * 7 * turn] == 0 && tablero[2 + 8 * 7 * turn] == 0 && tablero[3 + 8 * 7 * turn] == 0) {// si está vacio
                        let nextTablero = []
                        for (let j = 0; j < 64; j++) {
                            nextTablero[j] = tablero[j]
                        }
                        nextTablero[4 + 8 * 7 * turn] = 0
                        nextTablero[3 + 8 * 7 * turn] = 8 - turn
                        if (!jaque(1 - turn, nextTablero)[1] && !jaque(1 - turn, tablero)[1]) {///SI NO ESTÁ EN JAQUE NI EN EL MEDIO
                            inbounds(valid, px - 2, py);
                            rookflag = 1
                        }
                    }
                }
            }
            if (tablero[7 + 8 * 7 * turn] == 2 - turn) {//torre derecha
                if (mov[7 + 8 * 7 * turn] == 0) {
                    if (tablero[6 + 8 * 7 * turn] == 0 && tablero[5 + 8 * 7 * turn] == 0) {// si está vacio
                        let nextTablero = []
                        for (let j = 0; j < 64; j++) {
                            nextTablero[j] = tablero[j]
                        }
                        nextTablero[4 + 8 * 7 * turn] = 0
                        nextTablero[5 + 8 * 7 * turn] = 8 - turn
                        if (!jaque(1 - turn, nextTablero)[1] && !jaque(1 - turn, tablero)[1]) {///SI NO ESTÁ EN JAQUE NI EN EL MEDIO
                            inbounds(valid, px + 2, py);
                            rookflag = 2
                        }
                    }
                }
            }
        }
    }
    if (rookflag = 1 && x == px - 2 && y == py) {
        tablero[0 + 8 * 7 * turn] = 0
        tablero[3 + 8 * 7 * turn] = 2 - turn
    }
    if (rookflag = 2 && x == px + 2 && y == py) {
        tablero[7 + 8 * 7 * turn] = 0
        tablero[5 + 8 * 7 * turn] = 2 - turn
    }
    ///////////////////////////////
    if (valid[x + y * 8] > 0) {
        ret = true
    }
    return ret
}

function caballo(px, py, x, y, tablero, turn, valid) {
    let ret = false

    inbounds(valid, px - 2, py - 1);
    inbounds(valid, px - 1, py - 2);
    inbounds(valid, px - 2, py + 1);
    inbounds(valid, px - 1, py + 2);
    inbounds(valid, px + 1, py - 2);
    inbounds(valid, px + 2, py - 1);
    inbounds(valid, px + 2, py + 1);
    inbounds(valid, px + 1, py + 2);
    for (let i = 0; i < 64; i++) {
        if (valid[i] == 1) {
            if (tablero[i] % 2 == turn % 2 && tablero[i] != 0) { valid[i] = 0 }
        }
    }

    if (valid[x + y * 8] > 0) {
        ret = true
    }
    return ret
}

function torre(px, py, x, y, tablero, turn, valid) {
    let ret = false

    lineaRecta(tablero, valid, px, py, turn)

    if (valid[x + y * 8] > 0) {
        ret = true
    }
    return ret
}

function alfil(px, py, x, y, tablero, turn, valid) {
    let ret = false

    diagonal(tablero, valid, px, py, turn)

    if (valid[x + y * 8] > 0) {
        ret = true
    }
    return ret
}
function reina(px, py, x, y, tablero, turn, valid) {
    let ret = false

    lineaRecta(tablero, valid, px, py, turn)
    diagonal(tablero, valid, px, py, turn)

    if (valid[x + y * 8] > 0) {
        ret = true
    }
    return ret
}

function diagonal(tablero, valid, px, py, team) {
    ////////esquina 1
    let ii = px + 1;
    let jj = py + 1;
    while (ii < 8 && jj < 8) {
        inbounds(valid, ii, jj);
        if (tablero[ii + jj * 8] > 0) {
            if (tablero[ii + jj * 8] % 2 != team % 2) {
                break;
            }
            if (tablero[ii + jj * 8] % 2 == team % 2) {
                valid[ii + 8 * jj] = 0;
                break;
            }
        }
        ii++;
        jj++;
    }
    ////////esquina 2
    ii = px - 1;
    jj = py - 1;
    while (ii >= 0 && jj >= 0) {
        inbounds(valid, ii, jj);
        if (tablero[ii + jj * 8] > 0) {
            if (tablero[ii + jj * 8] % 2 != team % 2) {
                break;
            }
            if (tablero[ii + jj * 8] % 2 == team % 2) {
                valid[ii + 8 * jj] = 0;
                break;
            }
        }
        ii--;
        jj--;
    }

    ////////esquina 3
    ii = px + 1;
    jj = py - 1;
    while (ii < 8 && jj >= 0) {
        inbounds(valid, ii, jj);
        if (tablero[ii + jj * 8] > 0) {
            if (tablero[ii + jj * 8] % 2 != team % 2) {
                break;
            }
            if (tablero[ii + jj * 8] % 2 == team % 2) {
                valid[ii + 8 * jj] = 0;
                break;
            }
        }
        ii++;
        jj--;
    }
    ////////esquina 4
    ii = px - 1;
    jj = py + 1;
    while (ii >= 0 && jj < 8) {
        inbounds(valid, ii, jj);
        if (tablero[ii + jj * 8] > 0) {
            if (tablero[ii + jj * 8] % 2 != team % 2) {
                break;
            }
            if (tablero[ii + jj * 8] % 2 == team % 2) {
                valid[ii + 8 * jj] = 0;
                break;
            }
        }
        ii--;
        jj++;
    }

}

function lineaRecta(tablero, valid, px, py, team) {
    ////////linea recta en x
    for (let i = px + 1; i < 8; i++) {
        inbounds(valid, i, py);
        if (tablero[i + py * 8] > 0) {
            if (tablero[i + py * 8] % 2 != team % 2) {
                break;
            }
            if (tablero[i + py * 8] % 2 == team % 2) {
                valid[i + 8 * py] = 0;
                break;
            }
        }
    }
    for (let i = px - 1; i >= 0; i--) {
        inbounds(valid, i, py);
        if (tablero[i + py * 8] > 0) {
            if (tablero[i + py * 8] % 2 != team % 2) {
                break;
            }
            if (tablero[i + py * 8] % 2 == team % 2) {
                valid[i + 8 * py] = 0;
                break;
            }
        }
    }

    ////////linea recta en y
    for (let j = py + 1; j < 8; j++) {
        inbounds(valid, px, j);
        if (tablero[px + j * 8] > 0) {
            if (tablero[px + j * 8] % 2 != team % 2) {
                break;
            }
            if (tablero[px + j * 8] % 2 == team % 2) {
                valid[px + 8 * j] = 0;
                break;
            }
        }
    }
    for (let j = py - 1; j >= 0; j--) {
        inbounds(valid, px, j);
        if (tablero[px + j * 8] > 0) {
            if (tablero[px + j * 8] % 2 != team % 2) {
                break;
            }
            if (tablero[px + j * 8] % 2 == team % 2) {
                valid[px + 8 * j] = 0;
                break;
            }
        }
    }
}

function inboundsCheck(x, y) {
    let ret = false;
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        ret = true;
    }
    return ret;
}

function inbounds(array, x, y) {
    if (inboundsCheck(x, y)) {
        array[x + y * 8] = 1;
    }
}