import { Agent } from '../Agent/Agent'
import { GreedyAgent } from '../Greedy/GreedyAgent'
import { ABPruning } from '../ABPruning/ABPruning'
import { MCTS } from '../MCTS/MCTS'
import { Rule } from '../../ChineseChess/Rule/Rule'

export class State {
    redAgent: Agent;
    blackAgent: Agent;
    playingTeam: number;
  //  is_repeating = false;
    reverse = false;
    constructor(redAgent: Agent, blacAgent: Agent, playingTeam = 1,reverse, updateDict = false) {
        this.redAgent = redAgent;
        this.blackAgent = blacAgent;
        this.playingTeam = playingTeam;
        this.blackAgent.setOppoAgent(this.redAgent);
        this.redAgent.setOppoAgent(this.blackAgent);
        this.reverse = reverse ;
    }

    // return playing agent in control
    get_playing_agent() { return this.playingTeam == 1 ? this.redAgent : this.blackAgent; }

    // return | 1:win | -1:lose | 0:continue for playing team
    getEndState() {
        var playing = this.get_playing_agent();
        var endState = Rule.getGameEndState(playing);
        return endState;
    }
    // return a copy of state
    copy() { return new State(this.redAgent.copy(), this.blackAgent.copy(), this.playingTeam , this.reverse); }

    // return next state by action
    next_state(movePieceName, toPos) {
        return this.get_next_by_team(movePieceName, toPos, this.playingTeam);
    }

    checkMate(){
        return this.blackAgent.checkMate();
    }

    
    get_next_by_team(movePieceName, toPos, team) {
        // make a copy a state
        var nextState = this.copy();
        nextState.switchTurn();
        var agent = nextState.get_playing_agent().oppoAgent;
        agent.movePieceTo(agent.getPieceByName(movePieceName), toPos);
        return nextState;
    }

    switchTurn() { this.playingTeam = -this.playingTeam; }

    // return a evaluation score for this state
    getEvaludation(team) { }
    static samveMove(move1, move2) {
        return move1.name == move2.name && (move1.position.toString() == move2.position.toString());
    }

    // static check_repeating(agent): boolean {
    //     var moves = agent.pastMoves;
    //     var n = moves.length;
    //     if (n < 10) return false;
    //     if (this.samveMove(moves[n - 1], moves[n - 3]) && this.samveMove(moves[n - 5], moves[n - 3])) {
    //         console.log(moves)
    //         return true;
    //     };
    //     return false;
    // }
    static  copyFromDict(dict) {
        var agentDict;
        var agentDict = dict.blackAgent;
        var oppo = dict.redAgent;
        var IsReverse = dict.reverse;
        
        oppo = Agent.copyFromDict(oppo);
        var agent;
      
        if (agentDict.strategy == 0) agent = GreedyAgent.copyFromDict(agentDict);
        if (agentDict.strategy == 1) agent = ABPruning.copyFromDict(agentDict);
        console.log("asdasdadssad",agentDict.DEPT)
        if (agentDict.strategy == 2) agent = MCTS.copyFromDict(agentDict);
        
        var new_state;
        if (dict.playingTeam == 1) new_state = new State(agent, oppo, dict.playingTeam,IsReverse);
        else new_state = new State(oppo, agent, dict.playingTeam,IsReverse);
           return new_state;
      
    }
    nextMove() {
        var agent = this.get_playing_agent();
        var r = null;
        if (agent.check_king_exist()) {
            r = agent.comptuteNextMove(this);
        } else console.log("-=-=-=-=-=- KING DIED -=-=-=-=-=-", r)
        return r;
      
    }
    
}
