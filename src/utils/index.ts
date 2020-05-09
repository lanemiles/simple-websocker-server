import { GAME_PATH_PREFIX } from '../constants';

// eslint-disable-next-line
export const gamePath = (gameId: string) => `${GAME_PATH_PREFIX + gameId}.json`;
