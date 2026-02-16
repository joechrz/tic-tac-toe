# User Guide

A complete guide to playing and navigating the Tic Tac Toe game.

## Table of Contents

- [Getting Started](#getting-started)
- [Mode Selection](#mode-selection)
- [Game Rules](#game-rules)
- [Playing vs Human](#playing-vs-human)
- [Playing vs Computer](#playing-vs-computer)
- [AI Difficulty Levels](#ai-difficulty-levels)
- [Interface Overview](#interface-overview)
- [Scoreboard](#scoreboard)
- [Keyboard Navigation](#keyboard-navigation)
- [Screen Reader Support](#screen-reader-support)
- [Responsive Layout](#responsive-layout)
- [Troubleshooting](#troubleshooting)

## Getting Started

1. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, or Edge).
2. No installation or internet connection is required.
3. The game loads with a **mode selection overlay** where you choose how to play.

### Optional: Local Server

If you prefer to serve the file over HTTP:

```bash
cd game
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Mode Selection

When the game loads, a mode selection overlay appears. This overlay also appears each time you click **New Game**.

### Game Mode

Choose between two modes:

- **vs Human** - Two players take turns on the same device.
- **vs Computer** - Play against the AI opponent.

### AI Settings (vs Computer only)

When you select **vs Computer**, two additional options appear:

- **Play as** - Choose your symbol:
  - **X (First)** - You go first.
  - **O (Second)** - The computer goes first.
- **Difficulty** - Choose the AI strength:
  - **Easy** - The computer makes random moves.
  - **Medium** - The computer plays well most of the time but occasionally makes mistakes.
  - **Hard** - The computer plays optimally and cannot be beaten (best you can achieve is a draw).

Click **Start Game** to begin with your chosen settings.

## Game Rules

Tic Tac Toe is a strategy game played on a 3x3 grid.

1. **Player X** always goes first.
2. Players alternate turns, placing their mark (X or O) in an empty cell.
3. The goal is to get **three of your marks in a row** - horizontally, vertically, or diagonally.
4. If all nine cells are filled without a winner, the game ends in a **draw**.

### Winning Combinations

There are 8 possible winning lines:

```
Rows:               Columns:            Diagonals:
X X X   . . .      X . .   . X .      X . .   . . X
. . .   X X X      X . .   . X .      . X .   . X .
. . .   . . .      X . .   . X .      . . X   X . .

. . .              . . X
. . .              . . X
X X X              . . X
```

## Playing vs Human

1. Select **vs Human** in the mode selector and click **Start Game**.
2. **Player X** goes first. Click any empty cell to place your mark.
3. **Player O** takes the next turn.
4. The scoreboard labels show "Player X" and "Player O".
5. Continue until someone wins or the board is full (draw).
6. Click **Play Again** to start a new round with the same mode, or **New Game** to return to mode selection.

## Playing vs Computer

1. Select **vs Computer** in the mode selector.
2. Choose your symbol (X or O) and difficulty level.
3. Click **Start Game**.
4. The scoreboard labels change to "You" and "Computer".
5. Make your move by clicking an empty cell.
6. The status bar shows **"Computer thinking..."** while the AI calculates its move.
7. The board is temporarily disabled during the computer's turn (cells appear dimmed).
8. After a brief delay, the computer places its mark and play returns to you.
9. If you chose to play as O, the computer makes the first move automatically.

## AI Difficulty Levels

| Level  | Strategy | Can You Win? |
|--------|----------|--------------|
| **Easy** | Picks a random empty cell every turn. No strategy at all. | Yes, easily. |
| **Medium** | Uses the optimal algorithm 60% of the time and picks randomly 40% of the time. Makes occasional mistakes. | Yes, with some skill. |
| **Hard** | Always plays the mathematically optimal move using the minimax algorithm. Never makes a mistake. | No. The best possible result is a draw. |

### Tips for Playing Against Hard AI

- If you go first (X), take the center cell. This gives you the best chance of forcing a draw.
- Never leave two of the AI's marks in a row without blocking.
- The AI will always block your winning moves and take its own when available.
- On Hard difficulty, a draw is a good result!

## Interface Overview

### Mode Selection Overlay
Appears on game load and when clicking **New Game**. Lets you choose game mode, symbol, and difficulty.

### Header
Displays the game title with an animated gradient effect.

### Status Bar
Displays whose turn it is, or the game result. Text color matches the current player:
- **Coral/red** text = X's turn (or "Your turn" / "Computer thinking...")
- **Blue** text = O's turn
- **Green** pulsing text = Win announcement
- **Gold** text = Draw announcement

### Scoreboard
Displayed to the left of the board on desktop, above the board on mobile. Shows scores for X, draws, and O. In AI mode, labels change to "You" and "Computer". The active player's section is highlighted with a side accent.

### Game Board
A 3x3 grid of clickable cells. Hovering over an empty cell shows a faint preview of the current player's mark. During the AI's turn, empty cells are dimmed and unclickable.

### Control Buttons
- **New Game** - Returns to the mode selection overlay.
- **Reset Scores** - Zeros out all scores (X wins, O wins, and draws).

### Game Over Overlay
Appears after a win or draw with the result and a **Play Again** button. In AI mode, the result shows "You Wins!" or "Computer Wins!" accordingly.

## Scoreboard

The scoreboard persists across rounds within a single browser session:

| Section      | Color      | Tracks                    |
|-------------|------------|---------------------------|
| X (or You)  | Coral/Red  | X's total wins            |
| Draws       | Gold       | Total draws               |
| O (or Computer) | Blue  | O's total wins            |

Labels automatically update based on game mode:
- **vs Human**: "Player X" / "Player O"
- **vs Computer**: "You" / "Computer" (positioned based on your chosen symbol)

Scores reset when:
- You click **Reset Scores**
- You refresh or close the browser tab

## Keyboard Navigation

All game elements are keyboard-accessible:

| Key         | Action                                         |
|-------------|-------------------------------------------------|
| `Tab`       | Move focus between cells, buttons, and mode options |
| `Enter`     | Place mark / click button / select mode option  |
| `Space`     | Place mark / click button / select mode option  |

Focus indicators appear as blue outlines on the currently focused element. The mode selection overlay and game-over overlay trap focus appropriately.

## Screen Reader Support

The game includes accessibility features for screen readers:

- Each cell announces its position and state (e.g., "Row 1, Column 2 - empty" or "Row 1, Column 2 - X").
- The status bar uses `aria-live="polite"` so turn changes, AI thinking status, and results are announced automatically.
- Mode selection options use `aria-pressed` to indicate the selected state.
- Both the mode selection overlay and game-over overlay use `role="dialog"` with `aria-modal="true"`.
- Decorative elements (symbols in the scoreboard, confetti) are hidden from screen readers with `aria-hidden`.

## Responsive Layout

The game adapts to different screen sizes:

| Device              | Behavior                                               |
|---------------------|--------------------------------------------------------|
| Desktop (600px+)    | Scoreboard left of board, side-by-side layout          |
| Mobile (< 600px)    | Scoreboard above board, stacked layout                 |
| Small phones (< 360px) | Compact scoreboard, stacked control buttons         |
| Landscape phone     | Reduced vertical spacing, smaller board                |

### Reduced Motion

If your operating system is set to reduce motion (e.g., macOS "Reduce motion" setting), all animations are effectively disabled for a static experience.

## Troubleshooting

### Game doesn't load
- Ensure you're opening `index.html` directly or via a local server.
- Check that JavaScript is enabled in your browser.
- Use a modern browser (Chrome 88+, Firefox 78+, Safari 14+, Edge 88+).

### Mode selection overlay won't dismiss
- You must click the **Start Game** button. Clicking outside the overlay does not close it.

### Cells don't respond to clicks
- The game may be over. Look for the game-over overlay or check the status bar.
- In AI mode, cells are disabled while the computer is thinking. Wait for the AI to finish.
- If the mode selection overlay is showing, select a mode and click Start Game first.
- Click **New Game** or **Play Again** to start a new round.

### Computer doesn't move
- The AI has a short artificial delay (400-800ms) to feel natural. Wait a moment.
- If the AI still doesn't move, try clicking **New Game** to reset.

### Animations are choppy
- Close other resource-intensive tabs or applications.
- If you prefer no animations, enable "Reduce motion" in your OS accessibility settings.

### Scores disappeared
- Scores are stored in memory only and reset on page refresh.
- This is expected behavior in the current version.

### Layout looks broken
- Ensure your browser zoom is at 100%.
- Try a different browser to rule out compatibility issues.
- Check that your browser meets the minimum version requirements.
