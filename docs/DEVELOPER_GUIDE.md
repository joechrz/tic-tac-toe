# Developer Guide

A guide for developers who want to understand, modify, or extend the Tic Tac Toe game.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Class Responsibilities](#class-responsibilities)
- [Game Flow](#game-flow)
- [AI Implementation](#ai-implementation)
- [DOM Integration](#dom-integration)
- [CSS Architecture](#css-architecture)
- [Extending the Game](#extending-the-game)
- [Common Pitfalls](#common-pitfalls)

## Prerequisites

- Basic knowledge of HTML, CSS, and JavaScript
- Understanding of ES6 classes and OOP concepts
- A modern web browser with developer tools
- A text editor or IDE

No build tools, package managers, or frameworks are required.

## Project Structure

```
game/
  index.html          # HTML structure + embedded CSS (~960 lines of CSS)
  app.js              # All game logic: 7 classes + bootstrap (~823 lines)
  docs/
    DESIGN.md         # UI design tokens and specifications
    CODE_REVIEW.md    # Code review findings and recommendations
    USER_GUIDE.md     # End-user documentation
    DEVELOPER_GUIDE.md# This file
    ARCHITECTURE.md   # System architecture diagrams
    API_REFERENCE.md  # Class/method reference
    CUSTOMIZATION.md  # Theming and extension guide
```

## Architecture Overview

The game follows an **MVC (Model-View-Controller)** pattern with two additional components for AI and mode selection:

```
┌──────────────────────────────────────────────────────┐
│                  Game (Controller)                     │
│  Coordinates game flow, handles events,               │
│  manages AI turns, delegates to model and view        │
├──────────┬──────────┬──────────┬─────────────────────┤
│  Player  │  Board   │ WinCheck │  AIPlayer (Service)  │
│  (Model) │  (Model) │ (Service)│  Minimax algorithm   │
├──────────┴──────────┴──────────┴─────────────────────┤
│          ModeSelector (View)  │  UI (View)            │
│          Mode selection UI    │  Game rendering       │
└───────────────────────────────┴──────────────────────┘
```

- **Models** (`Player`, `Board`) hold game state with no DOM knowledge.
- **Services** (`WinChecker`, `AIPlayer`) provide stateless computation.
- **Views** (`UI`, `ModeSelector`) own all DOM access and rendering.
- **Controller** (`Game`) wires everything together and contains game rules.

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed diagrams.

## Class Responsibilities

### Player (`app.js:18-42`)

Represents a player with a symbol and score.

| Property/Method     | Purpose                          |
|---------------------|----------------------------------|
| `symbol`            | `'X'` or `'O'`                  |
| `score`             | Current win count                |
| `cssClass`          | Returns `'player-x'` or `'player-o'` |
| `markClass`         | Returns `'mark-x'` or `'mark-o'`     |
| `incrementScore()`  | Adds 1 to score                  |
| `resetScore()`      | Sets score to 0                  |

### Board (`app.js:51-97`)

Manages the 3x3 grid state as a flat array of 9 cells.

| Property/Method      | Purpose                               |
|----------------------|---------------------------------------|
| `cells`              | `Array(9)` - `null`, `'X'`, or `'O'` |
| `placeMark(i, sym)`  | Places mark if valid, returns boolean |
| `isValidMove(i)`     | Checks bounds and empty cell          |
| `isFull()`           | Returns true if no empty cells        |
| `reset()`            | Fills all cells with `null`           |
| `getCell(i)`         | Returns value at index                |
| `getEmptyCells()`    | Returns array of indices with `null`  |
| `clone()`            | Returns a deep copy of the board      |

### WinChecker (`app.js:106-157`)

Generates and checks all possible winning patterns.

| Property/Method             | Purpose                              |
|-----------------------------|--------------------------------------|
| `winPatterns`               | Array of 8 patterns (3 rows, 3 cols, 2 diags) |
| `generatePatterns(size)`    | Static: builds patterns for any board size |
| `check(cells)`              | Returns `{winner, pattern}` or `null` |

### AIPlayer (`app.js:167-270`)

AI opponent using minimax with alpha-beta pruning. Supports three difficulty levels.

| Property/Method           | Purpose                                        |
|---------------------------|------------------------------------------------|
| `symbol`                  | AI's mark (`'X'` or `'O'`)                    |
| `opponentSymbol`          | Human's mark                                    |
| `difficulty`              | `'easy'`, `'medium'`, or `'hard'`              |
| `winChecker`              | Shared WinChecker reference                     |
| `chooseMove(board)`       | Returns the chosen cell index                   |
| `_randomMove(emptyCells)` | Picks a random empty cell                       |
| `_bestMove(board)`        | Uses minimax to find the optimal move           |
| `_minimax(cells, ...)`    | Recursive minimax with alpha-beta pruning       |

### ModeSelector (`app.js:279-346`)

Manages the game mode selection overlay UI.

| Property/Method              | Purpose                                 |
|------------------------------|-----------------------------------------|
| `els`                        | DOM element references for the overlay  |
| `config`                     | Current selection: `{mode, humanSymbol, difficulty}` |
| `show()` / `hide()`         | Toggles the overlay visibility          |
| `onStart(handler)`          | Registers callback for Start Game click |
| `_bindOptionGroups()`       | Wires option button selections          |
| `_bindGroup(container, fn)` | Generic option group click delegation   |

### UI (`app.js:356-558`)

Handles all DOM reading and writing. Grouped into subsystems:

| Subsystem      | Methods                                     |
|----------------|---------------------------------------------|
| Player labels  | `setPlayerLabels`                            |
| Board rendering| `renderMark`, `updateHoverHints`, `highlightWinCells`, `markAllCellsDraw`, `disableAllCells`, `clearBoard` |
| Status         | `setStatus`, `setTurnStatus`, `setThinkingStatus`, `setWinStatus`, `setDrawStatus` |
| Scoreboard     | `updateScores`, `setActivePlayer`           |
| Overlay        | `showWinOverlay`, `showDrawOverlay`, `hideOverlay` |
| Confetti       | `spawnConfetti`                              |
| Events         | `onCellClick`, `onNewGame`, `onResetScores`, `onPlayAgain` |

### Game (`app.js:567-814`)

The controller that orchestrates gameplay, supporting both human and AI modes.

| Property/Method          | Purpose                                    |
|--------------------------|--------------------------------------------|
| `players`                | Array of two `Player` instances             |
| `board`                  | `Board` instance                            |
| `winChecker`             | `WinChecker` instance                       |
| `ui`                     | `UI` instance                               |
| `modeSelector`           | `ModeSelector` instance                     |
| `currentPlayerIndex`     | `0` (X) or `1` (O)                         |
| `draws`                  | Draw count                                  |
| `gameOver`               | Boolean flag (starts `true` until mode selected) |
| `aiThinking`             | Boolean flag during AI computation          |
| `aiTimeoutId`            | Timer ID for AI delay (for cleanup)         |
| `gameMode`               | `'human'` or `'ai'`                        |
| `humanSymbol` / `aiSymbol` | Symbol assignments in AI mode             |
| `aiPlayer`               | `AIPlayer` instance (or `null`)             |
| `labelX` / `labelO`     | Display labels ("Player X"/"You"/"Computer")|
| `_startGame(config)`     | Initializes mode from selector config       |
| `_handleMove(index)`     | Human move handler (blocks during AI turn)  |
| `_afterMove()`           | Post-move logic: check win/draw, switch turn|
| `_switchTurn()`          | Toggles player, triggers AI if needed       |
| `_triggerAIMove()`       | Schedules AI move with artificial delay     |
| `_enableEmptyCells()`    | Re-enables cells after AI move completes    |
| `_showModeSelector()`    | Opens mode selection (cleans up AI timer)   |

## Game Flow

### Mode Selection → Game Start

```
Game loads → mode selector visible (gameOver = true)
  → User configures mode/symbol/difficulty
  → Clicks "Start Game"
  → Game._startGame(config)
    → Create AIPlayer (if AI mode)
    → Set labels ("You"/"Computer" or "Player X"/"Player O")
    → UI.setPlayerLabels()
    → Game._newGame()
      → If AI goes first → _triggerAIMove()
```

### Human Move Sequence

```
User clicks cell
  → Game._handleMove(index)
    → Guard: gameOver? aiThinking? AI's turn? → return
    → Board.placeMark(index, symbol)
    → UI.renderMark(index, symbol)
    → Game._afterMove()
      → WinChecker.check(cells)
      ├─ Win  → Game._handleWin(result)
      ├─ Draw → Game._handleDraw()
      └─ Continue → Game._switchTurn()
           ├─ Human's turn → UI.setTurnStatus()
           └─ AI's turn → UI.setThinkingStatus() + _triggerAIMove()
```

### AI Move Sequence

```
Game._triggerAIMove()
  → aiThinking = true
  → UI.disableAllCells()
  → setTimeout(400-800ms delay)
    → AIPlayer.chooseMove(board)
    → Board.placeMark(move, aiSymbol)
    → UI.renderMark(move, aiSymbol)
    → aiThinking = false
    → Game._afterMove()
      ├─ Win/Draw → handled normally
      └─ Continue → _enableEmptyCells() for human's turn
```

### New Game Flow

```
User clicks "New Game"
  → Game._showModeSelector()
    → Clear AI timeout (if pending)
    → aiThinking = false
    → gameOver = true
    → ModeSelector.show()

User clicks "Play Again"
  → Game._playAgain()
    → UI.hideOverlay()
    → Game._newGame() (same mode/settings)
```

## AI Implementation

### Minimax Algorithm

The `AIPlayer` uses the **minimax algorithm with alpha-beta pruning** to find the optimal move. The algorithm:

1. Recursively explores all possible future game states.
2. Assumes both players play optimally.
3. Scores terminal states: win = `10 - depth`, loss = `depth - 10`, draw = `0`.
4. The depth penalty ensures the AI prefers quicker wins and delays losses.
5. Alpha-beta pruning eliminates branches that cannot affect the final decision, improving performance.

### Difficulty Strategies

| Level  | Implementation (`chooseMove`) |
|--------|------------------------------|
| Easy   | Always calls `_randomMove()` - picks a random empty cell. |
| Medium | 60% chance of calling `_bestMove()` (minimax), 40% chance of `_randomMove()`. Decided per turn via `Math.random() < 0.6`. |
| Hard   | Always calls `_bestMove()` - full minimax search. Plays perfectly. |

### Performance

For a 3x3 board, the game tree is small (max ~9! = 362,880 leaf nodes). With alpha-beta pruning, far fewer nodes are evaluated. The AI computes instantly, but an artificial delay (400-800ms) is added to make the experience feel natural.

### AI Turn Management

The `Game` controller manages AI turns carefully:

- `aiThinking` flag prevents human clicks during AI computation.
- `_isAITurn()` checks if the current player's symbol matches `aiSymbol`.
- `aiTimeoutId` tracks the delay timer so it can be canceled on `_newGame()` or `_showModeSelector()`.
- After the AI moves, `_enableEmptyCells()` re-enables unfilled cells for the human player.

## DOM Integration

The UI and ModeSelector classes communicate with the DOM through specific IDs, classes, and data attributes.

### Key DOM IDs

| ID                  | Element             | Purpose                    |
|---------------------|---------------------|----------------------------|
| `board`             | `div.board`         | Board container (grid)     |
| `status-text`       | `span.status-text`  | Turn/result/thinking display |
| `score-x`           | `span`              | X's score value            |
| `score-o`           | `span`              | O's score value            |
| `score-draws`       | `span`              | Draw count value           |
| `score-player-x`    | `div`               | X's scoreboard section     |
| `score-player-o`    | `div`               | O's scoreboard section     |
| `btn-new-game`      | `button`            | New game button            |
| `btn-reset-scores`  | `button`            | Reset scores button        |
| `game-overlay`      | `div`               | Game-over overlay          |
| `overlay-icon`      | `div`               | Overlay emoji icon         |
| `overlay-title`     | `h2`                | Overlay result title       |
| `overlay-subtitle`  | `p`                 | Overlay subtitle text      |
| `overlay-play-again`| `button`            | Play again button          |
| `confetti-container`| `div`               | Confetti particle container|
| `mode-overlay`      | `div`               | Mode selection overlay     |
| `mode-type-options` | `div`               | Human/AI mode buttons      |
| `mode-ai-settings`  | `div`               | AI settings container      |
| `mode-symbol-options`| `div`              | X/O symbol choice buttons  |
| `mode-difficulty-options`| `div`          | Easy/Medium/Hard buttons   |
| `mode-start-btn`    | `button`            | Start game button          |

### CSS Class Toggles

| Class            | Applied To          | When                          |
|------------------|---------------------|-------------------------------|
| `cell--filled`   | `.cell`             | After a mark is placed         |
| `cell--win`      | `.cell`             | On winning cells               |
| `cell--draw`     | `.cell`             | On all cells during draw       |
| `cell--disabled` | `.cell`             | When game is over or AI thinking |
| `active`         | `.score-player`     | On the current player's panel  |
| `visible`        | `.game-overlay`     | When game-over overlay is shown |
| `visible`        | `.mode-overlay`     | When mode selector is shown    |
| `visible`        | `.mode-ai-settings` | When AI mode is selected       |
| `selected`       | `.mode-option`      | On the currently selected option|
| `turn-x`/`turn-o`| `.status-text`     | Matches current player         |
| `win`            | `.status-text`      | On win announcement            |
| `draw`           | `.status-text`      | On draw announcement           |

### Data Attributes

| Attribute      | Element        | Purpose                        |
|----------------|----------------|--------------------------------|
| `data-index`   | `.cell`        | Cell position (0-8)            |
| `data-hover`   | `.cell`        | Symbol for hover ghost preview |
| `data-value`   | `.mode-option` | Option value (e.g., 'ai', 'X', 'hard') |

## CSS Architecture

The CSS uses a design token system via custom properties. All visual values are defined in `:root` and referenced throughout the stylesheet.

### Token Categories

| Category     | Prefix              | Example                    |
|--------------|---------------------|----------------------------|
| Colors       | `--color-`          | `--color-accent-x: #e94560` |
| Typography   | `--font-`           | `--font-size-lg: 1.25rem`   |
| Spacing      | `--space-`          | `--space-md: 1rem`           |
| Borders      | `--radius-`         | `--radius-md: 12px`         |
| Shadows      | `--shadow-`         | `--shadow-md: 0 4px 16px ...` |
| Transitions  | `--transition-`     | `--transition-base: 250ms ease` |

### Layout Structure

The layout uses a `.game-main` flexbox wrapper that places the scoreboard and board side-by-side on desktop:

```
Desktop (600px+):
┌──────────────────────────────┐
│          Header              │
│        Status Bar            │
│  ┌──────────┐ ┌──────────┐  │
│  │Scoreboard│ │   Board   │  │
│  │ (vertical)│ │   3x3    │  │
│  └──────────┘ └──────────┘  │
│        [New Game] [Reset]    │
└──────────────────────────────┘

Mobile (<600px):
┌──────────────────────────────┐
│          Header              │
│        Status Bar            │
│  ┌──────────────────────┐   │
│  │ Scoreboard (horizontal)│  │
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │       Board 3x3      │   │
│  └──────────────────────┘   │
│   [New Game] [Reset Scores]  │
└──────────────────────────────┘
```

See [DESIGN.md](DESIGN.md) for the full token reference.

## Extending the Game

### Adding a New AI Difficulty

1. Add a new case in `AIPlayer.chooseMove()`:

```js
case 'nightmare':
  // e.g., prioritize center and corners before minimax
  return this._bestMoveWithOpening(board);
```

2. Add the corresponding button in the mode selector HTML:

```html
<button class="mode-option" data-value="nightmare" aria-pressed="false">Nightmare</button>
```

No other changes are needed - the `ModeSelector` reads `data-value` dynamically.

### Adding Sound Effects

1. Load audio files in the `UI` constructor.
2. Call `audio.play()` in the relevant UI methods (`renderMark`, `showWinOverlay`, etc.).
3. Respect the user's reduced-motion preference as a proxy for reduced sensory input.

### Adding Score Persistence

1. After updating scores, call `localStorage.setItem('scores', JSON.stringify({...}))`.
2. In the `Game` constructor, load saved scores with `localStorage.getItem('scores')`.
3. Clear saved scores in `_resetScores()`.

### Adding Undo

1. Add a `history` array to `Board` that records each move.
2. Implement `Board.undoLast()` that pops the last move and clears that cell.
3. Add a UI button and wire it to `Game._undoMove()`.
4. In AI mode, undo should remove both the human's and AI's last moves.

### Adding Online Multiplayer

1. Create a `NetworkManager` class that communicates via WebSocket or WebRTC.
2. In `Game._handleMove()`, send the move to the remote player.
3. On receiving a remote move, call `_handleMove()` as if it were a local click.
4. Use the `ModeSelector` to add an "Online" mode option.

## Common Pitfalls

1. **Don't manipulate the DOM from model classes.** All DOM access should go through the `UI` or `ModeSelector` classes.
2. **Don't forget to update ARIA labels** when modifying cell content or state.
3. **Board indices are 0-8**, mapping to a 3x3 grid in row-major order:
   ```
   0 | 1 | 2
   3 | 4 | 5
   6 | 7 | 8
   ```
4. **The `gameOver` flag** starts as `true` (until mode is selected) and must be checked at the start of `_handleMove`.
5. **The `aiThinking` flag** must also be checked in `_handleMove` to prevent human clicks during AI computation.
6. **Always clean up `aiTimeoutId`** when starting a new game or showing the mode selector. Forgetting this causes stale AI moves to fire after a reset.
7. **CSS custom properties** must be modified in `:root` to take effect globally. Changing them on child elements only affects that subtree.
8. **The 600ms overlay delay** allows win/draw animations to play before the overlay appears. Removing it causes the overlay to cover the animations.
9. **The AI delay (400-800ms)** is intentional UX. Without it, AI moves appear instant and feel jarring.
