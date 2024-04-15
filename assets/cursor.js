import validMove from "./rules.js"
export default class Cursor {

    constructor(x, y, sqrSize, tablero, c) {
        this.x = x
        this.y = y
        this.prevX = x
        this.prevY = y
        this.truex = x
        this.truey = y
        this.sqrSize = sqrSize
        this.piece = 0;
        this.prevPiece = 0
        this.hand = 0;
        this.turn = 1
        this.clickCount = 0
        this.c = c
    }


    click(array) {

        console.log("x:" + this.x + " y:" + this.y)
        this.x = this.truex
        this.y = this.truey
        this.piece = array[this.x + this.y * 8];
        this.clickCount++
        if (this.hand == 0 && this.piece != 0 && this.turn % 2 == this.piece % 2) {
            this.hand = 2;
            this.prevPiece = this.piece;
            this.prevX = this.x;
            this.prevY = this.y;
        }
        if (this.hand == 1 && validMove(this, array, this.turn)[0] && this.prevPiece != this.piece) {
            array[this.x + this.y * 8] = this.prevPiece;
            array[this.prevX + this.prevY * 8] = 0;
            this.hand = 0
            if (this.turn == 1) { this.turn = 2; }
            if (this.turn == 0) { this.turn = 1; }
            if (this.turn == 2) { this.turn = 0; }
            console.log("turn:" + this.turn)
        }
        if (this.hand == 1 && (this.prevPiece == this.piece || !validMove(this, array, this.turn)[0])) {
            this.hand = 0
        }
        if (this.hand == 2) {
            this.hand = 1
        }
        console.log("hand:" + this.hand + " cc:" + this.clickCount)
    }
    signal(tablero) {
        if (this.hand == 1) {
            this.c.beginPath();
            this.c.arc((0.5 + this.x) * this.sqrSize, (0.5 + this.y) * this.sqrSize, this.sqrSize / 2, 0, Math.PI * 2, false);
            this.c.strokeStyle = 'blue';
            this.c.stroke();

            let valid = validMove(this, tablero, this.turn)[1]
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (valid[i + j * 8] > 0) {
                        if (valid[i + j * 8] == 1) {
                            this.c.strokeStyle = 'blue';
                        }
                        if (valid[i + j * 8] == 2) {
                            this.c.strokeStyle = 'red';
                        }
                        if (valid[i + j * 8] == 3) {
                            this.c.strokeStyle = 'orange';
                        }
                        this.c.beginPath();
                        this.c.arc((0.5 + i) * this.sqrSize, (0.5 + j) * this.sqrSize, this.sqrSize / 4, 0, Math.PI * 2, false);
                        this.c.stroke();
                    }
                }
            }
        }
    }


}