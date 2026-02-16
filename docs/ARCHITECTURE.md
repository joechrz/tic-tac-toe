# Architecture

System architecture documentation for the Tic Tac Toe game.

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Component Diagram](#component-diagram)
- [Class Hierarchy](#class-hierarchy)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Event System](#event-system)
- [AI Architecture](#ai-architecture)
- [Rendering Pipeline](#rendering-pipeline)
- [File Organization](#file-organization)

## High-Level Architecture

The application uses an **MVC (Model-View-Controller)** pattern implemented as seven ES6 classes in a single JavaScript file, rendered by an HTML page with embedded CSS.

```
┌──────────────────────────────────────────────────────┐
│                    index.html                         │
│  ┌────────────────────┐  ┌────────────────────────┐  │
│  │    HTML Structure   │  │   CSS (Design Tokens)  │  │
│  │   - Semantic markup │  │   - Custom properties  │  │
│  │   - ARIA attributes │  │   - Responsive layout  │  │
│  │   - Grid of 9 cells │  │   - Mode selector CSS  │  │
│  │   - Mode selector   │  │   - Animations         │  │
│  └────────────────────┘  └────────────────────────┘  │
└──────────────────────────┬───────────────────────────┘
                           │ <script src="app.js">
┌──────────────────────────▼───────────────────────────┐
│                      app.js                           │
│                                                       │
│  ┌─────────┐ ┌─────────┐ ┌────────────┐             │
│  │ Player  │ │  Board  │ │ WinChecker │  Models /    │
│  │ (Model) │ │ (Model) │ │ (Service)  │  Services    │
│  └────┬────┘ └────┬────┘ └─────┬──────┘             │
│       │           │            │                      │
│       │      ┌────▼────────────▼──────┐              │
│       │      │     AIPlayer (Service) │              │
│       │      │  Minimax + alpha-beta  │              │
│       │      └────────────┬───────────┘              │
│       │                   │                           │
│  ┌────▼───────────────────▼───────────┐              │
│  │           Game (Controller)         │              │
│  │  - Wires models to views           │              │
│  │  - Implements game rules           │              │
│  │  - Manages AI turns                │              │
│  └────┬───────────────────┬───────────┘              │
│       │                   │                           │
│  ┌────▼──────────┐  ┌────▼───────────────────┐      │
│  │ ModeSelector  │  │        UI (View)        │      │
│  │   (View)      │  │  - DOM manipulation     │      │
│  │ Mode overlay  │  │  - Event listeners      │      │
│  │ AI settings   │  │  - Rendering/animations │      │
│  └───────────────┘  └────────────────────────┘      │
└──────────────────────────────────────────────────────┘
```

## Component Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                              Game                                 │
│                                                                   │
│  Properties:                                                      │
│    players: [Player('X'), Player('O')]                            │
│    board: Board              winChecker: WinChecker               │
│    ui: UI                    modeSelector: ModeSelector           │
│    aiPlayer: AIPlayer|null   gameMode: 'human'|'ai'              │
│    currentPlayerIndex: 0|1   gameOver: boolean                   │
│    aiThinking: boolean       aiTimeoutId: number|null            │
│    humanSymbol / aiSymbol    labelX / labelO                     │
│                                                                   │
│  Orchestrates:                                                    │
│    _startGame(config) ──► configure mode, create AIPlayer        │
│    _handleMove(index) ──► Board.placeMark() → _afterMove()       │
│    _switchTurn()      ──► human: UI.setTurnStatus()              │
│                       ──► AI: UI.setThinkingStatus() + AI move   │
│    _triggerAIMove()   ──► AIPlayer.chooseMove() → _afterMove()   │
└───┬──────┬──────┬──────┬──────────┬───────────┬──────────────────┘
    │      │      │      │          │           │
┌───▼──┐┌──▼───┐┌─▼────────┐┌─────▼────┐┌─────▼────────┐┌────────────┐
│Player││Board ││WinChecker││ AIPlayer ││ ModeSelector ││    UI      │
│      ││      ││          ││          ││              ││            │
│symbol││cells ││winPat-   ││symbol    ││els (DOM)     ││els (DOM)   │
│score ││size  ││terns     ││opponent  ││config        ││cellButtons │
│      ││      ││          ││difficulty││              ││            │
│incr()││place()│check()   ││choose    ││show()/hide() ││renderMark()│
│reset()│valid()│generate  ││Move()    ││onStart()     ││setStatus() │
│css() ││full() │Patterns()││_minimax()││_bindGroup()  ││showOverlay│
│mark()││empty()│          ││_bestMove()│              ││spawnConf. │
│      ││clone()│          ││_random   ││              ││setLabels()│
│      ││      ││          ││Move()    ││              ││setThinking│
└──────┘└──────┘└──────────┘└──────────┘└──────────────┘└────────────┘
```

## Class Hierarchy

The project uses composition, not inheritance. All seven classes are standalone:

```
Player          ── value object (symbol + score)
Board           ── data structure (cell array + validation + cloning)
WinChecker      ── stateless service (pattern matching)
AIPlayer        ── stateless service (minimax decision-making)
ModeSelector    ── view layer (mode selection overlay + config)
UI              ── view layer (game DOM manipulation + events)
Game            ── controller (composes all above)
```

Dependency graph:

```
Game ──depends──► Player (×2)
     ──depends──► Board
     ──depends──► WinChecker
     ──depends──► AIPlayer ──depends──► WinChecker (shared instance)
     ──depends──► ModeSelector ──depends──► DOM
     ──depends──► UI ──depends──► DOM
```

`AIPlayer` shares the `WinChecker` instance owned by `Game`. No class depends on `Game`. The dependency flow is strictly top-down.

## Data Flow

### Mode Selection Flow

```
DOM Event (click on mode options / Start Game)
    │
    ▼
ModeSelector._bindGroup()     ← event delegation on option containers
    │
    ▼
ModeSelector.config updated   ← stores mode, humanSymbol, difficulty
    │
    ▼
ModeSelector.onStart(handler) ← Start Game click
    │
    ▼
Game._startGame(config)       ← controller configures game
    │
    ├──► AIPlayer created (if AI mode)
    ├──► Labels set ("You"/"Computer" or "Player X"/"Player O")
    └──► Game._newGame() → (AI first? → _triggerAIMove())
```

### Human Input Flow

```
DOM Event (click)
    │
    ▼
UI.onCellClick(handler)         ← event delegation on #board
    │
    ▼
Game._handleMove(index)         ← guards: gameOver, aiThinking, isAITurn
    │
    ├──► Board.placeMark()      ← model updates
    ├──► UI.renderMark()        ← view updates
    └──► Game._afterMove()
              │
              ├──► WinChecker.check()
              │         │
              │         ├── win  → Game._handleWin()
              │         ├── draw → Game._handleDraw()
              │         └── none → Game._switchTurn()
              │                        │
              │                   ┌────┴────┐
              │                   │         │
              │              Human turn  AI turn
              │              UI.setTurn  UI.setThinking
              │              Status()    Status()
              │                          _triggerAIMove()
              │
              └──► (AI move if AI's turn)
```

### AI Move Flow

```
Game._triggerAIMove()
    │
    ├── aiThinking = true
    ├── UI.disableAllCells()
    │
    └── setTimeout(400-800ms)
            │
            ├── AIPlayer.chooseMove(board)
            │       │
            │       ├── easy: _randomMove()
            │       ├── medium: 60% _bestMove() / 40% _randomMove()
            │       └── hard: _bestMove() → _minimax()
            │
            ├── Board.placeMark(move)
            ├── UI.renderMark(move)
            ├── aiThinking = false
            │
            └── Game._afterMove()
                    │
                    ├── win/draw: normal handling
                    └── continue: _enableEmptyCells()
```

### Data Stores

| Store               | Location                    | Scope            |
|----------------------|-----------------------------|------------------|
| Board state          | `Board.cells`               | Single game      |
| Player scores        | `Player.score`              | Session (in-memory) |
| Draw count           | `Game.draws`                | Session (in-memory) |
| Current turn         | `Game.currentPlayerIndex`   | Single game      |
| Game-over flag       | `Game.gameOver`             | Single game      |
| AI thinking flag     | `Game.aiThinking`           | Single AI turn   |
| Game mode config     | `Game.gameMode`, `humanSymbol`, `aiSymbol` | Session |
| Mode selector config | `ModeSelector.config`       | Between games    |

All state is in-memory. Nothing is persisted to disk or `localStorage`.

## State Management

### Game States

```
┌────────────────────┐
│   MODE SELECTION   │  (gameOver = true, mode overlay visible)
└────────┬───────────┘
         │ "Start Game" click
┌────────▼───────────┐
│       IDLE         │  (awaiting human move)
└────────┬───────────┘
         │ cell click (or AI first move)
┌────────▼───────────┐
│    MOVE MADE       │  (mark placed, checking result)
└────────┬───────────┘
         │
    ┌────┼────────────┐
    ▼    ▼            ▼
┌──────┐┌──────┐┌──────────┐
│ WIN  ││ DRAW ││ CONTINUE │
│      ││      ││(switch   │
│      ││      ││ turn)    │
└──┬───┘└──┬───┘└────┬─────┘
   │       │         │
   │       │    ┌────┴─────────┐
   │       │    ▼              ▼
   │       │ ┌────────┐  ┌──────────┐
   │       │ │ HUMAN  │  │AI THINK  │
   │       │ │ IDLE   │  │(disabled,│
   │       │ │        │  │ thinking)│
   │       │ └────────┘  └────┬─────┘
   │       │                  │ AI places mark
   │       │                  └──► MOVE MADE (loop)
   ▼       ▼
┌────────────────────┐
│     GAME OVER      │  (overlay shown, cells disabled)
└────────┬───────────┘
         │
    ┌────┴──────────┐
    ▼               ▼
┌──────────┐  ┌────────────────┐
│Play Again│  │   New Game     │
│(same mode│  │(mode selection)│
│→ IDLE)   │  │→ MODE SELECT)  │
└──────────┘  └────────────────┘
```

### Turn Tracking

Turn is tracked by `currentPlayerIndex` (0 or 1), toggled with:

```js
this.currentPlayerIndex = 1 - this.currentPlayerIndex;
```

After toggling, `_switchTurn()` checks `_isAITurn()` to decide whether to wait for human input or trigger the AI.

## Event System

Events are bound once in `Game._bindEvents()` during construction:

```
DOM Event                  Handler Chain
─────────                  ─────────────
#board click            →  UI.onCellClick       →  Game._handleMove
#btn-new-game click     →  UI.onNewGame         →  Game._showModeSelector
#btn-reset-scores click →  UI.onResetScores     →  Game._resetScores
#overlay-play-again     →  UI.onPlayAgain       →  Game._playAgain
#mode-start-btn click   →  ModeSelector.onStart →  Game._startGame
#mode-type-options click→  ModeSelector._bindGroup → config.mode update
#mode-symbol-options    →  ModeSelector._bindGroup → config.humanSymbol update
#mode-difficulty-options→  ModeSelector._bindGroup → config.difficulty update
```

Both the board and mode selector use **event delegation** for their respective option groups.

## AI Architecture

### Algorithm: Minimax with Alpha-Beta Pruning

```
_minimax(cells, depth, isMaximizing, alpha, beta)
    │
    ├── Terminal check:
    │   ├── Winner found → return (10 - depth) or (depth - 10)
    │   └── No empty cells → return 0 (draw)
    │
    ├── Maximizing (AI's turn):
    │   │ For each empty cell:
    │   │   Place AI symbol → recurse → undo
    │   │   Track max score
    │   │   Alpha = max(alpha, score)
    │   │   Prune if beta <= alpha
    │   └── Return max score
    │
    └── Minimizing (human's turn):
        │ For each empty cell:
        │   Place human symbol → recurse → undo
        │   Track min score
        │   Beta = min(beta, score)
        │   Prune if beta <= alpha
        └── Return min score
```

### Scoring

| Outcome     | Score Formula | Example (depth=2) |
|-------------|---------------|-------------------|
| AI wins     | `10 - depth`  | 8                 |
| Human wins  | `depth - 10`  | -8                |
| Draw        | `0`           | 0                 |

Depth penalty ensures the AI prefers winning sooner and losing later.

### Integration with Game Controller

```
Game (Controller)
    │
    ├── Owns AIPlayer instance (created in _startGame)
    ├── Checks _isAITurn() after each human move
    ├── Calls _triggerAIMove() with artificial delay
    ├── Sets aiThinking flag to block human input
    ├── Tracks aiTimeoutId for cleanup on new game
    └── Calls _enableEmptyCells() after AI move
```

## Rendering Pipeline

When a mark is placed (human or AI), the UI performs these DOM operations:

```
1. Create <span class="cell-mark mark-x">X</span>
2. Append to cell button
3. Add .cell--filled class (prevents re-clicks, removes hover)
4. Update aria-label (e.g., "Row 1, Column 2 - X")
5. Update data-hover on remaining empty cells (next player's symbol)
```

During AI's turn:

```
1. Add .cell--disabled + disabled attr to ALL cells
2. Set status to "Computer thinking..." with player color
3. After AI move completes:
   a. Render mark on chosen cell
   b. Check win/draw
   c. If game continues: remove .cell--disabled from unfilled cells
```

On game over:

```
Win path:
1. Add .cell--win to winning cells (green glow animation)
2. Add .cell--disabled + disabled attr to all cells
3. Update status text class to 'win' (green pulse)
4. Update scoreboard numbers
5. After 600ms delay:
   a. Add .visible to overlay (fade in)
   b. Set overlay icon, title (with label), subtitle
   c. Spawn 30 confetti particles
   d. Focus "Play Again" button

Draw path:
1. Add .cell--draw to all cells (fade effect)
2. Add .cell--disabled + disabled attr to all cells
3. Update status text class to 'draw' (gold)
4. Update scoreboard numbers
5. After 600ms delay:
   a. Add .visible to overlay
   b. Set overlay content for draw
   c. Focus "Play Again" button
```

## File Organization

```
game/
├── index.html
│   ├── <style> (lines 7-960)
│   │   ├── CSS Custom Properties / Design Tokens
│   │   ├── Reset & Base Styles
│   │   ├── Game Container
│   │   ├── Main Area (side-by-side layout)
│   │   ├── Header / Title
│   │   ├── Scoreboard (vertical on desktop, horizontal on mobile)
│   │   ├── Status / Turn Indicator
│   │   ├── Game Board
│   │   ├── Individual Cell (+ states: filled, disabled, win, draw)
│   │   ├── Board Wrapper
│   │   ├── Controls / Buttons
│   │   ├── Mode Selection Overlay
│   │   ├── Game Over Overlay
│   │   ├── Footer
│   │   ├── Confetti Particles
│   │   ├── Responsive Breakpoints (600px, 360px, 768px, 600px height)
│   │   └── Accessibility
│   │
│   ├── <body> (lines 962-1131)
│   │   ├── .game-container
│   │   │   ├── header.game-header
│   │   │   ├── div.game-status
│   │   │   ├── div.game-main
│   │   │   │   ├── div.scoreboard (vertical column)
│   │   │   │   └── div.board-wrapper > div.board > 9× button.cell
│   │   │   ├── div.game-controls > 2× button
│   │   │   └── footer.game-footer
│   │   ├── div.mode-overlay (dialog, starts visible)
│   │   │   └── div.mode-content
│   │   │       ├── h2.mode-title
│   │   │       ├── div.mode-section (game mode options)
│   │   │       ├── div.mode-ai-settings (hidden by default)
│   │   │       │   ├── div.mode-section (symbol options)
│   │   │       │   └── div.mode-section (difficulty options)
│   │   │       └── button.mode-start-btn
│   │   ├── div.game-overlay (game-over dialog)
│   │   └── div.confetti-container
│   │
│   └── <script src="app.js">
│
└── app.js
    ├── Player class         (lines 18-42)
    ├── Board class          (lines 51-97)
    ├── WinChecker class     (lines 106-157)
    ├── AIPlayer class       (lines 167-270)
    ├── ModeSelector class   (lines 279-346)
    ├── UI class             (lines 356-558)
    ├── Game class           (lines 567-814)
    └── Bootstrap / DOMContentLoaded (lines 820-822)
```
