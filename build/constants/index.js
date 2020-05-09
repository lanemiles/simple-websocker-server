"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../types");
exports.GAME_PATH_PREFIX = './resources/games/';
exports.WORD_LIST_PATH = './resources/words.json';
exports.BOARD_DIMENSION = 5;
exports.STARTING_TEAM = types_1.Team.BLUE;
exports.NUM_STARTING_TEAM_SQUARES = 9;
exports.NUM_NOT_STARTING_TEAM_SQUARES = exports.NUM_STARTING_TEAM_SQUARES - 1;
