import { CellValue, PlayerType } from './types';

/**
 * Player class represents a game player
 * Follows Single Responsibility Principle - manages player identity
 */
export class Player {
    constructor(
        public readonly symbol: CellValue,
        public readonly type: PlayerType
    ) {
        if (symbol === null) {
            throw new Error('Player symbol cannot be null');
        }
    }

    /**
     * Checks if this is a human player
     * @returns True if player is human
     */
    public isHuman(): boolean {
        return this.type === 'human';
    }

    /**
     * Checks if this is a computer player
     * @returns True if player is computer
     */
    public isComputer(): boolean {
        return this.type === 'computer';
    }

    /**
     * Gets player symbol as string
     * @returns Player symbol (X or O)
     */
    public getSymbol(): CellValue {
        return this.symbol;
    }
}
