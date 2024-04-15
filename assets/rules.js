export default function validMove(mano, tablero, turn) {
    let ret = false
    let piece = mano.prevPiece
    let valid = []
    for (let i = 0; i < 64; i++) { valid[i] = 0 }

    if (turn % 2 == piece % 2) {

        switch (piece) {
            case 1:
                ret = torre(mano, tablero, turn, valid)
                break;
            case 2:
                ret = torre(mano, tablero, turn, valid)
                break;
            case 3:
                ret = reina(mano, tablero, turn, valid)
                break;
            case 4:
                ret = reina(mano, tablero, turn, valid)
                break;
            case 5:
                ret = peon(mano, tablero, turn, valid)
                break;
            case 6:
                ret = peon(mano, tablero, turn, valid)
                break;
            case 7:
                ret= rey(mano,tablero,turn,valid)
                break;
            case 8:
                ret= rey(mano,tablero,turn,valid)
                break;
            case 9:
                ret = alfil(mano, tablero, turn, valid)
                break;
            case 10:
                ret = alfil(mano, tablero, turn, valid)
                break;
            case 11:
                ret= caballo(mano,tablero,turn,valid)
                break;
            case 12:
                ret= caballo(mano,tablero,turn,valid)
                break;

        }
    }
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (tablero[i + j * 8] == 7 + turn && valid[i + j * 8] == 1) {
                valid[i + j * 8] = 2
            }
            if (tablero[i + j * 8] != 7 + turn && tablero[i + j * 8] > 0 && valid[i + j * 8] == 1) {
                valid[i + j * 8] = 3
            }
        }
    }
    if (valid[mano.x + mano.y * 8] == 2) {
        ret = false
    }

    return [ret, valid]
}

function peon(mano, tablero, turn, valid) {
    let ret = false
    let px = mano.prevX
    let py = mano.prevY
    let x = mano.x
    let y = mano.y
    let dir = 1 - 2 * turn
    let st = 6
    if (dir > 0) { st = 1 }
    if (inboundsCheck(px, py + dir) && tablero[px + (py + dir) * 8] == 0) {
        inbounds(valid, px, py + dir);
        if (inboundsCheck(px, py + dir * 2) && tablero[px + (py + dir * 2) * 8] == 0 && py == st) {
            inbounds(valid, px, py + dir * 2);
        }
    }
    if (inboundsCheck(px - 1, py + dir) && tablero[px - 1 + (py + dir) * 8] % 2 != turn % 2 && tablero[px - 1 + (py + dir) * 8] != 0) {
        inbounds(valid, px - 1, py + dir);
    }
    if (inboundsCheck(px + 1, py + dir) && tablero[px + 1 + (py + dir) * 8] % 2 != turn % 2 && tablero[px + 1 + (py + dir) * 8] != 0) {
        inbounds(valid, px + 1, py + dir);
    }
    if (valid[x + y * 8] > 0) {
        ret = true
    }
    return ret
}

function rey(mano, tablero, turn, valid) {
    let ret = false
    let px = mano.prevX
    let py = mano.prevY
    let x = mano.x
    let y = mano.y

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
            if (tablero[i] % 2 == turn % 2 && tablero[i]!=0) { valid[i] = 0 }
        }
    }

    if (valid[x + y * 8] > 0) {
        ret = true
    }
    return ret
}

function caballo(mano, tablero, turn, valid) {
    let ret = false
    let px = mano.prevX
    let py = mano.prevY
    let x = mano.x
    let y = mano.y

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
            if (tablero[i] % 2 == turn % 2 && tablero[i]!=0) { valid[i] = 0 }
        }
    }

    if (valid[x + y * 8] > 0) {
        ret = true
    }
    return ret
}

function torre(mano, tablero, turn, valid) {
    let ret = false
    let px = mano.prevX
    let py = mano.prevY
    let x = mano.x
    let y = mano.y

    lineaRecta(tablero, valid, px, py, turn)

    if (valid[x + y * 8] > 0) {
        ret = true
    }
    return ret
}

function alfil(mano, tablero, turn, valid) {
    let ret = false
    let px = mano.prevX
    let py = mano.prevY
    let x = mano.x
    let y = mano.y

    diagonal(tablero, valid, px, py, turn)

    if (valid[x + y * 8] > 0) {
        ret = true
    }
    return ret
}
function reina(mano, tablero, turn, valid) {
    let ret = false
    let px = mano.prevX
    let py = mano.prevY
    let x = mano.x
    let y = mano.y

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