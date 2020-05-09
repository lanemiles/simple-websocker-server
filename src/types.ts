import WebSocket from 'ws';

export type ClientMap = { [gameId: string]: WebSocket[]}

export enum RequestType {
    CREATE_GAME = 'CREATE_GAME',
    LOAD_GAME = 'LOAD_GAME',
    MAKE_MOVE = 'MAKE_MOVE'
}

export interface CreateGameRequest {
    gameId: string;
}

export interface LoadGameRequest {
    gameId: string;
}

export interface MakeMoveRequest {
    gameId: string;
    team: Team;
    row: number;
    col: number;
}

export enum Team {
    RED = 'RED',
    BLUE = 'BLUE'
}

export enum SquareType {
    RED = 'RED',
    BLUE = 'BLUE',
    NEUTRAL = 'NEUTRAL',
    BOMB = 'BOMB'
}

export interface Square {
    word: string;
    type: SquareType;
    revealed: boolean;
}

export interface Game {
    board: Square[][];
    turn: Team;
    redScore: number;
    blueScore: number;
    startingTeam: Team;
    winner?: Team;
}
