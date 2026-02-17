# Tic-Tac-Toe Code Architecture

## Overview
This document explains the code architecture, design patterns, and implementation details of the Tic-Tac-Toe game.

## Architecture Principles

### SOLID Principles

#### Single Responsibility Principle (SRP)
Each class has one clear responsibility:
- **Board**: Manages board state only
- **WinChecker**: Checks for wins and draws only
- **Player**: Represents player identity only
- **AIPlayer**: Handles AI move selection only
- **UIController**: Manages DOM manipulation only
- **Game**: Orchestrates game flow only

#### Open/Closed Principle (OCP)
- Classes are open for extension but closed for modification
- `AIPlayer` extends `Player` without modifying Player class
- New player types can be added by extending Player
- New UI themes can be added without changing UIController logic

#### Liskov Substitution Principle (LSP)
- `AIPlayer` can substitute `Player` anywhere in the code
- Both implement the same interface and can be used interchangeably

#### Interface Segregation Principle (ISP)
- TypeScript interfaces define only what's needed
- `GameConfig`, `WinResult`, `Scores` are minimal and focused

#### Dependency Inversion Principle (DIP)
- High-level Game class depends on abstractions (Player interface)
- Low-level details (AIPlayer) depend on abstractions (Player)

## Module Structure

```
src/
├── types.ts          - Type definitions and interfaces
├── Board.ts          - Board state management
├── WinChecker.ts     - Win/draw detection logic
├── Player.ts         - Base player class
├── AIPlayer.ts       - AI player with minimax algorithm
├── UIController.ts   - DOM manipulation and UI updates
├── Game.ts           - Main game controller
└── main.ts           - Application entry point
```

## Class Diagrams

### Core Classes Relationship

```
┌─────────────┐
│    Game     │──────┐
│  (Controller)│      │
└─────────────┘      │
       │             │
       │ uses        │ uses
       │             │
       ▼             ▼
┌─────────────┐ ┌──────────────┐
│   Board     │ │ UIController │
└─────────────┘ └──────────────┘
       │
       │ used by
       ▼
┌──────────────┐
│ WinChecker   │
└──────────────┘

┌──────────┐
│  Player  │◄──────┐
└──────────┘       │
                   │ extends
            ┌──────────┐
            │ AIPlayer │
            └──────────┘
```

## Detailed Class Documentation

### 1. types.ts
Defines all TypeScript types and interfaces used throughout the application.

**Key Types:**
```typescript
type CellValue = 'X' | 'O' | null;
type PlayerType = 'human' | 'computer';
type GameState = 'setup' | 'playing' | 'won' | 'draw';
```

**Key Interfaces:**
```typescript
interface GameConfig - Game configuration
interface WinResult - Win detection result
interface Scores - Score tracking
```

### 2. Board.ts
Manages the 3×3 game board state.

**Responsibilities:**
- Store cell values
- Validate cell operations
- Track empty cells
- Provide board state queries

**Key Methods:**
```typescript
getCell(index): CellValue
setCell(index, value): void
isEmpty(index): boolean
getEmptyCells(): number[]
isFull(): boolean
reset(): void
clone(): Board
```

**Design Decisions:**
- Immutable operations (clone returns new instance)
- Validation on all operations
- Private validation methods for DRY principle

### 3. WinChecker.ts
Detects win conditions and draws.

**Responsibilities:**
- Check for winning combinations
- Check for draw conditions
- Provide win information (winner + combination)

**Win Combinations:**
```typescript
Rows: [0,1,2], [3,4,5], [6,7,8]
Columns: [0,3,6], [1,4,7], [2,5,8]
Diagonals: [0,4,8], [2,4,6]
```

**Key Methods:**
```typescript
checkWin(board): WinResult | null
checkDraw(board): boolean
isGameOver(board): boolean
```

**Design Decisions:**
- Pure functions (no side effects)
- Static WIN_COMBINATIONS for performance
- Returns rich WinResult with combination indices for UI highlighting

### 4. Player.ts
Base class representing a game player.

**Responsibilities:**
- Store player symbol (X or O)
- Store player type (human or computer)
- Provide player identity queries

**Key Properties:**
```typescript
symbol: CellValue (readonly)
type: PlayerType (readonly)
```

**Key Methods:**
```typescript
isHuman(): boolean
isComputer(): boolean
getSymbol(): CellValue
```

**Design Decisions:**
- Readonly properties for immutability
- Simple, focused interface
- Extensible through inheritance

### 5. AIPlayer.ts
AI player with intelligent move selection.

**Extends:** Player

**Responsibilities:**
- Select optimal moves
- Implement minimax algorithm
- Provide strategic opening moves

**Key Methods:**
```typescript
getBestMove(board, opponentSymbol): number
```

**Private Helper Methods:**
```typescript
minimax(board, depth, isMaximizing, opponentSymbol): number
findWinningMove(board, symbol): number | null
getStrategicOpeningMove(emptyCells): number
```

**AI Algorithm: Minimax**
```
function minimax(board, depth, isMaximizing):
    if terminal state (win/draw):
        return score

    if maximizing (AI turn):
        return max(all possible moves)
    else:
        return min(all possible moves)
```

**Strategic Opening Moves:**
1. Center (index 4) - best opening
2. Corners (0, 2, 6, 8) - second best
3. Edges (1, 3, 5, 7) - fallback

**Design Decisions:**
- Minimax for unbeatable play
- Depth-adjusted scoring for faster wins
- Strategic openings for performance
- Immediate win/block detection before minimax

### 6. UIController.ts
Handles all DOM manipulation and UI updates.

**Responsibilities:**
- Manage DOM element references
- Update UI based on game state
- Attach event handlers
- Show/hide modals
- Update scores and indicators

**Key Methods:**
```typescript
// Modal management
showSetupModal(): void
hideSetupModal(): void

// Event handlers
onSymbolSelect(handler): void
onFirstPlayerSelect(handler): void
onStartGame(handler): void
onCellClick(handler): void
onResetGame(handler): void
onResetScores(handler): void
onNewSetup(handler): void

// Board updates
updateCell(index, symbol): void
clearBoard(): void
disableCells(): void
enableCells(): void
highlightWinningCells(combination): void

// Status updates
updateTurnIndicator(message, playerType): void
updateGameStatus(message, type): void
updateScores(scores): void
updateScoreboardIcons(playerSymbol, computerSymbol): void
```

**Design Decisions:**
- All DOM queries cached in constructor
- Event handlers use callbacks for decoupling
- Clear separation between UI logic and game logic
- Error handling for missing DOM elements
- CSS class-based styling (no inline styles except error message)

### 7. Game.ts
Main game controller that orchestrates everything.

**Responsibilities:**
- Coordinate all game components
- Manage game state and flow
- Handle player turns
- Process moves
- Update scores
- Respond to user actions

**Key Properties:**
```typescript
board: Board
winChecker: WinChecker
ui: UIController
humanPlayer: Player
computerPlayer: AIPlayer
currentPlayer: Player
gameState: GameState
scores: Scores
```

**Key Methods:**
```typescript
// Initialization
constructor()
initializeEventHandlers(): void

// Game flow
startNewGame(): void
makeMove(index): void
makeComputerMove(): void
switchPlayer(): void

// Game end
checkGameEnd(): boolean
handleWin(winner, combination): void
handleDraw(): void

// Event handlers
handleSymbolSelect(symbol): void
handleFirstPlayerSelect(first): void
handleStartGame(): void
handleCellClick(index): void
handleResetGame(): void
handleResetScores(): void
handleNewSetup(): void

// Static factory
static initialize(): void
```

**Game Flow:**
```
1. Setup Phase:
   - Show setup modal
   - User selects symbol (X or O)
   - User selects who goes first
   - Click "Start Game"

2. Playing Phase:
   - If computer goes first, make computer move
   - Wait for player move (click cell)
   - Validate move
   - Update board and UI
   - Check for win/draw
   - If game continues, switch player
   - If computer's turn, make computer move
   - Repeat

3. Game End:
   - Highlight winning cells (if win)
   - Update scores
   - Disable board
   - Show game over message
   - Wait for "New Game" or "New Setup"
```

**Design Decisions:**
- Event-driven architecture
- Centralized state management
- Delay computer moves (500-600ms) for better UX
- Error handling with try-catch blocks
- Static initialize() method as entry point

### 8. main.ts
Application entry point.

**Responsibilities:**
- Initialize game on DOM ready
- Handle initialization errors
- Display error messages to user

**Design Decisions:**
- Waits for DOM to be ready
- Graceful error handling with user-friendly messages
- Console logging for debugging

## Design Patterns Used

### 1. **Module Pattern**
Each TypeScript file is a module with clear exports and imports.

### 2. **Strategy Pattern**
- Player types (human vs computer) use different strategies
- AIPlayer implements minimax strategy
- Extensible for new player types (e.g., different difficulty levels)

### 3. **Observer Pattern**
- UIController provides event handler registration
- Game subscribes to UI events
- Decouples UI from game logic

### 4. **Facade Pattern**
- Game class provides simple interface to complex subsystems
- Hides complexity of Board, WinChecker, Player, UI interactions

### 5. **Factory Pattern**
- Game.initialize() is a static factory method
- Creates and configures the entire game system

## Data Flow

### Move Processing Flow
```
1. User clicks cell
   ↓
2. UIController.onCellClick fires
   ↓
3. Game.handleCellClick validates
   ↓
4. Game.makeMove updates Board
   ↓
5. UIController.updateCell updates DOM
   ↓
6. WinChecker checks for win/draw
   ↓
7. If continues, Game.switchPlayer
   ↓
8. If computer turn, AIPlayer.getBestMove
   ↓
9. Repeat from step 4
```

### State Management
```
Game State:
- setup: Initial configuration
- playing: Active gameplay
- won: Game ended with winner
- draw: Game ended in draw

Board State:
- Array of 9 cells (null | 'X' | 'O')

Score State:
- player: number
- computer: number
- draws: number
```

## Error Handling

### Validation
- Board validates cell indices (0-8)
- Board prevents overwriting filled cells
- Game validates game state before moves
- UIController validates DOM element existence

### Error Recovery
- Try-catch blocks in move processing
- Error messages logged to console
- User-friendly error display on initialization failure

### Edge Cases Handled
- Double-clicking same cell
- Clicking after game ends
- Clicking during computer's turn
- Invalid cell indices
- Missing DOM elements

## Performance Considerations

### Optimizations
1. **Board Cloning**: Used only when needed (AI evaluation)
2. **Win Check**: Early return on first match
3. **Empty Cell Cache**: Computed once per check
4. **Strategic Openings**: Avoid minimax for first moves
5. **DOM Query Caching**: All elements queried once in constructor

### Time Complexity
- Board operations: O(1)
- Win check: O(1) - fixed 8 combinations
- Empty cells: O(9) = O(1) - fixed board size
- Minimax: O(9!) worst case, optimized with alpha-beta potential

### Space Complexity
- Board state: O(9) = O(1)
- Minimax recursion: O(9) depth = O(1)
- Total: O(1) - fixed game size

## Testing Strategy

### Unit Tests (Recommended)
- Board: setCell, getCell, isEmpty, isFull, reset
- WinChecker: checkWin for all combinations, checkDraw
- Player: constructor, isHuman, isComputer
- AIPlayer: getBestMove, findWinningMove

### Integration Tests (Recommended)
- Game flow: setup → play → end
- Computer move generation
- Score tracking across games
- UI updates on game events

### Edge Case Tests
- Full board without winner
- Immediate win in 1 move
- Block opponent's win
- Invalid moves

## Build Process

### TypeScript Compilation
```bash
node build.mjs
```

Custom transpiler removes TypeScript types and outputs ES modules.

### File Output
```
dist/
├── types.js
├── Board.js
├── WinChecker.js
├── Player.js
├── AIPlayer.js
├── UIController.js
├── Game.js
└── main.js
```

### Browser Loading
- HTML loads `dist/main.js` as ES module
- Browser natively handles module imports
- No bundler required

## Future Enhancements

### Potential Improvements
1. **Difficulty Levels**
   - Easy: Random moves
   - Medium: Mix of random and minimax
   - Hard: Full minimax (current)

2. **Multiplayer**
   - Local two-player mode
   - Online multiplayer with WebSockets

3. **Game History**
   - Undo/redo moves
   - Move history display
   - Game replay

4. **Advanced AI**
   - Alpha-beta pruning for performance
   - Opening book for instant moves
   - Endgame database

5. **Persistence**
   - Save scores to localStorage
   - Save game state
   - Statistics tracking

6. **Themes**
   - Multiple color schemes
   - Custom symbols
   - Sound effects

## Conclusion

This architecture provides:
- ✅ Clean separation of concerns
- ✅ SOLID principles adherence
- ✅ Extensibility for new features
- ✅ Maintainable and testable code
- ✅ Performance optimized
- ✅ Type-safe TypeScript
- ✅ Modern ES modules
- ✅ No external dependencies (runtime)

The modular design makes it easy to understand, modify, and extend the game while maintaining code quality and performance.
