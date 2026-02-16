/**
 * Tic-Tac-Toe Game
 *
 * A tic-tac-toe game with human vs human and human vs AI modes,
 * built with vanilla JavaScript using an MVC architecture.
 * Classes: Player, Board, WinChecker, AIPlayer, ModeSelector, UI, Game.
 *
 * @file app.js
 */

// ============================================
// Player
// ============================================

/**
 * Represents a game participant with a symbol and score.
 */
class Player {
  /**
   * @param {string} symbol - The player's mark character ('X' or 'O').
   */
  constructor(symbol) {
    this.symbol = symbol;
    this.score = 0;
  }

  get cssClass() {
    return `player-${this.symbol.toLowerCase()}`;
  }

  get markClass() {
    return `mark-${this.symbol.toLowerCase()}`;
  }

  incrementScore() {
    this.score++;
  }

  resetScore() {
    this.score = 0;
  }
}

// ============================================
// Board
// ============================================

/**
 * Manages the game board state as a flat array of cells.
 */
class Board {
  /**
   * @param {number} [size=3] - The board dimension (creates an NxN grid).
   */
  constructor(size = 3) {
    this.size = size;
    this.cells = new Array(size * size).fill(null);
  }

  placeMark(index, symbol) {
    if (!this.isValidMove(index)) {
      return false;
    }
    this.cells[index] = symbol;
    return true;
  }

  isValidMove(index) {
    return index >= 0 && index < this.cells.length && this.cells[index] === null;
  }

  isFull() {
    return this.cells.every(cell => cell !== null);
  }

  reset() {
    this.cells.fill(null);
  }

  getCell(index) {
    return this.cells[index];
  }

  getEmptyCells() {
    const empty = [];
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i] === null) empty.push(i);
    }
    return empty;
  }

  clone() {
    const copy = new Board(this.size);
    copy.cells = [...this.cells];
    return copy;
  }
}

// ============================================
// WinChecker
// ============================================

/**
 * Generates and evaluates winning patterns for the game board.
 */
class WinChecker {
  /**
   * @param {number} [size=3] - The board dimension.
   */
  constructor(size = 3) {
    this.winPatterns = WinChecker.generatePatterns(size);
  }

  static generatePatterns(size) {
    const patterns = [];

    for (let row = 0; row < size; row++) {
      const pattern = [];
      for (let col = 0; col < size; col++) {
        pattern.push(row * size + col);
      }
      patterns.push(pattern);
    }

    for (let col = 0; col < size; col++) {
      const pattern = [];
      for (let row = 0; row < size; row++) {
        pattern.push(row * size + col);
      }
      patterns.push(pattern);
    }

    const diag1 = [];
    for (let i = 0; i < size; i++) {
      diag1.push(i * size + i);
    }
    patterns.push(diag1);

    const diag2 = [];
    for (let i = 0; i < size; i++) {
      diag2.push(i * size + (size - 1 - i));
    }
    patterns.push(diag2);

    return patterns;
  }

  check(cells) {
    for (const pattern of this.winPatterns) {
      const first = cells[pattern[0]];
      if (first !== null && pattern.every(index => cells[index] === first)) {
        return { winner: first, pattern };
      }
    }
    return null;
  }
}

// ============================================
// AIPlayer
// ============================================

/**
 * AI opponent using minimax with alpha-beta pruning.
 * Supports three difficulty levels: easy, medium, hard.
 */
class AIPlayer {
  /**
   * @param {string} symbol - The AI's mark ('X' or 'O').
   * @param {string} opponentSymbol - The human's mark.
   * @param {string} difficulty - 'easy', 'medium', or 'hard'.
   * @param {WinChecker} winChecker - Shared win checker instance.
   */
  constructor(symbol, opponentSymbol, difficulty, winChecker) {
    this.symbol = symbol;
    this.opponentSymbol = opponentSymbol;
    this.difficulty = difficulty;
    this.winChecker = winChecker;
  }

  /**
   * Chooses a move based on difficulty level.
   * @param {Board} board - Current board state.
   * @returns {number} The chosen cell index.
   */
  chooseMove(board) {
    const empty = board.getEmptyCells();
    if (empty.length === 0) return -1;

    switch (this.difficulty) {
      case 'easy':
        return this._randomMove(empty);
      case 'medium':
        return Math.random() < 0.6
          ? this._bestMove(board)
          : this._randomMove(empty);
      case 'hard':
      default:
        return this._bestMove(board);
    }
  }

  _randomMove(emptyCells) {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  _bestMove(board) {
    let bestScore = -Infinity;
    let bestIndex = -1;
    const cells = board.cells;

    for (const index of board.getEmptyCells()) {
      cells[index] = this.symbol;
      const score = this._minimax(cells, 0, false, -Infinity, Infinity);
      cells[index] = null;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }

    return bestIndex;
  }

  /**
   * Minimax with alpha-beta pruning.
   * @param {Array<string|null>} cells - Board state.
   * @param {number} depth - Current search depth.
   * @param {boolean} isMaximizing - Whether the current player is the AI.
   * @param {number} alpha - Alpha bound.
   * @param {number} beta - Beta bound.
   * @returns {number} The evaluated score.
   */
  _minimax(cells, depth, isMaximizing, alpha, beta) {
    const result = this.winChecker.check(cells);
    if (result) {
      return result.winner === this.symbol ? 10 - depth : depth - 10;
    }

    const hasEmpty = cells.some(c => c === null);
    if (!hasEmpty) return 0;

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (let i = 0; i < cells.length; i++) {
        if (cells[i] !== null) continue;
        cells[i] = this.symbol;
        const score = this._minimax(cells, depth + 1, false, alpha, beta);
        cells[i] = null;
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (let i = 0; i < cells.length; i++) {
        if (cells[i] !== null) continue;
        cells[i] = this.opponentSymbol;
        const score = this._minimax(cells, depth + 1, true, alpha, beta);
        cells[i] = null;
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
      return minScore;
    }
  }
}

// ============================================
// ModeSelector
// ============================================

/**
 * Manages the game mode selection overlay.
 */
class ModeSelector {
  constructor() {
    this.els = {
      overlay: document.getElementById('mode-overlay'),
      typeOptions: document.getElementById('mode-type-options'),
      aiSettings: document.getElementById('mode-ai-settings'),
      symbolOptions: document.getElementById('mode-symbol-options'),
      difficultyOptions: document.getElementById('mode-difficulty-options'),
      startBtn: document.getElementById('mode-start-btn'),
    };

    this.config = {
      mode: 'human',
      humanSymbol: 'X',
      difficulty: 'medium',
    };

    this._bindOptionGroups();
  }

  _bindOptionGroups() {
    this._bindGroup(this.els.typeOptions, (value) => {
      this.config.mode = value;
      this.els.aiSettings.classList.toggle('visible', value === 'ai');
    });

    this._bindGroup(this.els.symbolOptions, (value) => {
      this.config.humanSymbol = value;
    });

    this._bindGroup(this.els.difficultyOptions, (value) => {
      this.config.difficulty = value;
    });
  }

  _bindGroup(container, onChange) {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-option');
      if (!btn) return;

      for (const opt of container.querySelectorAll('.mode-option')) {
        opt.classList.remove('selected');
        opt.setAttribute('aria-pressed', 'false');
      }
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
      onChange(btn.dataset.value);
    });
  }

  show() {
    this.els.overlay.classList.add('visible');
    this.els.startBtn.focus();
  }

  hide() {
    this.els.overlay.classList.remove('visible');
  }

  /**
   * @param {function(Object): void} handler - Called with config on start.
   */
  onStart(handler) {
    this.els.startBtn.addEventListener('click', () => {
      handler({ ...this.config });
    });
  }
}

// ============================================
// UI
// ============================================

/**
 * Manages all DOM interactions including rendering, status updates,
 * overlays, confetti animations, and event binding.
 */
class UI {
  constructor() {
    this.els = {
      board: document.getElementById('board'),
      statusText: document.getElementById('status-text'),
      scoreX: document.getElementById('score-x'),
      scoreO: document.getElementById('score-o'),
      scoreDraws: document.getElementById('score-draws'),
      scorePlayerX: document.getElementById('score-player-x'),
      scorePlayerO: document.getElementById('score-player-o'),
      btnNewGame: document.getElementById('btn-new-game'),
      btnResetScores: document.getElementById('btn-reset-scores'),
      overlay: document.getElementById('game-overlay'),
      overlayIcon: document.getElementById('overlay-icon'),
      overlayTitle: document.getElementById('overlay-title'),
      overlaySubtitle: document.getElementById('overlay-subtitle'),
      overlayPlayAgain: document.getElementById('overlay-play-again'),
      confettiContainer: document.getElementById('confetti-container'),
      scorePlayerXLabel: document.querySelector('#score-player-x .score-player-label'),
      scorePlayerOLabel: document.querySelector('#score-player-o .score-player-label'),
    };
    this.cellButtons = Array.from(this.els.board.querySelectorAll('.cell'));
  }

  // --- Player labels ---

  setPlayerLabels(labelX, labelO) {
    this.els.scorePlayerXLabel.textContent = labelX;
    this.els.scorePlayerOLabel.textContent = labelO;
  }

  // --- Board rendering ---

  renderMark(index, symbol) {
    const cell = this.cellButtons[index];
    const mark = document.createElement('span');
    mark.className = `cell-mark mark-${symbol.toLowerCase()}`;
    mark.textContent = symbol;
    cell.appendChild(mark);
    cell.classList.add('cell--filled');

    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    cell.setAttribute('aria-label', `Row ${row}, Column ${col} - ${symbol}`);
  }

  updateHoverHints(symbol) {
    for (const cell of this.cellButtons) {
      if (!cell.classList.contains('cell--filled')) {
        cell.dataset.hover = symbol;
      }
    }
  }

  highlightWinCells(pattern) {
    for (const index of pattern) {
      this.cellButtons[index].classList.add('cell--win');
    }
  }

  markAllCellsDraw() {
    for (const cell of this.cellButtons) {
      cell.classList.add('cell--draw');
    }
  }

  disableAllCells() {
    for (const cell of this.cellButtons) {
      cell.classList.add('cell--disabled');
      cell.setAttribute('disabled', '');
    }
  }

  clearBoard() {
    for (const cell of this.cellButtons) {
      cell.innerHTML = '';
      cell.className = 'cell';
      cell.removeAttribute('disabled');
      cell.dataset.hover = 'X';

      const index = parseInt(cell.dataset.index, 10);
      const row = Math.floor(index / 3) + 1;
      const col = (index % 3) + 1;
      cell.setAttribute('aria-label', `Row ${row}, Column ${col} - empty`);
    }
  }

  // --- Status ---

  setStatus(text, cssClass) {
    const el = this.els.statusText;
    el.textContent = text;
    el.className = 'status-text';
    if (cssClass) {
      el.classList.add(cssClass);
    }
  }

  setTurnStatus(symbol, label) {
    const cls = `turn-${symbol.toLowerCase()}`;
    this.setStatus(`${label}'s turn`, cls);
  }

  setThinkingStatus(symbol) {
    const cls = `turn-${symbol.toLowerCase()}`;
    this.setStatus('Computer thinking...', cls);
  }

  setWinStatus(label) {
    this.setStatus(`${label} wins!`, 'win');
  }

  setDrawStatus() {
    this.setStatus("It's a draw!", 'draw');
  }

  // --- Scoreboard ---

  updateScores(playerX, playerO, draws) {
    this.els.scoreX.textContent = playerX.score;
    this.els.scoreO.textContent = playerO.score;
    this.els.scoreDraws.textContent = draws;
  }

  setActivePlayer(symbol) {
    this.els.scorePlayerX.classList.toggle('active', symbol === 'X');
    this.els.scorePlayerO.classList.toggle('active', symbol === 'O');
  }

  // --- Overlay ---

  showWinOverlay(label, symbol) {
    const isX = symbol === 'X';
    this.els.overlayIcon.textContent = isX ? '🎉' : '🏆';
    this.els.overlayTitle.textContent = `${label} Wins!`;
    this.els.overlayTitle.className = `overlay-title ${isX ? 'win-x' : 'win-o'}`;
    this.els.overlaySubtitle.textContent = 'Impressive play!';
    this._showOverlay();
  }

  showDrawOverlay() {
    this.els.overlayIcon.textContent = '🤝';
    this.els.overlayTitle.textContent = "It's a Draw!";
    this.els.overlayTitle.className = 'overlay-title draw';
    this.els.overlaySubtitle.textContent = 'Well matched!';
    this._showOverlay();
  }

  hideOverlay() {
    this.els.overlay.classList.remove('visible');
  }

  _showOverlay() {
    this.els.overlay.classList.add('visible');
    this.els.overlayPlayAgain.focus();
  }

  // --- Confetti ---

  spawnConfetti(count = 30) {
    const container = this.els.confettiContainer;
    const colors = ['#e94560', '#00d4ff', '#4cd964', '#ffcc00', '#ff8a80', '#a78bfa'];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      particle.style.animationDelay = `${Math.random() * 0.5}s`;
      particle.style.width = `${6 + Math.random() * 6}px`;
      particle.style.height = `${6 + Math.random() * 6}px`;
      container.appendChild(particle);
    }

    setTimeout(() => {
      container.innerHTML = '';
    }, 4000);
  }

  // --- Event binding ---

  onCellClick(handler) {
    this.els.board.addEventListener('click', (e) => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      const index = parseInt(cell.dataset.index, 10);
      handler(index);
    });
  }

  onNewGame(handler) {
    this.els.btnNewGame.addEventListener('click', handler);
  }

  onResetScores(handler) {
    this.els.btnResetScores.addEventListener('click', handler);
  }

  onPlayAgain(handler) {
    this.els.overlayPlayAgain.addEventListener('click', handler);
  }
}

// ============================================
// Game (Controller)
// ============================================

/**
 * Main game controller supporting both human vs human and human vs AI modes.
 */
class Game {
  constructor() {
    this.players = [new Player('X'), new Player('O')];
    this.board = new Board();
    this.winChecker = new WinChecker();
    this.ui = new UI();
    this.modeSelector = new ModeSelector();
    this.currentPlayerIndex = 0;
    this.draws = 0;
    this.gameOver = true; // starts true until mode is selected
    this.aiThinking = false;
    this.aiTimeoutId = null;

    // AI mode config (set when game starts)
    this.gameMode = 'human';     // 'human' or 'ai'
    this.humanSymbol = 'X';
    this.aiSymbol = 'O';
    this.aiPlayer = null;

    // Labels for each symbol position
    this.labelX = 'Player X';
    this.labelO = 'Player O';

    this._bindEvents();
    this.ui.updateScores(this.players[0], this.players[1], this.draws);
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  /**
   * Returns the display label for a given symbol.
   */
  _labelFor(symbol) {
    return symbol === 'X' ? this.labelX : this.labelO;
  }

  /**
   * Whether the current turn belongs to the AI.
   */
  _isAITurn() {
    return this.gameMode === 'ai' && this.currentPlayer.symbol === this.aiSymbol;
  }

  // --- Event handlers ---

  _bindEvents() {
    this.ui.onCellClick((index) => this._handleMove(index));
    this.ui.onNewGame(() => this._showModeSelector());
    this.ui.onResetScores(() => this._resetScores());
    this.ui.onPlayAgain(() => this._playAgain());
    this.modeSelector.onStart((config) => this._startGame(config));
  }

  /**
   * Starts the game with the given mode configuration.
   */
  _startGame(config) {
    this.modeSelector.hide();
    this.gameMode = config.mode;

    if (config.mode === 'ai') {
      this.humanSymbol = config.humanSymbol;
      this.aiSymbol = config.humanSymbol === 'X' ? 'O' : 'X';
      this.aiPlayer = new AIPlayer(
        this.aiSymbol,
        this.humanSymbol,
        config.difficulty,
        this.winChecker
      );
      this.labelX = config.humanSymbol === 'X' ? 'You' : 'Computer';
      this.labelO = config.humanSymbol === 'O' ? 'You' : 'Computer';
    } else {
      this.aiPlayer = null;
      this.humanSymbol = 'X';
      this.aiSymbol = null;
      this.labelX = 'Player X';
      this.labelO = 'Player O';
    }

    this.ui.setPlayerLabels(this.labelX, this.labelO);
    this._newGame();
  }

  _handleMove(index) {
    if (this.gameOver || this.aiThinking) return;
    if (this._isAITurn()) return; // block clicks during AI turn
    if (!this.board.placeMark(index, this.currentPlayer.symbol)) return;

    this.ui.renderMark(index, this.currentPlayer.symbol);
    this._afterMove();
  }

  _afterMove() {
    const result = this.winChecker.check(this.board.cells);

    if (result) {
      this._handleWin(result);
      return;
    }

    if (this.board.isFull()) {
      this._handleDraw();
      return;
    }

    this._switchTurn();
  }

  _handleWin(result) {
    this.gameOver = true;
    const winner = this.currentPlayer;
    const label = this._labelFor(winner.symbol);
    winner.incrementScore();

    this.ui.highlightWinCells(result.pattern);
    this.ui.disableAllCells();
    this.ui.setWinStatus(label);
    this.ui.updateScores(this.players[0], this.players[1], this.draws);

    setTimeout(() => {
      this.ui.showWinOverlay(label, winner.symbol);
      this.ui.spawnConfetti();
    }, 600);
  }

  _handleDraw() {
    this.gameOver = true;
    this.draws++;

    this.ui.markAllCellsDraw();
    this.ui.disableAllCells();
    this.ui.setDrawStatus();
    this.ui.updateScores(this.players[0], this.players[1], this.draws);

    setTimeout(() => {
      this.ui.showDrawOverlay();
    }, 600);
  }

  _switchTurn() {
    this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    const symbol = this.currentPlayer.symbol;
    const label = this._labelFor(symbol);

    this.ui.setActivePlayer(symbol);
    this.ui.updateHoverHints(symbol);

    if (this._isAITurn()) {
      this.ui.setThinkingStatus(symbol);
      this._triggerAIMove();
    } else {
      this.ui.setTurnStatus(symbol, label);
    }
  }

  _triggerAIMove() {
    this.aiThinking = true;
    this.ui.disableAllCells();

    // Add a short delay so the AI move feels natural
    const delay = 400 + Math.random() * 400;
    this.aiTimeoutId = setTimeout(() => {
      this.aiTimeoutId = null;
      if (this.gameOver) {
        this.aiThinking = false;
        return;
      }

      const move = this.aiPlayer.chooseMove(this.board);
      if (move === -1) {
        this.aiThinking = false;
        return;
      }

      this.board.placeMark(move, this.aiSymbol);
      this.ui.renderMark(move, this.aiSymbol);
      this.aiThinking = false;

      // Re-enable empty cells for human's next turn (if game continues)
      this._afterMove();
      if (!this.gameOver) {
        this._enableEmptyCells();
      }
    }, delay);
  }

  _enableEmptyCells() {
    for (const cell of this.ui.cellButtons) {
      if (!cell.classList.contains('cell--filled')) {
        cell.classList.remove('cell--disabled');
        cell.removeAttribute('disabled');
      }
    }
  }

  _newGame() {
    if (this.aiTimeoutId !== null) {
      clearTimeout(this.aiTimeoutId);
      this.aiTimeoutId = null;
    }
    this.aiThinking = false;
    this.board.reset();
    this.currentPlayerIndex = 0;
    this.gameOver = false;
    this.ui.clearBoard();
    this._syncUI();

    // If AI plays X (goes first), trigger AI move
    if (this._isAITurn()) {
      this.ui.setThinkingStatus(this.currentPlayer.symbol);
      this._triggerAIMove();
    }
  }

  _resetScores() {
    for (const player of this.players) {
      player.resetScore();
    }
    this.draws = 0;
    this.ui.updateScores(this.players[0], this.players[1], this.draws);
  }

  _playAgain() {
    this.ui.hideOverlay();
    this._newGame();
  }

  _showModeSelector() {
    if (this.aiTimeoutId !== null) {
      clearTimeout(this.aiTimeoutId);
      this.aiTimeoutId = null;
    }
    this.aiThinking = false;
    this.gameOver = true;
    this.modeSelector.show();
  }

  _syncUI() {
    const symbol = this.currentPlayer.symbol;
    const label = this._labelFor(symbol);
    this.ui.setTurnStatus(symbol, label);
    this.ui.setActivePlayer(symbol);
    this.ui.updateHoverHints(symbol);
    this.ui.updateScores(this.players[0], this.players[1], this.draws);
  }
}

// ============================================
// Bootstrap
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  new Game();
});
