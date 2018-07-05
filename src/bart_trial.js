var bookingTrial = (function(){
    // constants 
    const CONSECUTIVE_THRESHOLD = 3;
    const PUMPS_THRESHOLD = 10;
    // this threshold was not actually used as discrimation, just end the game earlier if there aren't not enough chances to learn
    const UPPER_BOUND_POP = 21;
    const LOWER_BOUND_POP = 21;
    const MONEY_EARNED_THRESHOLD = 10.00;
    const MONEY_PER_PUMP = 0.02;
    
    var publicScope = {};
    publicScope.balloons = 
    [ { b: 1, o: { popprob: 26, color: 'blue' } },
    { b: 1, o: { popprob: 11, color: 'red'} },
    { b: 1, o: { popprob: 23, color: 'blue' } },
    { b: 1, o: { popprob: 13, color: 'red' } },
    { b: 1, o: { popprob: 27, color: 'blue' } },
    { b: 1, o: { popprob: 9, color: 'red' } },
    { b: 1, o: { popprob: 24, color: 'blue' } },
    { b: 1, o: { popprob: 10, color: 'red' } },
    { b: 1, o: { popprob: 23, color: 'blue' } },
    { b: 1, o: { popprob: 11, color: 'red' } },
    { b: 1, o: { popprob: 28, color: 'blue' } },
    { b: 1, o: { popprob: 8, color: 'red' } },
    { b: 1, o: { popprob: 28, color: 'blue' } },
    { b: 1, o: { popprob: 12, color: 'red' } },
    { b: 1, o: { popprob: 26, color: 'blue' } },
    { b: 1, o: { popprob: 7, color: 'red' } },
    { b: 1, o: { popprob: 22, color: 'blue' } },
    { b: 1, o: { popprob: 10, color: 'red' } },
    { b: 1, o: { popprob: 24, color: 'blue' } },
    { b: 1, o: { popprob: 9, color: 'red' } },
    { b: 1, o: { popprob: 22, color: 'blue' } },
    { b: 1, o: { popprob: 12, color: 'red' } },
    { b: 1, o: { popprob: 27, color: 'blue' } },
    { b: 1, o: { popprob: 8, color: 'red' } }, //last, 24th
    { b: 1, o: { popprob: 12, color: 'blue' } },// new, 25th     
    { b: 1, o: { popprob: 22, color: 'red'} },
    { b: 1, o: { popprob: 8, color: 'blue' } },
    { b: 1, o: { popprob: 19, color: 'red' } },
    { b: 1, o: { popprob: 12, color: 'blue' } },
    { b: 1, o: { popprob: 23, color: 'red' } },
    { b: 1, o: { popprob: 9, color: 'blue' } },
    { b: 1, o: { popprob: 22, color: 'red' } },
    { b: 1, o: { popprob: 8, color: 'blue' } },
    { b: 1, o: { popprob: 20, color: 'red' } },
    { b: 1, o: { popprob: 11, color: 'blue' } },
    { b: 1, o: { popprob: 20, color: 'red' } },
    { b: 1, o: { popprob: 8, color: 'blue' } },
    { b: 1, o: { popprob: 23, color: 'red' } },
    { b: 1, o: { popprob: 13, color: 'blue' } },
    { b: 1, o: { popprob: 19, color: 'red' } },
    { b: 1, o: { popprob: 9, color: 'blue' } },
    { b: 1, o: { popprob: 19, color: 'red' } },
    { b: 1, o: { popprob: 7, color: 'blue' } },
    { b: 1, o: { popprob: 24, color: 'red' } },
    { b: 1, o: { popprob: 11, color: 'blue' } },
    { b: 1, o: { popprob: 18, color: 'red' } },
    { b: 1, o: { popprob: 12, color: 'blue' } },
    { b: 1, o: { popprob: 23, color: 'red' } },
];
    
    publicScope.handleTurn = function(o, s) {
        // it should be 24
        var round2 = publicScope.balloons.length/2;
        // it should be 48
        var endgame = publicScope.balloons.length;
        //odd is blue, even is red for s.id. Reverse for index starting in 0
        var consecutive = 0;
        // console.log("id:" + s.id + "learned 1 and 2: " + o.learned1 + "," + o.learned2);
        var redPopped = 0;
        var bluePopped = 0;
        var start = 0;
        
        var limitBlue = LOWER_BOUND_POP;
        var limitRed = UPPER_BOUND_POP;
        
        if (s.id > round2) {
            start = round2;
            limitBlue = UPPER_BOUND_POP;
            limitRed = LOWER_BOUND_POP;
        }
        for (var i=start; i < s.id; i++) {
            if (i % 2 == 0) {
                bluePopped += parseInt($("#" + o.frmids_exploded[i]).val());
            }
            else {
                redPopped += parseInt($("#" + o.frmids_exploded[i]).val()); 
            }
        }
        // console.log("popped Blue and Red: " + bluePopped + "," + redPopped);
        if ((redPopped > limitRed) || (bluePopped > limitBlue)) {
            return endgame-1;
        }
        //if is the red balloon
        if (s.id % 2 == 0) {
            for (var i=s.id; i >= 1; i-=2) {
                // disregard popped ballons
                var redExploded = parseInt($("#" + o.frmids_exploded[i-1]).val());
                var blueExploded = parseInt($("#" + o.frmids_exploded[i-2]).val());
                if (redExploded || blueExploded) {
                    continue;
                }
                var red = parseInt($("#" + o.frmids_pumps[i-1]).val());
                var blue = parseInt($("#" + o.frmids_pumps[i-2]).val());
                //console.log("red: " + red + ",blue: " + blue);
                if (s.id <= round2) {
                    if ((blue - red) >= PUMPS_THRESHOLD) {
                        consecutive++;
                    } else {
                        break;
                    }
                } else {
                    if ((red - blue) >= PUMPS_THRESHOLD) {
                        consecutive++;
                    } else {
                        break;
                    }
                }
                // X consectuives discriminations
                if (consecutive == CONSECUTIVE_THRESHOLD) {
                    // move to round2
                    if (s.id <= round2) {
                        o.learned1 = true;
                        return round2-1;
                    }
                    //early ending, shall we keep it?
                    else {
                        o.learned2 = true;
                        return endgame-1;
                    }
                }
            }
        }
        if ((o.earned == MONEY_EARNED_THRESHOLD) || (!o.learned1 && s.id == round2)) {
            //no discriminatory learning, abort
            return endgame-1;
        }
    }
    
    publicScope.money_per_pump = MONEY_PER_PUMP;
    
    return publicScope;
}());