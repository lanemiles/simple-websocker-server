import * as fs from 'fs';
import * as WebSocket from 'ws';
import { gamePath } from '../utils';
import { LoadGameRequest, ClientMap } from '../types';

const handleLoadGameRequest = (
  request: LoadGameRequest,
  newClient: WebSocket,
  clientMap: ClientMap,
) => {
  console.log('Loading game:', request);

  const { gameId } = request;
  if (!gameId) {
    console.log('Ignoring undefined gameId.');
    return;
  }

  if (!clientMap[gameId]) {
    // eslint-disable-next-line
    clientMap[gameId] = [];
  }
  clientMap[gameId].push(newClient);

  fs.readFile(gamePath(gameId), (err, data) => {
    if (err) {
      console.log('Error loading game.', err);
    } else {
      newClient.send(data.toString());
      console.log('Game loaded.');
    }
  });
};

export default handleLoadGameRequest;
