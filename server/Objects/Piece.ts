export class Piece {

    name: string; 
    position: [number, number]; // (row, column)
    Reverse : boolean; // chess reverse = 1 , else = 0  
    truthname : string;
    isMove : number ;
    constructor(name, position , Reverse , Tname , isMove ) {
        this.name = name;
        this.position = position;
        this.Reverse = true ;
        this.truthname = Tname;
        this.isMove = 0;
    }
    
    static copyFromDict(dict) {
        return new Piece(dict.name, dict.position,dict.Reverse,dict.truthname,dict.isMove);
    }
    

    moveTo(newPos) {
        this.position = newPos; 
        this.name = this.truthname ;
    }

    // return a copy of a piece
    copy() {
        return new Piece(this.name, this.position , this.Reverse ,this.truthname,this.isMove);
    }   

    update(name){
        this.name=this.truthname;
    }
}