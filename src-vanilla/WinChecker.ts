import { Board } from './Board.js';
import { CellValue, WinResult } from './types.js';

/**
 * WinChecker class handles win condition detection
 * Follows Single Responsibility Principle - only checks for wins
 */
export class WinChecker {
    /**
     * All possible winning combinations (rows, columns, diagonals)
     */
    private static readonly WIN_COMBINATIONS: number[][] = [
        // Rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonals
        [0, 4, 8],
        [2, 4, 6]
    ];

    /**
     * Checks if there is a winner on the board
     * @param board - The game board to check
     * @returns WinResult if there's a winner, null otherwise
     */
    public checkWin(board: Board): WinResult | null {
        const state = board.getState();

        for (const combination of WinChecker.WIN_COMBINATIONS) {
            const [a, b, c] = combination;
            const cellA = state[a];
            const cellB = state[b];
            const cellC = state[c];

            // Check if all three cells have the same non-null value
            if (cellA !== null && cellA === cellB && cellA === cellC) {
                return {
                    winner: cellA,
                    combination
                };
            }
        }

        return null;
    }

    /**
     * Checks if the game is a draw (board full with no winner)
     * @param board - The game board to check
     * @returns True if the game is a draw
     */
    public checkDraw(board: Board): boolean {
        return board.isFull() && this.checkWin(board) === null;
    }

    /**
     * Checks if the game is over (win or draw)
     * @param board - The game board to check
     * @returns True if game is over
     */
    public isGameOver(board: Board): boolean {
        return this.checkWin(board) !== null || this.checkDraw(board);
    }

    /**
     * Gets all winning combinations
     * @returns Array of winning combinations
     */
    public static getWinCombinations(): number[][] {
        return WinChecker.WIN_COMBINATIONS;
    }
}
