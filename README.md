# Tic Tac Toe

A modern, polished tic-tac-toe game built with vanilla HTML, CSS, and JavaScript. Play against a friend or challenge the computer with three difficulty levels. Features a dark-themed UI with neon accents, smooth animations, score tracking, and full keyboard/screen reader accessibility.

## Features

- **Two game modes** - Play vs. a friend (local) or vs. the computer (AI)
- **AI opponent** - Minimax algorithm with alpha-beta pruning at three difficulty levels (Easy, Medium, Hard)
- **Mode selection overlay** - Choose game mode, pick your symbol, and set AI difficulty before each game
- **Live scoreboard** - Tracks wins for X, O, and draws across rounds
- **Win detection** - Highlights winning cells with animated glow effect
- **Confetti celebration** - Particle animation on win
- **Game-over overlay** - Modal dialog with result and quick rematch
- **Responsive design** - Side-by-side layout on desktop, stacked on mobile
- **Accessibility** - ARIA labels, `aria-live` announcements, keyboard navigation, reduced-motion support
- **Dark theme** - Neon coral (X) and electric blue (O) on dark backgrounds
- **No dependencies** - Pure HTML, CSS, and JavaScript; no build tools required

## Quick Start

1. Clone or download this repository.
2. Open `game/index.html` in any modern browser.
3. Select a game mode from the mode selection overlay and click **Start Game**.

That's it. No install, no build step, no server required.

```bash
# Or serve locally (optional)
cd game
python3 -m http.server 8000
# Open http://localhost:8000
```

## How to Play

### Mode Selection

When the game loads (or when you click **New Game**), a mode selection overlay appears:

1. **Game Mode** - Choose **vs Human** for two-player local or **vs Computer** to play against the AI.
2. **Play as** (AI mode only) - Choose **X (First)** to go first or **O (Second)** to let the computer go first.
3. **Difficulty** (AI mode only) - Choose **Easy**, **Medium**, or **Hard**.
4. Click **Start Game** to begin.

### Gameplay

1. **Player X** goes first. Click any empty cell to place your mark.
2. In human mode, **Player O** takes the next turn. In AI mode, the computer moves automatically.
3. The first player to get **three in a row** (horizontal, vertical, or diagonal) wins.
4. If all nine cells are filled with no winner, the game is a **draw**.
5. Click **New Game** to return to mode selection, or **Play Again** to rematch with the same settings.
6. Click **Reset Scores** to zero out the scoreboard.

### AI Difficulty Levels

| Level  | Behavior |
|--------|----------|
| Easy   | Random moves only |
| Medium | 60% optimal moves, 40% random |
| Hard   | Always plays the optimal move (unbeatable) |

## Project Structure

```
tic-tac-toe/
  game/
    index.html      # HTML structure and embedded CSS
    app.js          # Game logic (OOP/MVC architecture, 7 classes)
    docs/
      DESIGN.md         # UI design documentation
      CODE_REVIEW.md    # Code review report
      USER_GUIDE.md     # End-user instructions
      DEVELOPER_GUIDE.md# Developer documentation
      ARCHITECTURE.md   # System architecture
      API_REFERENCE.md  # Code API reference
      CUSTOMIZATION.md  # Theming and extension guide
  README.md           # This file
```

## Browser Compatibility

| Browser            | Version | Status      |
|--------------------|---------|-------------|
| Chrome / Edge      | 88+     | Supported   |
| Firefox            | 78+     | Supported   |
| Safari             | 14+     | Supported   |
| Mobile Chrome      | 88+     | Supported   |
| Mobile Safari      | 14+     | Supported   |

Requires support for CSS custom properties, CSS Grid, `aspect-ratio`, `backdrop-filter`, and ES6 classes.

## Customization

The game uses CSS custom properties (design tokens) for all visual styling. You can restyle the entire game by editing the `:root` block in `index.html`. See [CUSTOMIZATION.md](game/docs/CUSTOMIZATION.md) for a full guide.

Quick example - change Player X's color to purple:

```css
:root {
  --color-accent-x: #a78bfa;
  --color-accent-x-glow: rgba(167, 139, 250, 0.4);
}
```

## Documentation

| Document | Description |
|----------|-------------|
| [User Guide](game/docs/USER_GUIDE.md) | Gameplay instructions, AI modes, and troubleshooting |
| [Developer Guide](game/docs/DEVELOPER_GUIDE.md) | Architecture, code structure, AI implementation, and extension guide |
| [Architecture](game/docs/ARCHITECTURE.md) | System design with component diagrams |
| [API Reference](game/docs/API_REFERENCE.md) | Complete class and method documentation |
| [Customization](game/docs/CUSTOMIZATION.md) | Theming, styling, and extending the game |
| [Design](game/docs/DESIGN.md) | UI design tokens and layout specifications |
| [Code Review](game/docs/CODE_REVIEW.md) | Code quality review and recommendations |

## Contributing

1. Fork this repository.
2. Create a feature branch: `git checkout -b feature/my-change`
3. Make your changes and test across browsers.
4. Ensure accessibility is maintained (ARIA attributes, keyboard navigation).
5. Submit a pull request with a clear description of the change.

### Guidelines

- Keep the zero-dependency philosophy. No frameworks or build tools.
- Follow the existing OOP/MVC architecture.
- Use CSS custom properties for any new visual tokens.
- Maintain accessibility compliance.
- Add JSDoc comments to any new public methods.

## License

This project is provided as-is for educational and personal use.
