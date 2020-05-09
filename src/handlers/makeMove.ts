import * as fs from 'fs';
import { gamePath } from '../utils';
import {
  MakeMoveRequest, ClientMap, Game, SquareType, Team,
} from '../types';

const handleMakeMoveRequest = (request: MakeMoveRequest, clientMap: ClientMap) => {
  console.log('Making move:', request);

  const {
    gameId, team, row, col,
  } = request;
  if (!gameId) {
    console.log('Ignoring undefined gameId.');
    return;
  }

  // Load game
  const game = JSON.parse(fs.readFileSync(gamePath(gameId)).toString()) as Game;

  // Ensure game isn't over
  if (game.winner) {
    console.log('Game is already over. Ignoring move.');
    return;
  }

  // Ensure square is not already revealed
  const guessedSquare = game.board[row][col];
  if (guessedSquare.revealed) {
    console.log('Square is already revealed. Ignoring move.');
    return;
  }

  // Make move
  guessedSquare.revealed = true;

  // Handle game logic depending on square type
  const otherTeam = team === Team.RED ? Team.BLUE : Team.RED;
  if (
    [SquareType.BLUE.toString(), SquareType.RED.toString()].includes(guessedSquare.type.toString())
  ) {
    if (guessedSquare.type.toString() === Team.RED.toString()) {
      game.redScore -= 1;
      if (team === Team.BLUE) {
        game.turn = Team.RED;
      }
    } else {
      game.blueScore -= 1;
      if (team === Team.RED) {
        game.turn = Team.BLUE;
      }
    }
    if (game.redScore === 0) {
      game.winner = Team.RED;
    } else if (game.blueScore === 0) {
      game.winner = Team.BLUE;
    }
  } else if (guessedSquare.type === SquareType.NEUTRAL) {
    game.turn = otherTeam;
  } else {
    game.winner = otherTeam;
  }

  // Save board to disk
  fs.writeFile(gamePath(gameId), JSON.stringify(game), () => console.log('Game saved.', game));

  // Send board to clients
  const clients = clientMap[gameId];
  clients.forEach((client) => {
    client.send(JSON.stringify(game));
  });
};

export default handleMakeMoveRequest;
