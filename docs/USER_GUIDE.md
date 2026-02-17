# Tic-Tac-Toe User Guide

Complete guide to playing and enjoying the Tic-Tac-Toe game.

## Table of Contents

- [Getting Started](#getting-started)
- [Game Setup](#game-setup)
- [How to Play](#how-to-play)
- [Game Controls](#game-controls)
- [Understanding the Interface](#understanding-the-interface)
- [Tips and Strategies](#tips-and-strategies)
- [Browser Compatibility](#browser-compatibility)
- [Troubleshooting](#troubleshooting)
- [Frequently Asked Questions](#frequently-asked-questions)

---

## Getting Started

### System Requirements
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+)
- JavaScript enabled
- No installation required
- Works offline after first load

### Opening the Game

**Method 1: Direct File Opening**
1. Download or clone the game files
2. Double-click `index.html` to open in your default browser
3. That's it!

**Method 2: Local Server** (Recommended for best performance)
```bash
# Navigate to game directory
cd tic-tac-toe

# Start a local server (choose one):
python3 -m http.server 8000        # Python 3
python -m SimpleHTTPServer 8000    # Python 2
npx http-server -p 8000            # Node.js

# Open browser to http://localhost:8000
```

---

## Game Setup

When you first open the game (or click "New Setup"), you'll see a configuration modal.

### Step 1: Choose Your Symbol

**Option X** - Traditionally the first player
- Click the **X** button to play as X
- You'll see a checkmark appear when selected

**Option O** - Traditionally the second player
- Click the **O** button to play as O
- You'll see a checkmark appear when selected

💡 **Tip:** In classic tic-tac-toe, X always goes first, but you can change that in Step 2!

### Step 2: Choose Who Goes First

**You Go First**
- Click **You** to make the opening move
- Recommended for beginners to get familiar with the game

**Computer Goes First**
- Click **Computer** to let the AI start
- More challenging as the AI will take the strategic center or corner

💡 **Tip:** The computer is unbeatable, so letting it go first makes the game harder!

### Step 3: Start the Game

Click the **Start Game** button to begin playing with your chosen settings.

---

## How to Play

### Basic Rules

**Objective:** Get three of your symbols in a row (horizontal, vertical, or diagonal) before your opponent does.

**Winning Combinations (8 total):**
```
Horizontal:  Vertical:   Diagonal:
X X X        X _ _       X _ _
_ _ _        X _ _       _ X _
_ _ _        X _ _       _ _ X

_ _ _        _ X _       _ _ X
X X X        _ X _       _ X _
_ _ _        _ X _       X _ _

_ _ _        _ _ X
_ _ _        _ _ X
X X X        _ _ X
```

### Making Your Move

1. **Wait for Your Turn**
   - The turn indicator shows "Your turn" when it's your move
   - Shows "Computer is thinking..." when the AI is deciding

2. **Click a Cell**
   - Click any empty cell in the 3×3 grid
   - Your symbol (X or O) will appear with a smooth animation
   - You cannot click already-filled cells

3. **Computer Responds**
   - The computer automatically makes its move (600ms delay)
   - Watch as the computer's symbol appears

4. **Continue Until Game Ends**
   - Keep alternating turns until someone wins or the board fills up

### Game End Conditions

**You Win! 🎉**
- Three of your symbols in a row
- Winning cells are highlighted
- Your score increases by 1
- Game status shows "You win! 🎉"

**Computer Wins**
- Three computer symbols in a row
- Winning cells are highlighted
- Computer score increases by 1
- Game status shows "Computer wins!"

**Draw**
- All 9 cells filled with no winner
- Draw score increases by 1
- Game status shows "It's a draw!"

---

## Game Controls

### During Gameplay

**New Game Button**
- Starts a fresh game with the same settings
- Board is cleared, but scores remain
- Same symbol and first player choices

**Reset Scores Button**
- Clears all scores back to zero (0-0-0)
- Does not reset the current game
- Useful for starting a new match series

**New Setup Button**
- Returns to the setup modal
- Allows you to change your symbol or first player
- Scores are maintained

### Keyboard Controls

While keyboard navigation is available for setup buttons, the game is primarily mouse/touch-based for cell selection. Use:

- **Tab** - Navigate between buttons
- **Enter/Space** - Activate buttons
- **Mouse Click** - Select cells (primary method)

---

## Understanding the Interface

### Layout Overview

```
┌─────────────────────────────────────────┐
│         Setup Modal (Initial)           │
│    Symbol Choice | First Player         │
│         [Start Game Button]             │
└─────────────────────────────────────────┘

Desktop Layout:
┌──────────────┬──────────────────────────┐
│  Scoreboard  │    Game Header           │
│  (Left)      │    ┌───────────┐         │
│              │    │ Tic-Tac-  │         │
│   You: 0     │    │   Toe     │         │
│   Draw: 0    │    └───────────┘         │
│   Computer:0 │                          │
│              │    Your turn             │
│  [Reset]     │                          │
│  [New Setup] │    ┌───┬───┬───┐        │
│              │    │   │   │   │        │
│              │    ├───┼───┼───┤        │
│              │    │   │   │   │        │
│              │    ├───┼───┼───┤        │
│              │    │   │   │   │        │
│              │    └───┴───┴───┘        │
│              │                          │
│              │    [New Game]            │
└──────────────┴──────────────────────────┘

Mobile Layout:
┌─────────────────────────────────┐
│     Scoreboard (Top, Horizontal)│
│   You: 0  |  Draw: 0  |  Comp: 0│
├─────────────────────────────────┤
│        Tic-Tac-Toe              │
│        Your turn                │
│                                 │
│      ┌───┬───┬───┐             │
│      │   │   │   │             │
│      ├───┼───┼───┤             │
│      │   │   │   │             │
│      ├───┼───┼───┤             │
│      │   │   │   │             │
│      └───┴───┴───┘             │
│                                 │
│      [New Game]                 │
└─────────────────────────────────┘
```

### Scoreboard (Left Side / Top on Mobile)

**Your Score**
- Shows wins where your symbol won
- Displays your chosen symbol (X or O)
- Labeled "You"

**Draw Score**
- Shows total number of draws
- Represented with a "−" symbol

**Computer Score**
- Shows wins where the computer won
- Displays the computer's symbol
- Labeled "Computer"

**Buttons**
- **Reset Scores** - Clears all scores
- **New Setup** - Returns to configuration

### Game Area

**Game Title**
- "Tic-Tac-Toe" with gradient effect
- Always visible at top

**Turn Indicator**
- Shows whose turn it is
- "Your turn" (your color)
- "Computer is thinking..." (computer's color)
- "Game Over" (when complete)

**Game Board**
- 3×3 grid of cells
- Empty cells are clickable
- Filled cells show X or O with color
- Winning cells are highlighted with pulsing border

**Game Status**
- Empty during play
- Shows result: "You win! 🎉", "Computer wins!", or "It's a draw!"
- Color-coded (green for win, amber for draw)

---

## Tips and Strategies

### For Beginners

**1. Control the Center**
- The center cell (middle) is the most powerful position
- It's part of 4 different winning combinations
- Try to take it early if possible

**2. Watch for Forks**
- A "fork" is when you create two ways to win
- This forces your opponent to block one, letting you win with the other
- Example: X in corners 0 and 2, then taking center creates a fork

**3. Block Immediately**
- If the computer has two in a row, block the third cell immediately
- Don't get distracted by your own plans

**4. Corners Are Strong**
- Corner cells (0, 2, 6, 8) are the second-best positions
- They're part of 3 winning combinations each

### Understanding the AI

**The Computer Is Unbeatable**
- It uses the minimax algorithm to play perfectly
- Against perfect play, the best you can do is draw
- Don't get discouraged - even experienced players can't beat it!

**AI Strategy**
1. **Opening Move:** Takes center if available, otherwise a corner
2. **Immediate Win:** Takes any move that wins the game
3. **Block:** Blocks any move where you would win
4. **Optimal:** Calculates all possible outcomes and chooses best

**How to Get a Draw**
- Play defensively and block every threat
- Don't make mistakes that create easy wins for the AI
- With perfect play from both sides, every game should be a draw

### Advanced Strategies

**Opening Principles**
- If you go first: Take the center
- If computer goes first and takes center: Take a corner
- If computer goes first and takes corner: Take the center

**Avoiding Losses**
- Never let the computer create a fork (two ways to win)
- After computer's first move in a corner, don't take the opposite corner
- Always block immediately when computer has two in a row

---

## Browser Compatibility

### Fully Supported Browsers

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Google Chrome | 90+ | Full support, recommended |
| Microsoft Edge | 90+ | Full support, recommended |
| Mozilla Firefox | 88+ | Full support |
| Safari (macOS) | 14+ | Full support |
| Safari (iOS) | 14+ | Full support, touch optimized |
| Chrome (Android) | 90+ | Full support, touch optimized |

### Required Features
- ES2020 JavaScript modules
- CSS Grid and Flexbox
- CSS Custom Properties (variables)
- Modern Array methods

### Not Supported
- Internet Explorer (any version)
- Legacy browsers without ES6+ support

---

## Troubleshooting

### Game Won't Load

**Problem:** Blank screen or "Loading..." message
**Solutions:**
1. Ensure JavaScript is enabled in your browser
2. Check browser console for errors (F12 → Console tab)
3. Try opening in a different browser
4. Clear browser cache and reload
5. Use a local server instead of opening file directly

**Problem:** "Failed to initialize game" error
**Solutions:**
1. Check that all files are present (dist/, styles/main.css)
2. Verify index.html references correct JavaScript file
3. Look for specific error in browser console
4. Try refreshing the page

### Game Behavior Issues

**Problem:** Clicks not registering
**Solutions:**
1. Ensure it's your turn (check turn indicator)
2. Don't click already-filled cells
3. Wait for computer to finish its move
4. Try clicking center of cell, not edges

**Problem:** Computer not moving
**Solutions:**
1. Wait 600ms - there's intentional delay for UX
2. Check browser console for JavaScript errors
3. Refresh page if computer seems frozen

**Problem:** Scores not updating
**Solutions:**
1. Check that game actually ended (win or draw)
2. Verify scoreboard is visible (not hidden offscreen)
3. Try "Reset Scores" then play a new game

### Display Issues

**Problem:** Layout looks broken on mobile
**Solutions:**
1. Rotate device to check if it's orientation-specific
2. Zoom out if zoomed in too far
3. Try refreshing page
4. Clear browser cache

**Problem:** Colors look wrong
**Solutions:**
1. Check browser color settings / dark mode
2. Ensure CSS file loaded (check Network tab in DevTools)
3. Try different browser

**Problem:** Animations not working
**Solutions:**
1. Check if "Reduce motion" is enabled in OS accessibility settings
2. Game respects `prefers-reduced-motion` preference
3. This is intentional for accessibility

### Mobile-Specific Issues

**Problem:** Can't tap cells reliably
**Solutions:**
1. Tap center of cells, not edges
2. Disable zoom if enabled
3. Use single tap, not double-tap
4. Check if screen protector is interfering

**Problem:** Scoreboard not visible
**Solutions:**
1. Scroll up - on mobile, scoreboard is at top
2. Rotate to landscape for side-by-side view
3. Zoom out if zoomed in

---

## Frequently Asked Questions

### General Questions

**Q: Do I need an internet connection?**
A: No, once loaded, the game works completely offline.

**Q: Do I need to install anything?**
A: No, it runs directly in your web browser.

**Q: Can I play against another person?**
A: Currently, no. The game only supports player vs. computer. Local multiplayer may be added in future versions.

**Q: Is there a way to make the computer easier to beat?**
A: No, the current version only has one difficulty level (unbeatable). Easy/medium modes may be added in the future.

**Q: Are my scores saved when I close the browser?**
A: No, scores reset when you refresh or close the page. Score persistence may be added in future.

### Gameplay Questions

**Q: Can I undo a move?**
A: No, all moves are final. This is intentional to match physical tic-tac-toe rules.

**Q: Can X go second?**
A: Yes! In the setup modal, choose X as your symbol, then select "Computer" to go first.

**Q: Why does the computer always win or draw?**
A: The computer uses perfect play (minimax algorithm). With optimal play from both sides, tic-tac-toe always ends in a draw.

**Q: How long does the computer take to think?**
A: The AI calculates instantly but waits 500-600ms for better UX. This delay makes the game feel more natural.

**Q: Can I change my symbol mid-game?**
A: No, click "New Setup" to start over with different settings.

### Technical Questions

**Q: What technology is this built with?**
A: TypeScript, vanilla JavaScript (ES modules), LESS CSS, and HTML5. No frameworks.

**Q: Can I customize the colors or theme?**
A: Yes! See [CUSTOMIZATION.md](CUSTOMIZATION.md) for a complete guide.

**Q: Can I use this in my own project?**
A: Yes, it's open source under the MIT License. Attribution appreciated.

**Q: Where is the source code?**
A: All source code is in the `src/` folder (TypeScript) and compiled to `dist/` (JavaScript).

---

## Getting Help

If you encounter issues not covered in this guide:

1. **Check the Browser Console**
   - Press F12 or right-click → Inspect
   - Look at the Console tab for error messages

2. **Review Other Documentation**
   - [Developer Guide](DEVELOPER_GUIDE.md) - Technical details
   - [API Reference](API_REFERENCE.md) - Code documentation
   - [Troubleshooting](#troubleshooting) - Common issues

3. **Open an Issue**
   - Describe the problem clearly
   - Include browser and OS version
   - Share any console errors
   - Explain steps to reproduce

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Navigate between interactive elements |
| Enter / Space | Activate buttons in setup modal |
| Mouse Click | Primary interaction for cell selection |

**Note:** The game is primarily mouse/touch-driven. Keyboard shortcuts are limited to button navigation.

---

## Accessibility Features

This game includes several accessibility features:

- ✅ **Semantic HTML** - Proper heading structure
- ✅ **ARIA Labels** - Screen reader support for all interactive elements
- ✅ **Color Contrast** - WCAG AA compliant color ratios
- ✅ **Keyboard Navigation** - Tab through all interactive elements
- ✅ **Focus Indicators** - Visible outlines on focused elements
- ✅ **Reduced Motion** - Respects OS preference for reduced animations
- ✅ **Large Touch Targets** - Minimum 44x44px on mobile

For feedback on accessibility, please open an issue.

---

**Enjoy playing Tic-Tac-Toe!** 🎮

**Version:** 1.0.0 | **Last Updated:** 2026-02-17
