# API Reference

Complete class and method reference for the Tic Tac Toe game (`app.js`).

## Table of Contents

- [Player](#player)
- [Board](#board)
- [WinChecker](#winchecker)
- [AIPlayer](#aiplayer)
- [ModeSelector](#modeselector)
- [UI](#ui)
- [Game](#game)
- [Bootstrap](#bootstrap)

---

## Player

Represents a game participant with a symbol and score.

**File:** `app.js` | **Lines:** 18-42

### Constructor

```js
new Player(symbol)
```

| Parameter | Type   | Description               |
|-----------|--------|---------------------------|
| `symbol`  | string | Player's mark (`'X'` or `'O'`) |

### Properties

| Property | Type   | Description                |
|----------|--------|----------------------------|
| `symbol` | string | The player's mark character |
| `score`  | number | Current win count (starts at 0) |

### Getters

#### `cssClass` → string

Returns the CSS class for scoreboard styling.

- `'X'` → `'player-x'`
- `'O'` → `'player-o'`

#### `markClass` → string

Returns the CSS class for cell mark styling.

- `'X'` → `'mark-x'`
- `'O'` → `'mark-o'`

### Methods

#### `incrementScore()`

Adds 1 to the player's score. Called when the player wins a round.

**Returns:** `void`

#### `resetScore()`

Sets the player's score to 0. Called when scores are reset.

**Returns:** `void`

---

## Board

Manages the game board state as a flat array.

**File:** `app.js` | **Lines:** 51-97

### Constructor

```js
new Board(size = 3)
```

| Parameter | Type   | Default | Description         |
|-----------|--------|---------|---------------------|
| `size`    | number | `3`     | Board dimension (NxN) |

### Properties

| Property | Type       | Description                             |
|----------|------------|-----------------------------------------|
| `size`   | number     | Board dimension                          |
| `cells`  | Array      | Flat array of length `size * size`. Each element is `null`, `'X'`, or `'O'`. |

### Methods

#### `placeMark(index, symbol)` → boolean

Places a mark on the board at the given index.

| Parameter | Type   | Description          |
|-----------|--------|----------------------|
| `index`   | number | Cell position (0-8)  |
| `symbol`  | string | `'X'` or `'O'`      |

**Returns:** `true` if the mark was placed, `false` if the move was invalid.

**Validation:** Calls `isValidMove()` internally. Does not place the mark if the index is out of bounds or the cell is already occupied.

#### `isValidMove(index)` → boolean

Checks whether a move at the given index is legal.

| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| `index`   | number | Cell position (0-8) |

**Returns:** `true` if:
- `index` is >= 0 and < `cells.length`
- `cells[index]` is `null`

#### `isFull()` → boolean

Checks whether all cells are occupied.

**Returns:** `true` if every cell is non-null.

#### `reset()`

Clears the board by setting all cells to `null`.

**Returns:** `void`

#### `getCell(index)` → string | null

Returns the value at the given cell index.

| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| `index`   | number | Cell position (0-8) |

**Returns:** `'X'`, `'O'`, or `null`.

#### `getEmptyCells()` → number[]

Returns an array of indices for all empty cells.

**Returns:** Array of cell indices where `cells[i] === null`. Used by the AI to enumerate possible moves.

#### `clone()` → Board

Creates a deep copy of the board.

**Returns:** A new `Board` instance with the same `size` and a copy of the `cells` array.

---

## WinChecker

Generates win patterns and checks for a winner.

**File:** `app.js` | **Lines:** 106-157

### Constructor

```js
new WinChecker(size = 3)
```

| Parameter | Type   | Default | Description         |
|-----------|--------|---------|---------------------|
| `size`    | number | `3`     | Board dimension     |

### Properties

| Property      | Type            | Description                    |
|---------------|-----------------|--------------------------------|
| `winPatterns` | `number[][]`    | Array of 8 winning index combinations (for 3x3) |

### Static Methods

#### `WinChecker.generatePatterns(size)` → number[][]

Generates all possible winning patterns for a board of the given size.

| Parameter | Type   | Description     |
|-----------|--------|-----------------|
| `size`    | number | Board dimension |

**Returns:** Array of patterns. Each pattern is an array of cell indices that form a winning line.

For a 3x3 board, returns 8 patterns:
- 3 rows: `[0,1,2]`, `[3,4,5]`, `[6,7,8]`
- 3 columns: `[0,3,6]`, `[1,4,7]`, `[2,5,8]`
- 2 diagonals: `[0,4,8]`, `[2,4,6]`

### Methods

#### `check(cells)` → object | null

Checks the given cell array for a winner.

| Parameter | Type  | Description              |
|-----------|-------|--------------------------|
| `cells`   | Array | Flat array of cell values |

**Returns:**
- `{ winner: string, pattern: number[] }` if a player has won
- `null` if no winner is found

The `winner` field is the symbol (`'X'` or `'O'`). The `pattern` field is the array of winning cell indices.

---

## AIPlayer

AI opponent using the minimax algorithm with alpha-beta pruning. Supports three difficulty levels.

**File:** `app.js` | **Lines:** 167-270

### Constructor

```js
new AIPlayer(symbol, opponentSymbol, difficulty, winChecker)
```

| Parameter        | Type       | Description                        |
|------------------|------------|------------------------------------|
| `symbol`         | string     | The AI's mark (`'X'` or `'O'`)    |
| `opponentSymbol` | string     | The human's mark                   |
| `difficulty`     | string     | `'easy'`, `'medium'`, or `'hard'`  |
| `winChecker`     | WinChecker | Shared win checker instance        |

### Properties

| Property         | Type       | Description                          |
|------------------|------------|--------------------------------------|
| `symbol`         | string     | The AI's mark character              |
| `opponentSymbol` | string     | The human's mark character           |
| `difficulty`     | string     | Current difficulty level             |
| `winChecker`     | WinChecker | Reference to the shared win checker  |

### Methods

#### `chooseMove(board)` → number

Selects a move based on the current difficulty level.

| Parameter | Type  | Description        |
|-----------|-------|--------------------|
| `board`   | Board | Current board state |

**Returns:** The index of the chosen cell (0-8), or `-1` if no empty cells remain.

**Behavior by difficulty:**

| Difficulty | Strategy |
|------------|----------|
| `'easy'`   | Returns `_randomMove(emptyCells)` |
| `'medium'` | 60% chance: `_bestMove(board)`, 40% chance: `_randomMove(emptyCells)` |
| `'hard'`   | Returns `_bestMove(board)` |

### Private Methods

#### `_randomMove(emptyCells)` → number

Picks a random cell from the given array of empty cell indices.

| Parameter    | Type     | Description              |
|--------------|----------|--------------------------|
| `emptyCells` | number[] | Array of empty cell indices |

**Returns:** A randomly selected index from the array.

#### `_bestMove(board)` → number

Finds the optimal move using minimax search.

| Parameter | Type  | Description        |
|-----------|-------|--------------------|
| `board`   | Board | Current board state |

**Returns:** The index of the best move.

Iterates over all empty cells, simulates each move, calls `_minimax()` to evaluate, and returns the move with the highest score.

**Note:** This method modifies `board.cells` directly during search (places and removes marks) rather than cloning. The board is restored to its original state after evaluation.

#### `_minimax(cells, depth, isMaximizing, alpha, beta)` → number

Recursive minimax evaluation with alpha-beta pruning.

| Parameter      | Type                | Description                             |
|----------------|---------------------|-----------------------------------------|
| `cells`        | Array<string\|null> | Board cell array (mutated during search) |
| `depth`        | number              | Current recursion depth                  |
| `isMaximizing` | boolean             | `true` if evaluating the AI's turn       |
| `alpha`        | number              | Best score the maximizer can guarantee   |
| `beta`         | number              | Best score the minimizer can guarantee   |

**Returns:** The evaluated score for the current board state.

**Terminal conditions:**
- Winner found: returns `10 - depth` (AI wins) or `depth - 10` (human wins)
- No empty cells: returns `0` (draw)

**Pruning:** Stops evaluating a branch when `beta <= alpha`.

---

## ModeSelector

Manages the game mode selection overlay UI.

**File:** `app.js` | **Lines:** 279-346

### Constructor

```js
new ModeSelector()
```

Queries all required DOM elements for the mode selection overlay and sets up default configuration.

### Properties

| Property | Type   | Description                              |
|----------|--------|------------------------------------------|
| `els`    | object | Map of DOM element references             |
| `config` | object | Current selection state (see below)       |

#### `config` Structure

| Key           | Type   | Default    | Description              |
|---------------|--------|------------|--------------------------|
| `mode`        | string | `'human'`  | `'human'` or `'ai'`     |
| `humanSymbol` | string | `'X'`      | `'X'` or `'O'`          |
| `difficulty`  | string | `'medium'` | `'easy'`, `'medium'`, or `'hard'` |

#### `els` Structure

| Key                 | Element ID               |
|---------------------|--------------------------|
| `els.overlay`       | `#mode-overlay`          |
| `els.typeOptions`   | `#mode-type-options`     |
| `els.aiSettings`    | `#mode-ai-settings`      |
| `els.symbolOptions` | `#mode-symbol-options`   |
| `els.difficultyOptions` | `#mode-difficulty-options` |
| `els.startBtn`      | `#mode-start-btn`        |

### Methods

#### `show()`

Shows the mode selection overlay by adding the `'visible'` class. Focuses the Start Game button.

**Returns:** `void`

#### `hide()`

Hides the mode selection overlay by removing the `'visible'` class.

**Returns:** `void`

#### `onStart(handler)`

Registers a callback for the Start Game button click.

| Parameter | Type     | Description                                    |
|-----------|----------|------------------------------------------------|
| `handler` | function | Callback receiving a copy of `config` as argument |

The handler receives `{ mode, humanSymbol, difficulty }`.

**Returns:** `void`

### Private Methods

#### `_bindOptionGroups()`

Wires click handlers for all three option groups (mode type, symbol, difficulty). Each group calls `_bindGroup()` with a callback that updates the corresponding `config` property.

The mode type callback also toggles the `'visible'` class on `els.aiSettings`.

#### `_bindGroup(container, onChange)`

Generic event delegation for option button groups.

| Parameter   | Type       | Description                                |
|-------------|------------|--------------------------------------------|
| `container` | HTMLElement| Container element with `.mode-option` buttons |
| `onChange`  | function   | Callback receiving the selected `data-value` |

On click:
1. Removes `'selected'` class and sets `aria-pressed="false"` on all options in the container.
2. Adds `'selected'` class and sets `aria-pressed="true"` on the clicked option.
3. Calls `onChange(btn.dataset.value)`.

---

## UI

Manages all DOM interactions: rendering, status updates, overlays, confetti, and event binding.

**File:** `app.js` | **Lines:** 356-558

### Constructor

```js
new UI()
```

Queries all required DOM elements by ID and stores them in `this.els`. Also builds `this.cellButtons` from the `.cell` buttons within the board.

### Properties

| Property      | Type     | Description                         |
|---------------|----------|-------------------------------------|
| `els`         | object   | Map of DOM element references        |
| `cellButtons` | Element[]| Array of 9 cell button elements      |

#### `els` Structure

| Key                     | Element ID / Selector              |
|-------------------------|------------------------------------|
| `els.board`             | `#board`                           |
| `els.statusText`        | `#status-text`                     |
| `els.scoreX`            | `#score-x`                         |
| `els.scoreO`            | `#score-o`                         |
| `els.scoreDraws`        | `#score-draws`                     |
| `els.scorePlayerX`      | `#score-player-x`                  |
| `els.scorePlayerO`      | `#score-player-o`                  |
| `els.btnNewGame`        | `#btn-new-game`                    |
| `els.btnResetScores`    | `#btn-reset-scores`                |
| `els.overlay`           | `#game-overlay`                    |
| `els.overlayIcon`       | `#overlay-icon`                    |
| `els.overlayTitle`      | `#overlay-title`                   |
| `els.overlaySubtitle`   | `#overlay-subtitle`                |
| `els.overlayPlayAgain`  | `#overlay-play-again`              |
| `els.confettiContainer` | `#confetti-container`              |
| `els.scorePlayerXLabel` | `#score-player-x .score-player-label` |
| `els.scorePlayerOLabel` | `#score-player-o .score-player-label` |

### Player Label Methods

#### `setPlayerLabels(labelX, labelO)`

Sets the scoreboard player labels.

| Parameter | Type   | Description                          |
|-----------|--------|--------------------------------------|
| `labelX`  | string | Label for X's section (e.g., "You")  |
| `labelO`  | string | Label for O's section (e.g., "Computer") |

Used to switch between "Player X"/"Player O" and "You"/"Computer" based on game mode.

### Board Rendering Methods

#### `renderMark(index, symbol)`

Renders a player's mark in a cell.

| Parameter | Type   | Description              |
|-----------|--------|--------------------------|
| `index`   | number | Cell position (0-8)      |
| `symbol`  | string | `'X'` or `'O'`          |

Creates a `<span class="cell-mark mark-x|mark-o">` element, appends it to the cell, adds `cell--filled` class, and updates the cell's `aria-label`.

#### `updateHoverHints(symbol)`

Updates the ghost hover preview on empty cells.

| Parameter | Type   | Description                          |
|-----------|--------|--------------------------------------|
| `symbol`  | string | Symbol to show on hover (`'X'` or `'O'`) |

Sets `data-hover` on all cells that don't have the `cell--filled` class.

#### `highlightWinCells(pattern)`

Adds the win animation to the winning cells.

| Parameter | Type     | Description                    |
|-----------|----------|--------------------------------|
| `pattern` | number[] | Array of 3 winning cell indices |

Adds `cell--win` class to each cell in the pattern.

#### `markAllCellsDraw()`

Adds `cell--draw` class to all cells (fade effect for draw state).

#### `disableAllCells()`

Disables all cells by adding `cell--disabled` class and the `disabled` attribute. Called both when the game ends and during the AI's thinking phase.

#### `clearBoard()`

Resets all cells to their initial state: removes inner HTML, resets className to `'cell'`, removes `disabled` attribute, sets `data-hover` to `'X'`, and restores the default `aria-label`.

### Status Methods

#### `setStatus(text, cssClass)`

Sets the status text content and optional CSS class.

| Parameter  | Type   | Description                    |
|------------|--------|--------------------------------|
| `text`     | string | Status message                 |
| `cssClass` | string | Optional CSS class to add      |

Resets the element's className to `'status-text'` before adding the new class.

#### `setTurnStatus(symbol, label)`

Sets status to indicate whose turn it is, using the provided label.

| Parameter | Type   | Description                                |
|-----------|--------|--------------------------------------------|
| `symbol`  | string | `'X'` or `'O'` (for color class)          |
| `label`   | string | Display name (e.g., "Player X", "You")     |

Displays `"{label}'s turn"` with the appropriate `turn-x` or `turn-o` class.

#### `setThinkingStatus(symbol)`

Sets status to "Computer thinking..." with the AI's color class.

| Parameter | Type   | Description                      |
|-----------|--------|----------------------------------|
| `symbol`  | string | AI's symbol (for color class)    |

#### `setWinStatus(label)`

Sets status to announce a win using the provided label.

| Parameter | Type   | Description                          |
|-----------|--------|--------------------------------------|
| `label`   | string | Winner's display name (e.g., "You")  |

Displays `"{label} wins!"` with the `'win'` class.

#### `setDrawStatus()`

Sets status to "It's a draw!" with the `'draw'` class.

### Scoreboard Methods

#### `updateScores(playerX, playerO, draws)`

Updates all score displays.

| Parameter | Type   | Description        |
|-----------|--------|--------------------|
| `playerX` | Player | Player X instance  |
| `playerO` | Player | Player O instance  |
| `draws`   | number | Current draw count |

Reads `.score` from each player and sets the corresponding element's `textContent`.

#### `setActivePlayer(symbol)`

Highlights the active player in the scoreboard.

| Parameter | Type   | Description    |
|-----------|--------|----------------|
| `symbol`  | string | `'X'` or `'O'` |

Toggles the `'active'` class on the X and O scoreboard sections.

### Overlay Methods

#### `showWinOverlay(label, symbol)`

Displays the win overlay with mode-appropriate content.

| Parameter | Type   | Description                    |
|-----------|--------|--------------------------------|
| `label`   | string | Winner's display name          |
| `symbol`  | string | Winner's symbol (for color class) |

Sets the icon, title (with `win-x` or `win-o` class using the label), and subtitle, then shows the overlay and focuses the Play Again button.

#### `showDrawOverlay()`

Displays the draw overlay with draw-specific content. Sets icon, title (with `draw` class), and subtitle.

#### `hideOverlay()`

Removes the `'visible'` class from the overlay.

### Confetti Methods

#### `spawnConfetti(count = 30)`

Creates animated confetti particles.

| Parameter | Type   | Default | Description            |
|-----------|--------|---------|------------------------|
| `count`   | number | `30`    | Number of particles    |

Creates `<div class="confetti">` elements with random colors, positions, sizes, and animation durations. Appends them to the confetti container. Clears the container after 4000ms.

**Colors used:** `#e94560`, `#00d4ff`, `#4cd964`, `#ffcc00`, `#ff8a80`, `#a78bfa`

### Event Binding Methods

#### `onCellClick(handler)`

Registers a click handler for cell clicks using event delegation.

| Parameter | Type     | Description                           |
|-----------|----------|---------------------------------------|
| `handler` | function | Callback receiving the cell index (number) |

Uses `e.target.closest('.cell')` to find the clicked cell, then calls `handler(index)`.

#### `onNewGame(handler)`

Registers a click handler for the New Game button.

#### `onResetScores(handler)`

Registers a click handler for the Reset Scores button.

#### `onPlayAgain(handler)`

Registers a click handler for the Play Again button (in the overlay).

---

## Game

The main controller that orchestrates gameplay by composing all other classes. Supports both human vs human and human vs AI modes.

**File:** `app.js` | **Lines:** 567-814

### Constructor

```js
new Game()
```

Creates all dependencies (`Player`, `Board`, `WinChecker`, `UI`, `ModeSelector`), binds events, and initializes the scoreboard. The game starts with `gameOver = true` until a mode is selected.

### Properties

| Property             | Type            | Description                              |
|----------------------|-----------------|------------------------------------------|
| `players`            | Player[]        | `[Player('X'), Player('O')]`             |
| `board`              | Board           | Game board instance                       |
| `winChecker`         | WinChecker      | Win checker instance                      |
| `ui`                 | UI              | UI manager instance                       |
| `modeSelector`       | ModeSelector    | Mode selection overlay manager            |
| `currentPlayerIndex` | number          | `0` (X's turn) or `1` (O's turn)         |
| `draws`              | number          | Total draws this session                  |
| `gameOver`           | boolean         | `true` when not actively playing          |
| `aiThinking`         | boolean         | `true` during AI move computation         |
| `aiTimeoutId`        | number \| null  | ID of the AI delay timer (for cleanup)    |
| `gameMode`           | string          | `'human'` or `'ai'`                      |
| `humanSymbol`        | string          | The human player's symbol in AI mode      |
| `aiSymbol`           | string \| null  | The AI's symbol, or `null` in human mode  |
| `aiPlayer`           | AIPlayer \| null| AI instance, or `null` in human mode      |
| `labelX`             | string          | Display label for X (e.g., "You", "Player X") |
| `labelO`             | string          | Display label for O (e.g., "Computer", "Player O") |

### Getters

#### `currentPlayer` → Player

Returns `this.players[this.currentPlayerIndex]`.

### Private Methods

#### `_labelFor(symbol)` → string

Returns the display label for a given symbol.

| Parameter | Type   | Description    |
|-----------|--------|----------------|
| `symbol`  | string | `'X'` or `'O'` |

**Returns:** `this.labelX` if symbol is `'X'`, otherwise `this.labelO`.

#### `_isAITurn()` → boolean

Checks whether the current turn belongs to the AI.

**Returns:** `true` if `gameMode === 'ai'` and the current player's symbol matches `aiSymbol`.

#### `_bindEvents()`

Wires UI and ModeSelector events to game methods:
- Cell click → `_handleMove`
- New Game button → `_showModeSelector`
- Reset Scores button → `_resetScores`
- Play Again button → `_playAgain`
- Mode Start button → `_startGame`

#### `_startGame(config)`

Initializes the game with the given mode configuration from the ModeSelector.

| Parameter | Type   | Description                                     |
|-----------|--------|-------------------------------------------------|
| `config`  | object | `{ mode, humanSymbol, difficulty }` from ModeSelector |

In AI mode:
1. Creates a new `AIPlayer` with the config.
2. Sets `humanSymbol` and `aiSymbol`.
3. Sets labels to "You" and "Computer" (positioned by symbol).

In human mode:
1. Sets `aiPlayer` to `null`.
2. Sets labels to "Player X" and "Player O".

Then calls `UI.setPlayerLabels()` and `_newGame()`.

#### `_handleMove(index)`

Handles a human player's cell click.

1. Returns immediately if `gameOver`, `aiThinking`, or `_isAITurn()`.
2. Attempts to place the mark via `Board.placeMark()`. Returns if invalid.
3. Renders the mark via `UI.renderMark()`.
4. Calls `_afterMove()`.

#### `_afterMove()`

Post-move evaluation, shared by human and AI moves.

1. Checks for a winner via `WinChecker.check()`.
2. If winner found: calls `_handleWin()`.
3. If board full: calls `_handleDraw()`.
4. Otherwise: calls `_switchTurn()`.

#### `_handleWin(result)`

Processes a win.

1. Sets `gameOver = true`.
2. Gets the display label for the winner.
3. Increments the winning player's score.
4. Highlights winning cells and disables all cells.
5. Updates status (with label) and scoreboard.
6. After 600ms delay: shows win overlay (with label and symbol) and spawns confetti.

#### `_handleDraw()`

Processes a draw.

1. Sets `gameOver = true`.
2. Increments draw count.
3. Marks all cells as draw and disables them.
4. Updates status and scoreboard.
5. After 600ms delay: shows draw overlay.

#### `_switchTurn()`

Switches to the other player. Toggles `currentPlayerIndex` between 0 and 1. Updates active player highlight and hover hints. If it's the AI's turn, sets thinking status and calls `_triggerAIMove()`. Otherwise, sets normal turn status.

#### `_triggerAIMove()`

Schedules and executes the AI's move.

1. Sets `aiThinking = true`.
2. Disables all cells via `UI.disableAllCells()`.
3. Sets a random delay (400-800ms).
4. In the timeout callback:
   - Checks if game was reset (returns if `gameOver`).
   - Calls `AIPlayer.chooseMove(board)`.
   - Places and renders the AI's mark.
   - Sets `aiThinking = false`.
   - Calls `_afterMove()`.
   - If game continues: calls `_enableEmptyCells()`.

#### `_enableEmptyCells()`

Re-enables unfilled cells after the AI's move completes. Removes `cell--disabled` class and `disabled` attribute from cells without `cell--filled`.

#### `_newGame()`

Starts a new game round.

1. Clears any pending AI timeout.
2. Sets `aiThinking = false`.
3. Resets the board and current player index.
4. Clears `gameOver`.
5. Clears the board UI.
6. Syncs all UI state.
7. If the AI goes first (`_isAITurn()`): sets thinking status and triggers AI move.

#### `_resetScores()`

Resets all player scores to 0 and draw count to 0. Updates the scoreboard display.

#### `_playAgain()`

Hides the overlay and calls `_newGame()`. Keeps the same mode/difficulty settings.

#### `_showModeSelector()`

Opens the mode selection overlay.

1. Clears any pending AI timeout.
2. Sets `aiThinking = false`.
3. Sets `gameOver = true`.
4. Shows the mode selector.

#### `_syncUI()`

Synchronizes the entire UI with current state: turn status (with label), active player, hover hints, and scores.

---

## Bootstrap

**File:** `app.js` | **Lines:** 820-822

```js
document.addEventListener('DOMContentLoaded', () => {
  new Game();
});
```

Creates a `Game` instance once the DOM is fully loaded. The mode selection overlay appears immediately since `gameOver` starts as `true`.
