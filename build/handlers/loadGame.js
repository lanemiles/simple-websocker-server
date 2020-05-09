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
var handleLoadGameRequest = function (request, newClient, clientMap) {
    console.log('Loading game:', request);
    var gameId = request.gameId;
    if (!gameId) {
        console.log('Ignoring undefined gameId.');
        return;
    }
    if (!clientMap[gameId]) {
        // eslint-disable-next-line
        clientMap[gameId] = [];
    }
    clientMap[gameId].push(newClient);
    fs.readFile(utils_1.gamePath(gameId), function (err, data) {
        if (err) {
            console.log('Error loading game.', err);
        }
        else {
            newClient.send(data.toString());
            console.log('Game loaded.');
        }
    });
};
exports.default = handleLoadGameRequest;
