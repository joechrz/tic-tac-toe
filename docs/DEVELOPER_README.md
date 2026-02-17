# Developer README - Tic-Tac-Toe Game

## Quick Start

### Running the Game

**Option 1: Simple HTTP Server (Recommended)**
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Using PHP
php -S localhost:8000

# Then open: http://localhost:8000
```

**Option 2: Direct File Opening**
```bash
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```
⚠️ Note: May have CORS issues with ES modules in some browsers.

### Building from Source

```bash
# Build TypeScript to JavaScript
node build.mjs

# Build CSS from LESS (if less is installed)
npm run build:css

# Build everything
npm run build
```

## Project Structure

```
tic-tac-toe/
├── index.html              # Main HTML file
├── src/                    # TypeScript source files
│   ├── types.ts           # Type definitions
│   ├── Board.ts           # Board state management
│   ├── WinChecker.ts      # Win detection logic
│   ├── Player.ts          # Base player class
│   ├── AIPlayer.ts        # AI with minimax
│   ├── UIController.ts    # DOM manipulation
│   ├── Game.ts            # Main controller
│   └── main.ts            # Entry point
├── dist/                   # Compiled JavaScript (ES modules)
├── styles/                 # LESS source files
│   ├── variables.less     # Design tokens
│   ├── reset.less         # CSS reset
│   ├── layout.less        # Layout system
│   ├── scoreboard.less    # Scoreboard styles
│   ├── board.less         # Board styles
│   ├── setup.less         # Modal styles
│   ├── animations.less    # Animations
│   ├── responsive.less    # Media queries
│   ├── main.less          # Entry point
│   └── main.css           # Compiled CSS
├── docs/                   # Documentation
│   ├── DESIGN.md          # Design documentation
│   ├── CODE_ARCHITECTURE.md # Architecture docs
│   └── BUILD_SUMMARY.md   # Build summary
├── tsconfig.json          # TypeScript configuration
├── package.json           # Project configuration
└── build.mjs              # Build script
```

## Technology Stack

- **TypeScript** - Type-safe JavaScript
- **ES Modules** - Native browser modules
- **LESS** - CSS preprocessor
- **Vanilla JS** - No frameworks
- **HTML5** - Semantic markup

## Architecture Overview

### Layer Architecture
```
┌─────────────────────────┐
│    Presentation (UI)    │  UIController.ts
├─────────────────────────┤
│   Business Logic        │  Game.ts, WinChecker.ts, AIPlayer.ts
├─────────────────────────┤
│    Data Layer           │  Board.ts, Player.ts
└─────────────────────────┘
```

### Class Relationships
```
Game (Controller)
  ├── uses Board (State)
  ├── uses WinChecker (Logic)
  ├── uses UIController (View)
  ├── uses Player (Model)
  └── uses AIPlayer (Model + Strategy)
```

## Key Classes

### Board
Manages the 3×3 game board state.
```typescript
board.setCell(index, symbol)   // Place move
board.getCell(index)           // Get cell value
board.isEmpty(index)           // Check if empty
board.getEmptyCells()          // Get available moves
board.isFull()                 // Check if full
board.reset()                  // Clear board
```

### WinChecker
Detects wins and draws.
```typescript
winChecker.checkWin(board)     // Returns WinResult | null
winChecker.checkDraw(board)    // Returns boolean
winChecker.isGameOver(board)   // Returns boolean
```

### AIPlayer
Intelligent computer opponent using minimax algorithm.
```typescript
aiPlayer.getBestMove(board, opponentSymbol)  // Returns optimal move index
```

**AI Strategy:**
1. Check for immediate win → take it
2. Check for opponent's win → block it
3. Use minimax for optimal play
4. Prefer center, then corners for opening moves

### UIController
Handles all DOM manipulation.
```typescript
ui.updateCell(index, symbol)           // Update cell display
ui.updateTurnIndicator(message, type)  // Update turn text
ui.updateGameStatus(message, type)     // Update status
ui.updateScores(scores)                // Update scoreboard
ui.highlightWinningCells(combination)  // Highlight winners
```

### Game
Main controller that orchestrates everything.
```typescript
Game.initialize()              // Static factory to start game
game.startNewGame()           // Start new round
game.makeMove(index)          // Process player move
game.handleCellClick(index)   // Handle cell clicks
```

## Game Flow

### 1. Initialization
```
index.html loads
  → dist/main.js (ES module)
    → Game.initialize()
      → new Game()
        → Show setup modal
```

### 2. Setup Phase
```
User selects:
  → Symbol (X or O)
  → Who goes first
  → Click "Start Game"
    → startNewGame()
      → Initialize players
      → Reset board
      → Set first player
      → If computer first, make move
```

### 3. Playing Phase
```
Player clicks cell
  → handleCellClick(index)
    → makeMove(index)
      → board.setCell()
      → ui.updateCell()
      → checkGameEnd()
        → if win: handleWin()
        → if draw: handleDraw()
        → else: switchPlayer()
      → if computer's turn:
        → makeComputerMove()
          → aiPlayer.getBestMove()
          → makeMove(bestMove)
```

### 4. Game End
```
Win/Draw detected
  → Update scores
  → Highlight winning cells
  → Disable board
  → Show game over message
  → Wait for:
    → "New Game" → startNewGame()
    → "New Setup" → showSetupModal()
    → "Reset Scores" → reset scores
```

## State Management

### Game State
```typescript
type GameState = 'setup' | 'playing' | 'won' | 'draw'
```

### Board State
```typescript
// Array of 9 cells
type CellValue = 'X' | 'O' | null
cells: CellValue[]  // [null, 'X', null, 'O', ...]
```

### Score State
```typescript
interface Scores {
    player: number
    computer: number
    draws: number
}
```

## Minimax Algorithm

```typescript
function minimax(board, depth, isMaximizing) {
    // Base case: game over
    if (gameWon) return score(winner, depth)
    if (gameDraw) return 0

    if (isMaximizing) {
        // AI's turn: maximize score
        maxScore = -Infinity
        for each empty cell:
            place AI symbol
            score = minimax(board, depth+1, false)
            maxScore = max(maxScore, score)
        return maxScore
    } else {
        // Opponent's turn: minimize score
        minScore = +Infinity
        for each empty cell:
            place opponent symbol
            score = minimax(board, depth+1, true)
            minScore = min(minScore, score)
        return minScore
    }
}
```

**Scoring:**
- AI wins: +10 - depth (prefer faster wins)
- Opponent wins: depth - 10 (delay losses)
- Draw: 0

## Customization Guide

### Change AI Difficulty

**Easy:** Random moves
```typescript
// In AIPlayer.getBestMove()
const emptyCells = board.getEmptyCells();
return emptyCells[Math.floor(Math.random() * emptyCells.length)];
```

**Medium:** Mix random and minimax (50/50)
```typescript
if (Math.random() < 0.5) {
    return this.getRandomMove(board);
} else {
    return this.getBestMove(board, opponentSymbol);
}
```

**Hard (Current):** Full minimax

### Add New Player Type

```typescript
export class NetworkPlayer extends Player {
    constructor(symbol: CellValue, socketConnection) {
        super(symbol, 'network');
        this.socket = socketConnection;
    }

    async getMove(): Promise<number> {
        return await this.socket.waitForMove();
    }
}
```

### Add Sound Effects

```typescript
// In UIController
private sounds = {
    move: new Audio('sounds/move.mp3'),
    win: new Audio('sounds/win.mp3'),
    draw: new Audio('sounds/draw.mp3')
};

public playSound(type: 'move' | 'win' | 'draw') {
    this.sounds[type].play();
}

// In Game.makeMove()
this.ui.playSound('move');
```

### Add localStorage Persistence

```typescript
// In Game class
private saveScores(): void {
    localStorage.setItem('ttt-scores', JSON.stringify(this.scores));
}

private loadScores(): void {
    const saved = localStorage.getItem('ttt-scores');
    if (saved) {
        this.scores = JSON.parse(saved);
    }
}

// Call in constructor and after score updates
```

## Debugging

### Enable Debug Logging

```typescript
// Add to Game class
private debug = true;

private log(message: string, ...args: any[]): void {
    if (this.debug) {
        console.log(`[Game] ${message}`, ...args);
    }
}

// Use throughout:
this.log('Making move', index);
this.log('Board state', this.board.getState());
```

### Common Issues

**Issue:** Game doesn't start
- Check browser console for errors
- Verify index.html loads dist/main.js
- Ensure HTTP server is running (not file://)

**Issue:** Computer doesn't move
- Check makeComputerMove() is called
- Verify AIPlayer.getBestMove() returns valid index
- Check browser console for errors

**Issue:** Cells don't update
- Verify DOM elements exist (check UIController constructor)
- Check CSS classes are applied correctly
- Inspect cells in browser DevTools

**Issue:** Win not detected
- Verify WinChecker.WIN_COMBINATIONS
- Check board state after moves
- Test manually with all 8 win patterns

## Testing

### Manual Testing
```
1. Open in browser
2. Test each scenario:
   - Player X going first
   - Player O going first
   - Computer going first
   - Each win combination (8 total)
   - Draw scenario
   - Reset game
   - Reset scores
   - New setup
```

### Unit Testing (Recommended)
```typescript
// Example with Jest or similar
describe('Board', () => {
    it('should set cell value', () => {
        const board = new Board();
        board.setCell(0, 'X');
        expect(board.getCell(0)).toBe('X');
    });

    it('should throw on invalid index', () => {
        const board = new Board();
        expect(() => board.setCell(9, 'X')).toThrow();
    });
});
```

## Performance

### Benchmarks
- Empty board first move: < 5ms
- Mid-game move (minimax): < 50ms
- UI update: < 10ms
- Full game (9 moves): < 500ms

### Optimization Tips
1. DOM element caching (already done)
2. Minimax alpha-beta pruning (future)
3. Opening book for instant moves (future)
4. Memoization of board states (future)

## Browser Compatibility

- **Chrome/Edge:** 90+
- **Firefox:** 88+
- **Safari:** 14+
- **Mobile Safari:** iOS 14+
- **Chrome Android:** Latest

**Required Features:**
- ES2020 modules
- CSS Grid
- CSS Custom Properties (via LESS)
- Array methods (map, filter, every)

## Deployment

### GitHub Pages
```bash
# Build first
npm run build

# Commit dist/ directory
git add dist/ styles/main.css
git commit -m "Build for production"
git push

# Enable GitHub Pages in repository settings
# Source: main branch, / (root)
```

### Static Hosting
Upload these files:
- index.html
- dist/ (entire directory)
- styles/main.css

No server-side processing needed!

## Contributing

### Code Style
- Use TypeScript strict mode
- Follow SOLID principles
- Add JSDoc comments
- Write descriptive variable names
- Keep functions small (<50 lines)
- One class per file

### Adding Features
1. Create new class if needed
2. Update types.ts for new types
3. Integrate with Game controller
4. Update UIController for UI changes
5. Document in JSDoc and markdown
6. Test thoroughly

## License

MIT License - Feel free to use, modify, and distribute!

## Support

For issues or questions:
1. Check browser console for errors
2. Review CODE_ARCHITECTURE.md
3. Check DESIGN.md for UI issues
4. Review this document for common issues

## Credits

- **Architecture:** Clean OOP with SOLID principles
- **AI Algorithm:** Minimax with strategic openings
- **UI Design:** Modern, responsive, accessible
- **Build System:** Custom TypeScript transpiler

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Minimax Algorithm](https://en.wikipedia.org/wiki/Minimax)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

Happy coding! 🎮
