# Tic-Tac-Toe Game

A modern, professional tic-tac-toe game built with TypeScript, featuring an unbeatable AI opponent, clean OOP architecture, and a beautiful responsive UI.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### Gameplay Features
- 🎮 **Play Against Computer** - Intelligent AI opponent using minimax algorithm
- ⚙️ **Customizable Setup** - Choose your symbol (X or O) and who goes first
- 📊 **Score Tracking** - Persistent scoreboard across multiple games
- 🎯 **Win Detection** - Automatic detection of all 8 winning combinations
- 🎨 **Smooth Animations** - Polished UI with CSS animations
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile

### Technical Features
- 💎 **TypeScript** - Strict mode with full type safety
- 🏗️ **Clean Architecture** - SOLID principles and design patterns
- 📦 **Zero Dependencies** - No frameworks, no build tools required
- ♿ **Accessible** - Semantic HTML and ARIA labels
- 🎨 **Modern CSS** - LESS preprocessor with modular structure
- 🧪 **Testable** - Clean separation of concerns

## 🚀 Quick Start

### Option 1: Direct File Opening
```bash
# Clone the repository
git clone <repository-url>
cd tic-tac-toe

# Open in browser
open index.html  # macOS
start index.html # Windows
```

### Option 2: Local Server (Recommended)
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Open browser to http://localhost:8000
```

That's it! No installation or build step needed.

## 🎮 How to Play

### 1. Game Setup
When you open the game, you'll see a setup modal:

1. **Choose Your Symbol**
   - Click **X** to play as X (traditionally goes first)
   - Click **O** to play as O (traditionally goes second)

2. **Choose Who Goes First**
   - Click **You** to make the first move
   - Click **Computer** to let the AI start

3. **Click "Start Game"** to begin

### 2. Playing the Game
- Click any empty cell on the 3×3 grid to place your symbol
- The computer will automatically respond
- Get three of your symbols in a row (horizontal, vertical, or diagonal) to win
- If all 9 cells are filled with no winner, the game is a draw

### 3. Game Controls
- **New Game** - Start another round with same settings
- **Reset Scores** - Clear all scores back to zero
- **New Setup** - Return to setup modal to change settings

### 4. Scoreboard
Located on the left side (top on mobile), showing:
- **Your Score** - Games you've won
- **Draw Score** - Games that ended in a tie
- **Computer Score** - Games the computer won

## 🏗️ Project Structure

```
tic-tac-toe/
├── index.html          # Main HTML file
├── src/                # TypeScript source files
│   ├── types.ts       # Type definitions
│   ├── Board.ts       # Board state management
│   ├── WinChecker.ts  # Win detection logic
│   ├── Player.ts      # Player class
│   ├── AIPlayer.ts    # AI with minimax algorithm
│   ├── UIController.ts# DOM manipulation
│   ├── Game.ts        # Main game controller
│   └── main.ts        # Application entry point
├── dist/               # Compiled JavaScript (ES modules)
├── styles/             # LESS stylesheets
│   ├── variables.less # Design tokens
│   ├── main.less      # Main stylesheet
│   └── main.css       # Compiled CSS
├── docs/               # Documentation
│   ├── USER_GUIDE.md
│   ├── DEVELOPER_GUIDE.md
│   ├── API_REFERENCE.md
│   ├── CUSTOMIZATION.md
│   └── ...
├── tsconfig.json       # TypeScript configuration
├── package.json        # Project configuration
└── README.md           # This file
```

## 🤖 AI Implementation

The computer opponent uses the **minimax algorithm** for perfect play:

- **Unbeatable** - The AI never loses when playing optimally
- **Strategic Openings** - Prefers center, then corners for first moves
- **Immediate Threats** - Detects and executes/blocks winning moves
- **Optimal Play** - Evaluates all possible game outcomes
- **Fast Performance** - Strategic openings avoid unnecessary computation

The minimax algorithm guarantees optimal play by:
1. Simulating all possible future game states
2. Scoring each outcome (+10 for AI win, -10 for loss, 0 for draw)
3. Choosing the move that maximizes AI's score while minimizing opponent's

## 🛠️ Technology Stack

### Core Technologies
- **TypeScript 5.3+** - Type-safe JavaScript with strict mode
- **ES2020 Modules** - Native browser modules, no bundler needed
- **LESS** - CSS preprocessor for modular styles
- **HTML5** - Semantic markup with accessibility

### No Framework Philosophy
This project intentionally uses **vanilla TypeScript** to demonstrate:
- Clean OOP architecture without framework overhead
- Native browser capabilities (ES modules, CSS Grid, modern JS)
- Fast loading with zero dependencies
- Educational value showing fundamentals

## 🎨 Architecture

### Design Patterns Used
- **Module Pattern** - ES modules for encapsulation
- **Strategy Pattern** - Different player types (human/AI)
- **Observer Pattern** - UI event handlers
- **Facade Pattern** - Game controller simplifies subsystems
- **Factory Pattern** - Static Game.initialize()

### SOLID Principles
- **Single Responsibility** - Each class has one clear purpose
- **Open/Closed** - Extensible through inheritance
- **Liskov Substitution** - AIPlayer substitutes Player
- **Interface Segregation** - Focused TypeScript interfaces
- **Dependency Inversion** - Depends on abstractions

### Class Structure
```
Game (Controller)
  ├── Board (State)
  ├── WinChecker (Logic)
  ├── Player (Model)
  ├── AIPlayer extends Player (Model + Strategy)
  └── UIController (View)
```

See [ARCHITECTURE.md](docs/CODE_ARCHITECTURE.md) for detailed design documentation.

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [User Guide](docs/USER_GUIDE.md) | How to play, controls, troubleshooting |
| [Developer Guide](docs/DEVELOPER_GUIDE.md) | Architecture, code structure, how to extend |
| [API Reference](docs/API_REFERENCE.md) | Complete class and method documentation |
| [Customization Guide](docs/CUSTOMIZATION.md) | How to customize themes, difficulty, features |
| [Design Documentation](docs/DESIGN.md) | UI design tokens and specifications |
| [Code Review](docs/CODE_REVIEW.md) | Quality review and recommendations |
| [Build Summary](docs/BUILD_SUMMARY.md) | Implementation details and statistics |

## 🔧 Development

### Building from Source
```bash
# Install dependencies (optional, for LESS compilation)
npm install

# Build TypeScript
node build.mjs

# Build CSS from LESS (if less is installed)
npm run build:css

# Build everything
npm run build
```

### Project Scripts
```json
{
  "build:ts": "node build.mjs",
  "build:css": "lessc styles/main.less styles/main.css",
  "build": "npm run build:ts && npm run build:css",
  "serve": "python3 -m http.server 8000"
}
```

### File Watching
For development with auto-rebuild:
```bash
# Terminal 1: Watch TypeScript
npm run watch:ts

# Terminal 2: Watch LESS
npm run watch:css

# Terminal 3: Serve
npm run serve
```

## 🎨 Customization

### Quick Theme Change
The game uses CSS custom properties (design tokens). To change colors, edit `styles/variables.less`:

```less
// Change player colors
@color-player-x: #f43f5e;  // Red-pink
@color-player-o: #3b82f6;  // Blue

// Change background
@color-bg-primary: #0f172a;  // Dark blue-gray
```

Then recompile:
```bash
npm run build:css
```

See [CUSTOMIZATION.md](docs/CUSTOMIZATION.md) for complete theming guide.

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome/Edge | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Mobile Chrome | Latest | ✅ Fully Supported |
| Mobile Safari | iOS 14+ | ✅ Fully Supported |

**Required Features:**
- ES2020 modules
- CSS Grid and Flexbox
- CSS Custom Properties
- Array methods (map, filter, every)

## ✅ Testing

### Manual Testing Checklist
- [ ] Game setup modal appears and functions
- [ ] Symbol selection works (X/O)
- [ ] First player selection works
- [ ] Player moves register correctly
- [ ] Computer makes valid moves
- [ ] All 8 win combinations detected
- [ ] Draw detection works
- [ ] Scores update correctly
- [ ] New Game resets board
- [ ] Reset Scores clears scores
- [ ] New Setup returns to modal
- [ ] Responsive on mobile
- [ ] Keyboard navigation works

### Automated Testing
See [TEST_REPORT.md](docs/TEST_REPORT.md) for test results and recommendations.

## 🤝 Contributing

Contributions welcome! Please follow these guidelines:

### Guidelines
1. **Keep it vanilla** - No frameworks or build dependencies
2. **Maintain architecture** - Follow SOLID principles
3. **Type safety** - Use TypeScript strict mode
4. **Document code** - Add JSDoc comments to public methods
5. **Test thoroughly** - Verify across browsers
6. **Accessibility** - Maintain ARIA labels and keyboard navigation

### Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes with tests
4. Ensure `npm run build` works
5. Submit a pull request with clear description

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Minimax Algorithm** - Classic game AI technique
- **SOLID Principles** - Clean code architecture
- **Modern TypeScript** - Type-safe development
- **Responsive Design** - Mobile-first approach

## 📧 Support

For issues or questions:
1. Check the [User Guide](docs/USER_GUIDE.md)
2. Review [Troubleshooting](docs/USER_GUIDE.md#troubleshooting)
3. Check browser console for errors
4. Open an issue with details

---

**Built with ❤️ using TypeScript, SOLID principles, and vanilla web technologies.**

**Version:** 1.0.0 | **Last Updated:** 2026-02-17
