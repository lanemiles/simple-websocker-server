"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RequestType;
(function (RequestType) {
    RequestType["CREATE_GAME"] = "CREATE_GAME";
    RequestType["LOAD_GAME"] = "LOAD_GAME";
    RequestType["MAKE_MOVE"] = "MAKE_MOVE";
})(RequestType = exports.RequestType || (exports.RequestType = {}));
var Team;
(function (Team) {
    Team["RED"] = "RED";
    Team["BLUE"] = "BLUE";
})(Team = exports.Team || (exports.Team = {}));
var SquareType;
(function (SquareType) {
    SquareType["RED"] = "RED";
    SquareType["BLUE"] = "BLUE";
    SquareType["NEUTRAL"] = "NEUTRAL";
    SquareType["BOMB"] = "BOMB";
})(SquareType = exports.SquareType || (exports.SquareType = {}));
