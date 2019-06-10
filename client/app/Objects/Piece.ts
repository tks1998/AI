export class Piece {

    name: string; //j1 j2 his.name[0] 
    position: [number, number]; // (row, column)
    Reverse: boolean; // chess reverse = 1 , else = 0  
    truthname: string;
    isMove: number;
    constructor(name, position, Reverse, Tname, isMove) {
        this.name = name;
        this.position = position;
        this.Reverse = true;
        this.truthname = Tname;
        this.isMove = 0;
    }


    static copyFromDict(dict) {
        return new Piece(dict.name, dict.position, dict.Reverse, dict.truthname, dict.isMove);
    }


    moveTo(newPos) {
        console.log("toi loi", newPos)
        this.position = newPos;
        this.name = this.truthname;
        this.isMove = this.isMove + 1;
    }


    // return a copy of a piece
    copy() {
        return new Piece(this.name, this.position, this.Reverse, this.truthname, this.isMove);
    }

    
    update(name) {
        this.name = this.truthname;
    }
}