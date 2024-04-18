export default class cursor {

    constructor(x, y, sqrSize) {
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
    }


    click(array,turno) {
        let success=false
        this.x = this.truex
        this.y = this.truey
        this.piece = array[this.x + this.y * 8];
        if (this.hand == 0 && this.piece != 0 && turno == this.piece % 2) {
            this.hand = 2;
            this.prevPiece = this.piece;
            this.prevX = this.x;
            this.prevY = this.y;
        }
        if (this.hand == 1 && this.prevPiece != this.piece) {
            this.hand = 0
            success=true
            
        }
        if (this.hand == 1 && this.prevPiece == this.piece) {
            this.hand = 0
        }
        if (this.hand == 2) {
            this.hand = 1
        }
        return success
    }
}