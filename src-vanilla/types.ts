/**
 * Type definitions for the Tic-Tac-Toe game
 */

/**
 * Represents a player symbol (X or O) or empty cell
 */
export type CellValue = 'X' | 'O' | null;

/**
 * Represents a player type
 */
export type PlayerType = 'human' | 'computer';

/**
 * Represents the game state
 */
export type GameState = 'setup' | 'playing' | 'won' | 'draw';

/**
 * Configuration for starting a new game
 */
export interface GameConfig {
    playerSymbol: CellValue;
    computerSymbol: CellValue;
    firstPlayer: PlayerType;
}

/**
 * Represents a winning combination
 */
export interface WinResult {
    winner: CellValue;
    combination: number[];
}

/**
 * Game scores
 */
export interface Scores {
    player: number;
    computer: number;
    draws: number;
}
