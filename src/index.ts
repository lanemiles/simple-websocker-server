import * as http from 'http';
import * as WebSocket from 'ws';
import handleCreateGameRequest from './handlers/createGame';
import handleLoadGameRequest from './handlers/loadGame';
import { RequestType, ClientMap } from './types';
import handleMakeMoveRequest from './handlers/makeMove';

// Create/initialize HTTP server
const server = http.createServer(() => { });
server.listen(8999, () => {
  console.log('Server started.');
});

// Create/initialize WebSocket server
const wss = new WebSocket.Server({ server });

// Hold clients for each game
const clientMap: ClientMap = {};

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: string) => {
    const request = JSON.parse(message);
    if (request.type === RequestType.CREATE_GAME) {
      handleCreateGameRequest(request);
    } else if (request.type === RequestType.LOAD_GAME) {
      handleLoadGameRequest(request, ws, clientMap);
    } else if (request.type === RequestType.MAKE_MOVE) {
      handleMakeMoveRequest(request, clientMap);
    } else {
      console.log('Error: Unknown request type.', request);
    }
  });
});
