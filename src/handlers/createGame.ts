import * as fs from 'fs';
import { gamePath } from '../utils';
import {
  WORD_LIST_PATH,
  BOARD_DIMENSION,
  STARTING_TEAM,
  NUM_STARTING_TEAM_SQUARES,
  NUM_NOT_STARTING_TEAM_SQUARES,
} from '../constants';
import {
  Team, SquareType, Game, CreateGameRequest, Square,
} from '../types';

const randomizeAndPickN = <T>(arr: Array<T>, n: number) => [...arr]
  .sort(() => 0.5 - Math.random())
  .slice(0, n);

const flatten = <T>(arr: Array<Array<T>>) => arr
  .reduce((acc: Array<T>, nextL: Array<T>) => acc.concat(nextL), []);

const filterLists = <T>(arr: Array<T>, excludeLists: Array<Array<T>>) => [...arr]
  .filter((w) => !flatten(excludeLists).includes(w));

const createBoard = (startingTeam: Team) => {
  const board: Square[][] = [];

  const allWords = JSON.parse(fs.readFileSync(WORD_LIST_PATH).toString()) as string[];
  const wordsForThisGame = randomizeAndPickN(allWords, BOARD_DIMENSION * BOARD_DIMENSION);

  const startingTeamSquares = randomizeAndPickN(wordsForThisGame, NUM_STARTING_TEAM_SQUARES);
  const otherTeamSquares = randomizeAndPickN(
    filterLists(wordsForThisGame, [startingTeamSquares]),
    NUM_NOT_STARTING_TEAM_SQUARES,
  );
  const bombSquares = randomizeAndPickN(
    filterLists(wordsForThisGame, [startingTeamSquares, otherTeamSquares]), 1,
  );

  for (let row = 0; row < BOARD_DIMENSION; row += 1) {
    if (!board[row]) {
      board[row] = [];
    }
    for (let col = 0; col < BOARD_DIMENSION; col += 1) {
      const word = wordsForThisGame[(row * BOARD_DIMENSION) + col];
      const team = () => {
        if (startingTeamSquares.includes(word)) {
          return startingTeam === Team.RED ? SquareType.RED : SquareType.BLUE;
        } if (otherTeamSquares.includes(word)) {
          return startingTeam === Team.RED ? SquareType.BLUE : SquareType.RED;
        } if (bombSquares.includes(word)) {
          return SquareType.BOMB;
        }
        return SquareType.NEUTRAL;
      };
      board[row][col] = {
        word,
        type: team(),
        revealed: false,
      };
    }
  }

  return board;
};

const createGame = (startingTeam: Team): Game => ({
  board: createBoard(startingTeam),
  turn: startingTeam,
  redScore: startingTeam === Team.RED ? NUM_STARTING_TEAM_SQUARES : NUM_NOT_STARTING_TEAM_SQUARES,
  blueScore: startingTeam === Team.BLUE ? NUM_STARTING_TEAM_SQUARES : NUM_NOT_STARTING_TEAM_SQUARES,
  startingTeam,
});

const handleCreateGameRequest = (request: CreateGameRequest) => {
  console.log('Creating new game:', request);

  const { gameId } = request;
  if (!gameId) {
    console.log('Ignoring undefined gameId.');
    return;
  }

  const gameExists = fs.existsSync(gamePath(gameId));

  if (gameExists) {
    console.log('Game already exists. Not creating again.', gameId);
  } else {
    const game = createGame(STARTING_TEAM);
    fs.writeFile(gamePath(gameId), JSON.stringify(game), () => console.log('Game created.', game));
  }
};

export default handleCreateGameRequest;
