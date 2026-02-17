import { CellValue, Scores, WinResult } from './types.js';

/**
 * UIController handles all DOM manipulation and UI updates
 * Follows Single Responsibility Principle - only handles UI
 */
export class UIController {
    // Setup modal elements
    private setupModal;
    private symbolButtons;
    private firstButtons;
    private startButton;

    // Game container elements
    private gameContainer;
    private boardElement;
    private cells;
    private turnText;
    private gameStatus;

    // Scoreboard elements
    private playerScoreElement;
    private computerScoreElement;
    private drawScoreElement;
    private playerIconElement;
    private computerIconElement;

    // Control buttons
    private resetGameButton;
    private resetScoresButton;
    private newSetupButton;

    constructor() {
        this.setupModal = this.getElement('setupModal');
        this.symbolButtons = this.getElements('.symbol-btn');
        this.firstButtons = this.getElements('.first-btn');
        this.startButton = this.getElement('startGame');

        this.gameContainer = this.getElement('gameContainer');
        this.boardElement = this.getElement('board');
        this.cells = this.getElements('.cell');
        this.turnText = this.getElement('turnText');
        this.gameStatus = this.getElement('gameStatus');

        this.playerScoreElement = this.getElement('playerScore');
        this.computerScoreElement = this.getElement('computerScore');
        this.drawScoreElement = this.getElement('drawScore');
        this.playerIconElement = this.getElement('playerIcon');
        this.computerIconElement = this.getElement('computerIcon');

        this.resetGameButton = this.getElement('resetGame');
        this.resetScoresButton = this.getElement('resetScores');
        this.newSetupButton = this.getElement('newSetup');
    }

    /**
     * Shows the setup modal
     */
    public showSetupModal() {
        this.setupModal.classList.remove('hidden');
        this.gameContainer.classList.add('hidden');
    }

    /**
     * Hides the setup modal and shows game
     */
    public hideSetupModal() {
        this.setupModal.classList.add('hidden');
        this.gameContainer.classList.remove('hidden');
    }

    /**
     * Attaches click handler to symbol selection buttons
     */
    public onSymbolSelect(handler: (symbol) => void) {
        this.symbolButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.symbolButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const symbol = button.getAttribute('data-symbol') ;
                handler(symbol);
            });
        });
    }

    /**
     * Attaches click handler to first player selection buttons
     */
    public onFirstPlayerSelect(handler: (first: 'player' | 'computer') => void) {
        this.firstButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.firstButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const first = button.getAttribute('data-first') as 'player' | 'computer';
                handler(first);
            });
        });
    }

    /**
     * Attaches click handler to start game button
     */
    public onStartGame(handler: () => void) {
        this.startButton.addEventListener('click', handler);
    }

    /**
     * Attaches click handler to board cells
     */
    public onCellClick(handler: (index) => void) {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                if (!cell.classList.contains('filled') && !cell.classList.contains('disabled')) {
                    handler(index);
                }
            });
        });
    }

    /**
     * Attaches click handler to reset game button
     */
    public onResetGame(handler: () => void) {
        this.resetGameButton.addEventListener('click', handler);
    }

    /**
     * Attaches click handler to reset scores button
     */
    public onResetScores(handler: () => void) {
        this.resetScoresButton.addEventListener('click', handler);
    }

    /**
     * Attaches click handler to new setup button
     */
    public onNewSetup(handler: () => void) {
        this.newSetupButton.addEventListener('click', handler);
    }

    /**
     * Updates a cell with a symbol
     */
    public updateCell(index, symbol) {
        const cell = this.cells[index];
        if (symbol) {
            cell.textContent = symbol;
            cell.classList.add('filled', symbol.toLowerCase());
        }
    }

    /**
     * Clears all cells on the board
     */
    public clearBoard() {
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('filled', 'x', 'o', 'win', 'disabled');
        });
    }

    /**
     * Disables all cells (game over state)
     */
    public disableCells() {
        this.cells.forEach(cell => {
            cell.classList.add('disabled');
        });
    }

    /**
     * Enables all empty cells
     */
    public enableCells() {
        this.cells.forEach(cell => {
            if (!cell.classList.contains('filled')) {
                cell.classList.remove('disabled');
            }
        });
    }

    /**
     * Highlights winning cells
     */
    public highlightWinningCells(combination) {
        combination.forEach(index => {
            this.cells[index].classList.add('win');
        });
    }

    /**
     * Updates the turn indicator text
     */
    public updateTurnIndicator(message, playerType?: 'player' | 'computer') {
        this.turnText.textContent = message;

        // Remove previous player type classes
        this.turnText.parentElement?.classList.remove('player-turn', 'computer-turn');

        // Add appropriate class based on player type
        if (playerType === 'player') {
            this.turnText.parentElement?.classList.add('player-turn');
        } else if (playerType === 'computer') {
            this.turnText.parentElement?.classList.add('computer-turn');
        }
    }

    /**
     * Updates the game status message
     */
    public updateGameStatus(message, type?: 'win' | 'draw') {
        this.gameStatus.textContent = message;
        this.gameStatus.classList.remove('win', 'draw');

        if (type) {
            this.gameStatus.classList.add(type);
        }
    }

    /**
     * Updates the scoreboard
     */
    public updateScores(scores) {
        this.playerScoreElement.textContent = scores.player.toString();
        this.computerScoreElement.textContent = scores.computer.toString();
        this.drawScoreElement.textContent = scores.draws.toString();
    }

    /**
     * Updates player and computer icons in scoreboard
     */
    public updateScoreboardIcons(playerSymbol, computerSymbol) {
        if (playerSymbol) {
            this.playerIconElement.textContent = playerSymbol;
        }
        if (computerSymbol) {
            this.computerIconElement.textContent = computerSymbol;
        }
    }

    /**
     * Helper to get a single element
     */
    private getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element with id "${id}" not found`);
        }
        return element;
    }

    /**
     * Helper to get multiple elements
     */
    private getElements(selector) {
        const elements = document.querySelectorAll<HTMLElement>(selector);
        if (elements.length === 0) {
            throw new Error(`No elements found for selector "${selector}"`);
        }
        return elements;
    }
}
