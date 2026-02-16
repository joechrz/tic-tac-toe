# Customization Guide

How to customize the look, feel, and behavior of the Tic Tac Toe game.

## Table of Contents

- [Theming with CSS Custom Properties](#theming-with-css-custom-properties)
- [Color Themes](#color-themes)
- [Typography](#typography)
- [Spacing and Layout](#spacing-and-layout)
- [Animations](#animations)
- [Adding New Features](#adding-new-features)

## Theming with CSS Custom Properties

All visual styling is controlled through CSS custom properties (design tokens) defined in the `:root` block of `index.html` (lines 11-74). Changing these values reskins the entire game without touching any other CSS.

### How to Apply Changes

Edit the `:root` block in `index.html`:

```html
<style>
  :root {
    /* Change values here */
    --color-accent-x: #a78bfa;  /* purple instead of coral */
  }
</style>
```

Or override at runtime via JavaScript:

```js
document.documentElement.style.setProperty('--color-accent-x', '#a78bfa');
```

## Color Themes

### Default Theme (Dark Neon)

```css
:root {
  --color-bg-primary: #0f0f1a;
  --color-bg-secondary: #1a1a2e;
  --color-bg-card: #16213e;
  --color-bg-cell: #1a1a2e;
  --color-bg-cell-hover: #232345;
  --color-accent-x: #e94560;
  --color-accent-x-glow: rgba(233, 69, 96, 0.4);
  --color-accent-o: #00d4ff;
  --color-accent-o-glow: rgba(0, 212, 255, 0.4);
  --color-text-primary: #e8e8e8;
  --color-text-secondary: #8892b0;
  --color-text-muted: #5a6380;
  --color-border: #2a2a4a;
  --color-win-bg: rgba(76, 217, 100, 0.15);
  --color-win-border: #4cd964;
  --color-draw-bg: rgba(255, 204, 0, 0.15);
  --color-draw-text: #ffcc00;
}
```

### Example: Light Theme

```css
:root {
  --color-bg-primary: #f5f5f7;
  --color-bg-secondary: #ffffff;
  --color-bg-card: #ffffff;
  --color-bg-cell: #f0f0f5;
  --color-bg-cell-hover: #e8e8f0;
  --color-accent-x: #e63946;
  --color-accent-x-glow: rgba(230, 57, 70, 0.2);
  --color-accent-o: #457b9d;
  --color-accent-o-glow: rgba(69, 123, 157, 0.2);
  --color-text-primary: #1d3557;
  --color-text-secondary: #457b9d;
  --color-text-muted: #a8dadc;
  --color-border: #e0e0e8;
  --color-win-bg: rgba(76, 217, 100, 0.1);
  --color-win-border: #2a9d8f;
  --color-draw-bg: rgba(255, 183, 77, 0.1);
  --color-draw-text: #e9c46a;
}
```

Note: For a light theme, you should also update the background gradient in the `body::before` rule to use lighter colors or remove it entirely.

### Example: Retro Green Terminal

```css
:root {
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #111111;
  --color-bg-card: #0d0d0d;
  --color-bg-cell: #111111;
  --color-bg-cell-hover: #1a1a1a;
  --color-accent-x: #00ff41;
  --color-accent-x-glow: rgba(0, 255, 65, 0.4);
  --color-accent-o: #00ff41;
  --color-accent-o-glow: rgba(0, 255, 65, 0.2);
  --color-text-primary: #00ff41;
  --color-text-secondary: #00cc33;
  --color-text-muted: #006622;
  --color-border: #003311;
  --color-win-border: #ffff00;
  --color-draw-text: #ff8800;
}
```

### Player Color Tokens

To change only the player colors without affecting the rest of the theme:

| Token                      | Affects                                    |
|----------------------------|--------------------------------------------|
| `--color-accent-x`        | X marks, X scoreboard highlight, primary button |
| `--color-accent-x-glow`   | X mark glow, primary button shadow          |
| `--color-accent-o`        | O marks, O scoreboard highlight, focus outlines |
| `--color-accent-o-glow`   | O mark glow                                 |

When changing these, keep the glow version as an `rgba()` variant of the accent color at ~0.4 opacity.

## Typography

### Font Families

```css
:root {
  --font-primary: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
}
```

- `--font-primary` is used for all text.
- `--font-mono` is used for score numbers.

To use a Google Font, add the `<link>` tag in `<head>` and update the variable:

```html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
<style>
  :root {
    --font-primary: 'Press Start 2P', monospace;
  }
</style>
```

### Font Sizes

```css
:root {
  --font-size-xs: 0.75rem;    /* labels, footer */
  --font-size-sm: 0.875rem;   /* subtitle */
  --font-size-base: 1rem;     /* buttons, body text */
  --font-size-lg: 1.25rem;    /* status text, draw score */
  --font-size-xl: 1.5rem;     /* score values */
  --font-size-2xl: 2rem;      /* scoreboard symbols, overlay title */
  --font-size-3xl: 2.5rem;    /* game title */
  --font-size-cell: clamp(2rem, 8vw, 4rem);  /* X and O marks */
}
```

The cell mark size uses `clamp()` for fluid scaling between 2rem and 4rem based on viewport width.

## Spacing and Layout

### Spacing Scale

```css
:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
}
```

### Border Radius

```css
:root {
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 50%;
}
```

To make the game look sharper, reduce radii. For a more rounded look, increase them.

### Board Layout

The board is a CSS Grid that can be adjusted:

```css
.board {
  gap: 6px;              /* Space between cells */
  max-width: 400px;      /* Maximum board size */
  padding: 6px;          /* Padding around the grid */
  border-radius: var(--radius-xl);
}
```

The board uses `aspect-ratio: 1 / 1` to stay square at any width.

## Animations

### Animation Speeds

```css
:root {
  --transition-fast: 150ms ease;     /* hover effects */
  --transition-base: 250ms ease;     /* general transitions */
  --transition-slow: 400ms ease;     /* overlay transitions */
  --transition-bounce: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);  /* bouncy effects */
}
```

### Disabling Animations

The game already respects `prefers-reduced-motion`. To force-disable all animations:

```css
* {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

### Customizing the Confetti

Confetti colors are defined in `app.js` line 274:

```js
const colors = ['#e94560', '#00d4ff', '#4cd964', '#ffcc00', '#ff8a80', '#a78bfa'];
```

Modify this array to change confetti colors. Adjust the particle count by changing the default parameter in `spawnConfetti(count = 30)`.

Confetti behavior can be tuned in `app.js` lines 280-284:

| Property          | Current Value       | Effect                    |
|-------------------|---------------------|---------------------------|
| Animation duration| `1.5 + random * 2`s | How long particles fall   |
| Animation delay   | `random * 0.5`s     | Stagger between particles |
| Particle width    | `6 + random * 6`px  | Particle size range       |
| Cleanup timeout   | `4000`ms            | When particles are removed|

## Adding New Features

### Adding a Third Player Color (for future expansion)

1. Add new CSS custom properties:

```css
:root {
  --color-accent-z: #a78bfa;
  --color-accent-z-glow: rgba(167, 139, 250, 0.4);
}
```

2. Add CSS rules for the new mark:

```css
.cell-mark.mark-z {
  color: var(--color-accent-z);
  text-shadow: 0 0 12px var(--color-accent-z-glow);
}
```

3. Update the JavaScript `Player` class and `Game` logic accordingly.

### Adding a Theme Switcher

1. Define multiple theme sets as JavaScript objects:

```js
const themes = {
  dark: { '--color-bg-primary': '#0f0f1a', /* ... */ },
  light: { '--color-bg-primary': '#f5f5f7', /* ... */ },
};
```

2. Apply a theme by iterating over the object:

```js
function applyTheme(name) {
  const theme = themes[name];
  for (const [prop, value] of Object.entries(theme)) {
    document.documentElement.style.setProperty(prop, value);
  }
}
```

3. Add a theme toggle button to the HTML and wire it to `applyTheme()`.

### Adding Game Board Size Options

The `Board` and `WinChecker` classes already accept a `size` parameter. To support larger boards:

1. Generate cells dynamically in the `UI` class instead of hardcoding 9 buttons in HTML.
2. Update `grid-template-columns` to `repeat(size, 1fr)`.
3. Update the row/column ARIA label calculations to use the board size instead of `3`.
4. Pass the same `size` value to `Board`, `WinChecker`, and `UI`.

### Changing Overlay Content

Overlay text is set in `UI.showWinOverlay()` and `UI.showDrawOverlay()` (`app.js:244-259`). Modify these methods to customize:

- `overlayIcon` - Emoji or text icon
- `overlayTitle` - Main result text
- `overlaySubtitle` - Secondary text

Example:

```js
showWinOverlay(symbol) {
  this.els.overlayIcon.textContent = '🎯';
  this.els.overlayTitle.textContent = `${symbol} is the champion!`;
  this.els.overlaySubtitle.textContent = 'What a game!';
  // ...
}
```
