import { Team } from '../types';

export const GAME_PATH_PREFIX = './resources/games/';
export const WORD_LIST_PATH = './resources/words.json';

export const BOARD_DIMENSION = 5;
export const STARTING_TEAM = Team.BLUE;
export const NUM_STARTING_TEAM_SQUARES = 9;
export const NUM_NOT_STARTING_TEAM_SQUARES = NUM_STARTING_TEAM_SQUARES - 1;
