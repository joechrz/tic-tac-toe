import { CellValue } from './types.js';

/**
 * Board class manages the game board state
 * Follows Single Responsibility Principle - only handles board state
 */
export class Board {
    private cells;
    private readonly size: number = 9;

    constructor() {
        this.cells = Array(this.size).fill(null);
    }

    /**
     * Gets the value at a specific cell index
     * @param index - Cell index (0-8)
     * @returns The cell value (X, O, or null)
     */
    public getCell(index) {
        this.validateIndex(index);
        return this.cells[index];
    }

    /**
     * Sets a value at a specific cell index
     * @param index - Cell index (0-8)
     * @param value - The value to set (X or O)
     * @throws Error if cell is already occupied
     */
    public setCell(index, value) {
        this.validateIndex(index);

        if (this.cells[index] !== null) {
            throw new Error(`Cell ${index} is already occupied`);
        }

        if (value === null) {
            throw new Error('Cannot set cell to null. Use reset() instead.');
        }

        this.cells[index] = value;
    }

    /**
     * Checks if a cell is empty
     * @param index - Cell index (0-8)
     * @returns True if cell is empty
     */
    public isEmpty(index) {
        this.validateIndex(index);
        return this.cells[index] === null;
    }

    /**
     * Gets all empty cell indices
     * @returns Array of empty cell indices
     */
    public getEmptyCells() {
        return this.cells
            .map((cell, index) => (cell === null ? index : -1))
            .filter(index => index !== -1);
    }

    /**
     * Checks if the board is full
     * @returns True if no empty cells remain
     */
    public isFull() {
        return this.cells.every(cell => cell !== null);
    }

    /**
     * Gets a copy of the current board state
     * @returns Copy of cells array
     */
    public getState() {
        return [...this.cells];
    }

    /**
     * Resets the board to initial empty state
     */
    public reset() {
        this.cells = Array(this.size).fill(null);
    }

    /**
     * Validates that an index is within valid range
     * @param index - Index to validate
     * @throws Error if index is invalid
     */
    private validateIndex(index) {
        if (index < 0 || index >= this.size) {
            throw new Error(`Invalid cell index: ${index}. Must be between 0 and ${this.size - 1}`);
        }
    }

    /**
     * Creates a clone of this board
     * @returns A new Board instance with same state
     */
    public clone() {
        const clonedBoard = new Board();
        clonedBoard.cells = [...this.cells];
        return clonedBoard;
    }
}
