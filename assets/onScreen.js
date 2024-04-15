export function drawBoard(white, black,c,tablero,piezas){////c: context
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
                insertarImagen(i, j, sqrSize, color,c,tablero,piezas)
            }
        }
    }
}

function insertarImagen(x, y, size, bgcolor,c,tablero,piezas) {
    let img = new Image()
    img.src = piezas[tablero[x + y * 8] - 1]
    img.onload = function () {
        c.fillStyle = bgcolor
        c.fillRect(x * size, y * size, size, size)
        c.drawImage(img, x * size, y * size, size, size)
    }
}