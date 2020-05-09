"use strict";
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
var types_1 = require("../types");
var handleMakeMoveRequest = function (request, clientMap) {
    console.log('Making move:', request);
    var gameId = request.gameId, team = request.team, row = request.row, col = request.col;
    if (!gameId) {
        console.log('Ignoring undefined gameId.');
        return;
    }
    // Load game
    var game = JSON.parse(fs.readFileSync(utils_1.gamePath(gameId)).toString());
    // Ensure game isn't over
    if (game.winner) {
        console.log('Game is already over. Ignoring move.');
        return;
    }
    // Ensure square is not already revealed
    var guessedSquare = game.board[row][col];
    if (guessedSquare.revealed) {
        console.log('Square is already revealed. Ignoring move.');
        return;
    }
    // Make move
    guessedSquare.revealed = true;
    // Handle game logic depending on square type
    var otherTeam = team === types_1.Team.RED ? types_1.Team.BLUE : types_1.Team.RED;
    if ([types_1.SquareType.BLUE.toString(), types_1.SquareType.RED.toString()].includes(guessedSquare.type.toString())) {
        if (guessedSquare.type.toString() === types_1.Team.RED.toString()) {
            game.redScore -= 1;
            if (team === types_1.Team.BLUE) {
                game.turn = types_1.Team.RED;
            }
        }
        else {
            game.blueScore -= 1;
            if (team === types_1.Team.RED) {
                game.turn = types_1.Team.BLUE;
            }
        }
        if (game.redScore === 0) {
            game.winner = types_1.Team.RED;
        }
        else if (game.blueScore === 0) {
            game.winner = types_1.Team.BLUE;
        }
    }
    else if (guessedSquare.type === types_1.SquareType.NEUTRAL) {
        game.turn = otherTeam;
    }
    else {
        game.winner = otherTeam;
    }
    // Save board to disk
    fs.writeFile(utils_1.gamePath(gameId), JSON.stringify(game), function () { return console.log('Game saved.', game); });
    // Send board to clients
    var clients = clientMap[gameId];
    clients.forEach(function (client) {
        client.send(JSON.stringify(game));
    });
};
exports.default = handleMakeMoveRequest;
