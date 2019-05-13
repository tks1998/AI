"use strict";
var StateFeatureExtractor = (function () {
    function StateFeatureExtractor() {
    }
    // number of Center cannon
    StateFeatureExtractor.num_center_cannon = function (agent) {
        var n = 0;
        if (agent.myPiecesDic['p1'] && agent.myPiecesDic['p1'][1] == 5)
            n += 1;
        if (agent.myPiecesDic['p2'] && agent.myPiecesDic['p2'][1] == 5)
            n += 1;
        return n;
    };
    // number of bottom cannon
    StateFeatureExtractor.num_bottom_cannon = function (agent) {
        var n = 0;
        if (agent.team == 1) {
            if (agent.myPiecesDic['p1'] && agent.myPiecesDic['p1'][0] == 10)
                n += 1;
            if (agent.myPiecesDic['p2'] && agent.myPiecesDic['p2'][0] == 10)
                n += 1;
        }
        else {
            if (agent.myPiecesDic['p1'] && agent.myPiecesDic['p1'][0] == 1)
                n += 1;
            if (agent.myPiecesDic['p2'] && agent.myPiecesDic['p2'][0] == 1)
                n += 1;
        }
        return n;
    };
    return StateFeatureExtractor;
}());
exports.StateFeatureExtractor = StateFeatureExtractor;
//# sourceMappingURL=StateFeatureExtractor.js.map