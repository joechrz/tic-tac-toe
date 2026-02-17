import { Player } from './Player.js';
import { Board } from './Board.js';
import { WinChecker } from './WinChecker.js';
import { CellValue } from './types.js';

/**
 * AIPlayer extends Player with intelligent move selection
 * Uses minimax algorithm for optimal play
 */
export class AIPlayer extends Player {
    private winChecker;

    constructor(symbol) {
        super(symbol, 'computer');
        this.winChecker = new WinChecker();
    }

    /**
     * Gets the best move for the AI player
     * @param board - Current game board
     * @param opponentSymbol - Opponent's symbol
     * @returns Index of best move
     */
    public getBestMove(board, opponentSymbol) {
        const emptyCells = board.getEmptyCells();

        if (emptyCells.length === 0) {
            throw new Error('No available moves');
        }

        // If board is empty or nearly empty, use strategic opening moves
        if (emptyCells.length >= 8) {
            return this.getStrategicOpeningMove(emptyCells);
        }

        // Check for immediate winning move
        const winningMove = this.findWinningMove(board, this.symbol);
        if (winningMove !== null) {
            return winningMove;
        }

        // Block opponent's winning move
        const blockingMove = this.findWinningMove(board, opponentSymbol);
        if (blockingMove !== null) {
            return blockingMove;
        }

        // Use minimax for optimal play
        let bestScore = -Infinity;
        let bestMove = emptyCells[0];

        for (const move of emptyCells) {
            const clonedBoard = board.clone();
            clonedBoard.setCell(move, this.symbol);
            const score = this.minimax(clonedBoard, 0, false, opponentSymbol);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    /**
     * Minimax algorithm for optimal move selection
     * @param board - Board to evaluate
     * @param depth - Current depth in game tree
     * @param isMaximizing - Whether this is a maximizing or minimizing turn
     * @param opponentSymbol - Opponent's symbol
     * @returns Score for this board state
     */
    private minimax(
        board,
        depth,
        isMaximizing,
        opponentSymbol
    ) {
        const winResult = this.winChecker.checkWin(board);

        // Terminal states
        if (winResult !== null) {
            return winResult.winner === this.symbol ? 10 - depth : depth - 10;
        }

        if (this.winChecker.checkDraw(board)) {
            return 0;
        }

        const emptyCells = board.getEmptyCells();

        if (isMaximizing) {
            let maxScore = -Infinity;

            for (const move of emptyCells) {
                const clonedBoard = board.clone();
                clonedBoard.setCell(move, this.symbol);
                const score = this.minimax(clonedBoard, depth + 1, false, opponentSymbol);
                maxScore = Math.max(maxScore, score);
            }

            return maxScore;
        } else {
            let minScore = Infinity;

            for (const move of emptyCells) {
                const clonedBoard = board.clone();
                clonedBoard.setCell(move, opponentSymbol);
                const score = this.minimax(clonedBoard, depth + 1, true, opponentSymbol);
                minScore = Math.min(minScore, score);
            }

            return minScore;
        }
    }

    /**
     * Finds a winning move for a given symbol
     * @param board - Current board
     * @param symbol - Symbol to check winning moves for
     * @returns Index of winning move, or null if none exists
     */
    private findWinningMove(board, symbol): number | null {
        const emptyCells = board.getEmptyCells();

        for (const move of emptyCells) {
            const clonedBoard = board.clone();
            clonedBoard.setCell(move, symbol);

            if (this.winChecker.checkWin(clonedBoard) !== null) {
                return move;
            }
        }

        return null;
    }

    /**
     * Gets a strategic opening move
     * Prefers center, then corners, then edges
     * @param emptyCells - Available cell indices
     * @returns Strategic opening move index
     */
    private getStrategicOpeningMove(emptyCells) {
        // Center is best opening move
        if (emptyCells.includes(4)) {
            return 4;
        }

        // Corners are second best
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => emptyCells.includes(corner));
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // Edges 
        return emptyCells[0];
    }
}
