import { CellValue, PlayerType } from './types.js';

/**
 * Player class represents a game player
 * Follows Single Responsibility Principle - manages player identity
 */
export class Player {
    constructor(
        public readonly symbol,
        public readonly type
    ) {
        if (symbol === null) {
            throw new Error('Player symbol cannot be null');
        }
    }

    /**
     * Checks if this is a human player
     * @returns True if player is human
     */
    public isHuman() {
        return this.type === 'human';
    }

    /**
     * Checks if this is a computer player
     * @returns True if player is computer
     */
    public isComputer() {
        return this.type === 'computer';
    }

    /**
     * Gets player symbol 
     * @returns Player symbol (X or O)
     */
    public getSymbol() {
        return this.symbol;
    }
}
