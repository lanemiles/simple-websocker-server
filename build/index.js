"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = __importStar(require("http"));
var WebSocket = __importStar(require("ws"));
var createGame_1 = __importDefault(require("./handlers/createGame"));
var loadGame_1 = __importDefault(require("./handlers/loadGame"));
var types_1 = require("./types");
var makeMove_1 = __importDefault(require("./handlers/makeMove"));
// Create/initialize HTTP server
var server = http.createServer(function () { });
server.listen(8999, function () {
    console.log('Server started.');
});
// Create/initialize WebSocket server
var wss = new WebSocket.Server({ server: server });
// Hold clients for each game
var clientMap = {};
wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        var request = JSON.parse(message);
        if (request.type === types_1.RequestType.CREATE_GAME) {
            createGame_1.default(request);
        }
        else if (request.type === types_1.RequestType.LOAD_GAME) {
            loadGame_1.default(request, ws, clientMap);
        }
        else if (request.type === types_1.RequestType.MAKE_MOVE) {
            makeMove_1.default(request, clientMap);
        }
        else {
            console.log('Error: Unknown request type.', request);
        }
    });
});
