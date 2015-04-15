/**
 * Created by Kostya on 4/14/2015.
 */
var Classes = {};

Classes.Gladiator = {
    maxHealth: 650,

    BasicAttack: function() {
        this.state = "casting";
        this.castTime = 1000;
        this.startTime = Date.now();

        this.update = function() {
            switch(this.state) {
                case "casting":
                    if (Date.now() > this.startTime + this.castTime) {

                    }
                    break;
                case "dead":
                    break;
            }
        };
        this.draw = function(ctx) {
        };
    }
};