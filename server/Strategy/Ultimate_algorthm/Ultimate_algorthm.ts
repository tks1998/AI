
import { Agent } from '../Agent/Agent'
import { Piece } from '../../Objects/Piece'
import { Evaluation } from '../_Param/Evaluation'

export class Ultimate_algorthm extends Agent {

    strategy = 0;
    DEPTH = 1;

    // private method of computing next move
    comptuteNextMove(state) {
        this.updateState();
        return this.greedy_move();
    }

    static copyFromDict(dict) {
        return new Ultimate_algorthm(dict.team, this.piecesFromDict(dict.myPieces));
    }

}
