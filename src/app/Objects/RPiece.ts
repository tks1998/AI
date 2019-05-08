export class RPiece {

    name: string;
    position: [number, number]; // (row, column)
    Reverse : boolean; // chess reverse = 1 , else = 0  
    truthname : string;
    constructor(name, position , Reverse , Tname) {
        this.name = name;
        this.position = position;
        this.Reverse = true ;
        this.truthname = Tname;
    }
    
    static copyFromDict(dict) {
        return new RPiece(dict.name, dict.position,dict.Reverse,dict.truthname);
    }


    moveTo(newPos) {
        this.position = newPos; 
        this.name = this.truthname ;
    }

    // return a copy of a piece
    copy() {
        return new RPiece(this.name, this.position , this.Reverse ,this.truthname );
    }   

    update(name){
        this.name=this.truthname;
    }
}