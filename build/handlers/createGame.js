"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var utils_1 = require("../utils");
var constants_1 = require("../constants");
var types_1 = require("../types");
var randomizeAndPickN = function (arr, n) { return __spreadArrays(arr).sort(function () { return 0.5 - Math.random(); })
    .slice(0, n); };
var flatten = function (arr) { return arr
    .reduce(function (acc, nextL) { return acc.concat(nextL); }, []); };
var filterLists = function (arr, excludeLists) { return __spreadArrays(arr).filter(function (w) { return !flatten(excludeLists).includes(w); }); };
var createBoard = function (startingTeam) {
    var board = [];
    var allWords = JSON.parse(fs.readFileSync(constants_1.WORD_LIST_PATH).toString());
    var wordsForThisGame = randomizeAndPickN(allWords, constants_1.BOARD_DIMENSION * constants_1.BOARD_DIMENSION);
    var startingTeamSquares = randomizeAndPickN(wordsForThisGame, constants_1.NUM_STARTING_TEAM_SQUARES);
    var otherTeamSquares = randomizeAndPickN(filterLists(wordsForThisGame, [startingTeamSquares]), constants_1.NUM_NOT_STARTING_TEAM_SQUARES);
    var bombSquares = randomizeAndPickN(filterLists(wordsForThisGame, [startingTeamSquares, otherTeamSquares]), 1);
    for (var row = 0; row < constants_1.BOARD_DIMENSION; row += 1) {
        if (!board[row]) {
            board[row] = [];
        }
        var _loop_1 = function (col) {
            var word = wordsForThisGame[(row * constants_1.BOARD_DIMENSION) + col];
            var team = function () {
                if (startingTeamSquares.includes(word)) {
                    return startingTeam === types_1.Team.RED ? types_1.SquareType.RED : types_1.SquareType.BLUE;
                }
                if (otherTeamSquares.includes(word)) {
                    return startingTeam === types_1.Team.RED ? types_1.SquareType.BLUE : types_1.SquareType.RED;
                }
                if (bombSquares.includes(word)) {
                    return types_1.SquareType.BOMB;
                }
                return types_1.SquareType.NEUTRAL;
            };
            board[row][col] = {
                word: word,
                type: team(),
                revealed: false,
            };
        };
        for (var col = 0; col < constants_1.BOARD_DIMENSION; col += 1) {
            _loop_1(col);
        }
    }
    return board;
};
var createGame = function (startingTeam) { return ({
    board: createBoard(startingTeam),
    turn: startingTeam,
    redScore: startingTeam === types_1.Team.RED ? constants_1.NUM_STARTING_TEAM_SQUARES : constants_1.NUM_NOT_STARTING_TEAM_SQUARES,
    blueScore: startingTeam === types_1.Team.BLUE ? constants_1.NUM_STARTING_TEAM_SQUARES : constants_1.NUM_NOT_STARTING_TEAM_SQUARES,
    startingTeam: startingTeam,
}); };
var handleCreateGameRequest = function (request) {
    console.log('Creating new game:', request);
    var gameId = request.gameId;
    if (!gameId) {
        console.log('Ignoring undefined gameId.');
        return;
    }
    var gameExists = fs.existsSync(utils_1.gamePath(gameId));
    if (gameExists) {
        console.log('Game already exists. Not creating again.', gameId);
    }
    else {
        var game_1 = createGame(constants_1.STARTING_TEAM);
        fs.writeFile(utils_1.gamePath(gameId), JSON.stringify(game_1), function () { return console.log('Game created.', game_1); });
    }
};
exports.default = handleCreateGameRequest;
