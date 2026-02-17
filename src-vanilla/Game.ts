import { Board } from './Board.js';
import { Player } from './Player.js';
import { AIPlayer } from './AIPlayer.js';
import { WinChecker } from './WinChecker.js';
import { UIController } from './UIController.js';
import { CellValue, GameConfig, GameState, Scores } from './types.js';

/**
 * Game class orchestrates the entire game
 * Follows Open/Closed Principle - open for extension, closed for modification
 */
export class Game {
    private board: Board;
    private winChecker: WinChecker;
    private ui: UIController;

    private humanPlayer!: Player;
    private computerPlayer!: AIPlayer;
    private currentPlayer!: Player;

    private gameState: GameState;
    private scores: Scores;

    // Configuration from setup
    private playerSymbol: CellValue = 'X';
    private computerSymbol: CellValue = 'O';
    private firstPlayer: 'player' | 'computer' = 'player';

    constructor() {
        this.board = new Board();
        this.winChecker = new WinChecker();
        this.ui = new UIController();

        this.gameState = 'setup';
        this.scores = {
            player: 0,
            computer: 0,
            draws: 0
        };

        this.initializeEventHandlers();
        this.ui.showSetupModal();
    }

    /**
     * Initializes all event handlers
     */
    private initializeEventHandlers(): void {
        this.ui.onSymbolSelect((symbol) => this.handleSymbolSelect(symbol));
        this.ui.onFirstPlayerSelect((first) => this.handleFirstPlayerSelect(first));
        this.ui.onStartGame(() => this.handleStartGame());
        this.ui.onCellClick((index) => this.handleCellClick(index));
        this.ui.onResetGame(() => this.handleResetGame());
        this.ui.onResetScores(() => this.handleResetScores());
        this.ui.onNewSetup(() => this.handleNewSetup());
    }

    /**
     * Handles symbol selection in setup
     */
    private handleSymbolSelect(symbol: CellValue): void {
        if (symbol === null) return;

        this.playerSymbol = symbol;
        this.computerSymbol = symbol === 'X' ? 'O' : 'X';
    }

    /**
     * Handles first player selection in setup
     */
    private handleFirstPlayerSelect(first: 'player' | 'computer'): void {
        this.firstPlayer = first;
    }

    /**
     * Handles start game button click
     */
    private handleStartGame(): void {
        this.startNewGame();
    }

    /**
     * Starts a new game with current configuration
     */
    private startNewGame(): void {
        // Initialize players
        this.humanPlayer = new Player(this.playerSymbol, 'human');
        this.computerPlayer = new AIPlayer(this.computerSymbol);

        // Reset board
        this.board.reset();
        this.ui.clearBoard();
        this.ui.enableCells();
        this.ui.hideSetupModal();

        // Update scoreboard icons
        this.ui.updateScoreboardIcons(this.playerSymbol, this.computerSymbol);

        // Set first player
        this.currentPlayer = this.firstPlayer === 'player' ? this.humanPlayer : this.computerPlayer;

        // Update state
        this.gameState = 'playing';

        // Update UI
        this.updateTurnIndicator();
        this.ui.updateGameStatus('');

        // If computer goes first, make its move
        if (this.currentPlayer.isComputer()) {
            setTimeout(() => this.makeComputerMove(), 500);
        }
    }

    /**
     * Handles cell click by human player
     */
    private handleCellClick(index: number): void {
        if (this.gameState !== 'playing') {
            return;
        }

        if (!this.currentPlayer.isHuman()) {
            return;
        }

        if (!this.board.isEmpty(index)) {
            return;
        }

        this.makeMove(index);
    }

    /**
     * Makes a move at the specified index
     */
    private makeMove(index: number): void {
        try {
            // Update board state
            this.board.setCell(index, this.currentPlayer.getSymbol());

            // Update UI
            this.ui.updateCell(index, this.currentPlayer.getSymbol());

            // Check for game end
            if (this.checkGameEnd()) {
                return;
            }

            // Switch player
            this.switchPlayer();

            // If next player is computer, make its move
            if (this.currentPlayer.isComputer()) {
                this.ui.disableCells();
                setTimeout(() => this.makeComputerMove(), 600);
            }
        } catch (error) {
            console.error('Error making move:', error);
        }
    }

    /**
     * Makes a move for the computer player
     */
    private makeComputerMove(): void {
        if (this.gameState !== 'playing') {
            return;
        }

        try {
            const move = this.computerPlayer.getBestMove(
                this.board,
                this.humanPlayer.getSymbol()
            );

            this.makeMove(move);
            this.ui.enableCells();
        } catch (error) {
            console.error('Error making computer move:', error);
        }
    }

    /**
     * Checks if the game has ended (win or draw)
     * @returns True if game ended
     */
    private checkGameEnd(): boolean {
        // Check for win
        const winResult = this.winChecker.checkWin(this.board);
        if (winResult) {
            this.handleWin(winResult.winner, winResult.combination);
            return true;
        }

        // Check for draw
        if (this.winChecker.checkDraw(this.board)) {
            this.handleDraw();
            return true;
        }

        return false;
    }

    /**
     * Handles a win
     */
    private handleWin(winner: CellValue, combination: number[]): void {
        this.gameState = 'won';
        this.ui.disableCells();
        this.ui.highlightWinningCells(combination);

        // Update scores
        if (winner === this.humanPlayer.getSymbol()) {
            this.scores.player++;
            this.ui.updateGameStatus(`You win! 🎉`, 'win');
        } else {
            this.scores.computer++;
            this.ui.updateGameStatus(`Computer wins!`, 'win');
        }

        this.ui.updateScores(this.scores);
        this.ui.updateTurnIndicator('Game Over');
    }

    /**
     * Handles a draw
     */
    private handleDraw(): void {
        this.gameState = 'draw';
        this.ui.disableCells();

        this.scores.draws++;
        this.ui.updateScores(this.scores);
        this.ui.updateGameStatus(`It's a draw!`, 'draw');
        this.ui.updateTurnIndicator('Game Over');
    }

    /**
     * Switches to the next player
     */
    private switchPlayer(): void {
        this.currentPlayer = this.currentPlayer === this.humanPlayer
            ? this.computerPlayer
            : this.humanPlayer;

        this.updateTurnIndicator();
    }

    /**
     * Updates the turn indicator in UI
     */
    private updateTurnIndicator(): void {
        if (this.currentPlayer.isHuman()) {
            this.ui.updateTurnIndicator('Your turn', 'player');
        } else {
            this.ui.updateTurnIndicator('Computer is thinking...', 'computer');
        }
    }

    /**
     * Handles reset game button click
     */
    private handleResetGame(): void {
        this.startNewGame();
    }

    /**
     * Handles reset scores button click
     */
    private handleResetScores(): void {
        this.scores = {
            player: 0,
            computer: 0,
            draws: 0
        };
        this.ui.updateScores(this.scores);
    }

    /**
     * Handles new setup button click
     */
    private handleNewSetup(): void {
        this.gameState = 'setup';
        this.ui.showSetupModal();
    }

    /**
     * Initializes and starts the game
     */
    public static initialize(): void {
        new Game();
    }
}
