import { Agent } from '../Agent/Agent'
import { Rule } from '../../ChineseChess/Rule/Rule'
import { BoardComponent } from '../../component_board/board';
import { state } from '@angular/core';

// get current state red team && get current state blue team
export class State {
    redAgent: Agent;
    blackAgent: Agent;
    playingTeam: number;
    endFlag = null; // null: on going | 1: red win | -1: black win | 0: draw
    // create reverse check state piece && current support -> import data from user 
    reverse = false;
    currentstate = {};
     
    
    constructor(redAgent: Agent, blacAgent: Agent, reverse  ,playingTeam = 1, setOppoo = true ) {
        this.redAgent = redAgent;
        this.blackAgent = blacAgent;
        
        this.playingTeam = playingTeam; 
        this.reverse = reverse ;
        if (setOppoo) {
            this.blackAgent.setOppoAgent(this.redAgent);
            this.redAgent.setOppoAgent(this.blackAgent);
        }
    }

   

    // return | 1:win | -1:lose | 0:continue for playing team
    getEndState() {
        var playing = this.playingTeam == 1 ? this.redAgent : this.blackAgent;
        var endState = Rule.getGameEndState(playing);
        return endState;
    }
    // return a copy of state
    
    copy(setOppoo = true) {
        let newState :State =  new State(this.redAgent.copy(), this.blackAgent.copy(), this.reverse , this.playingTeam, setOppoo);
        return newState;
    }

    checkMate(){
        this.redAgent.updateBoardState();
        if (this.getEndState()!=0) return false;
        return this.redAgent.checkMate();
    }

    switchTurn() {
        this.playingTeam = -this.playingTeam;
    }
    getEvaludation(team) {

    }

}
