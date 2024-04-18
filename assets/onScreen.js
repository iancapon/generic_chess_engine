export function drawBoard(white, black, c, tablero, piezas) {////c: context
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let color;
            if ((i + j) % 2 == 0) {
                color = white
            } else {
                color = black
            }
            let sqrSize = canvas.width / 8
            if (tablero[i + j * 8] == 0) {
                c.fillStyle = color
                c.fillRect(i * sqrSize, j * sqrSize, sqrSize, sqrSize)
            } else {
                insertarImagen(i, j, sqrSize, color, c, tablero, piezas)
            }
        }
    }
}

function insertarImagen(x, y, size, bgcolor, c, tablero, piezas) {
    let img = new Image()
    img.src = piezas[tablero[x + y * 8] - 1]
    img.onload = function () {
        c.fillStyle = bgcolor
        c.fillRect(x * size, y * size, size, size)
        c.drawImage(img, x * size, y * size, size, size)
    }
}

export function drawPossible(white, black, c, tablero, piezas, validArray,pos) {////le paso el valid<arr> de la pieza que quiero ver
    let valid=validArray[pos[0]+8*pos[1]]
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (valid[i + j * 8] > 0) {
                let color;
                if ((i + j) % 2 == 0) {
                    color = white
                } else {
                    color = black
                }
                let sqrSize = canvas.width / 8
                if (tablero[i + j * 8] == 0) {
                    c.fillStyle = color
                    c.fillRect(i * sqrSize, j * sqrSize, sqrSize, sqrSize)
                    drawCircle(i, j, valid, c, sqrSize)
                } else {
                    insertarImagenCircle(i, j, sqrSize, color, c, tablero, piezas, valid)
                }
                
            }
        }
    }
}

function insertarImagenCircle(x, y, size, bgcolor, c, tablero, piezas,valid) {
    let img = new Image()
    img.src = piezas[tablero[x + y * 8] - 1]
    img.onload = function () {
        c.fillStyle = bgcolor
        c.fillRect(x * size, y * size, size, size)
        c.drawImage(img, x * size, y * size, size, size)
        drawCircle(x, y, valid, c, size)

    }
}

function drawCircle(i, j, valid, c, sqrSize) {
    if (valid[i + j * 8] > 0) {
        if (valid[i + j * 8] == 1) {
            c.strokeStyle = 'blue';
        }
        if (valid[i + j * 8] == 2 || valid[i + j * 8] == 4 || valid[i + j * 8] == 5) {
            c.strokeStyle = 'orange';
        }
        if (valid[i + j * 8] == 3) {
            c.strokeStyle = 'red';
        }
        c.beginPath();
        c.arc((0.5 + i) * sqrSize, (0.5 + j) * sqrSize, sqrSize / 4, 0, Math.PI * 2, false);
        c.stroke();
    }
}

