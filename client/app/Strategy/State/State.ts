import { Agent } from '../Agent/Agent'
import { Rule } from '../../ChineseChess/Rule/Rule'

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
        if (reverse==true ) console.log("111111111111111111");
        this.redAgent = redAgent;
        this.blackAgent = blacAgent;
        this.playingTeam = playingTeam; 
        this.reverse = reverse ;
        if (setOppoo) {
            this.blackAgent.setOppoAgent(this.redAgent);
            this.redAgent.setOppoAgent(this.blackAgent);
        }
    }

    // TDlearning
    learn(nSimulations) {
        this.redAgent.update_weights(nSimulations, this.endFlag);
        this.blackAgent.update_weights(nSimulations, this.endFlag);
    }
    record_feature(feature_vec) {
        // console.log("record_feature")
        this.redAgent.save_state(feature_vec);
        this.blackAgent.save_state(feature_vec);
    }

    // return | 1:win | -1:lose | 0:continue for playing team
    getEndState() {
        var playing = this.playingTeam == 1 ? this.redAgent : this.blackAgent;
        var endState = Rule.getGameEndState(playing);
        return endState;
    }
    // return a copy of state
    
    copy(setOppoo = true) {
        var newState = new State(this.redAgent.copy(), this.blackAgent.copy(), this.reverse , this.playingTeam, setOppoo);
        return newState;
    }

    switchTurn() {
        this.playingTeam = -this.playingTeam;
    }
    getEvaludation(team) {

    }

}
