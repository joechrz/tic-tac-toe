# Code Review Report: Tic-Tac-Toe Game

**Reviewer:** CriticAgent
**Date:** 2026-02-15
**Files Reviewed:** `game/app.js`, `game/index.html`

---

## Executive Summary

The implementation demonstrates a clean MVC architecture with proper OOP design. The code is well-organized into five distinct classes (`Player`, `Board`, `WinChecker`, `UI`, `Game`) with clear separation of concerns. CSS design tokens, semantic HTML, and accessibility attributes are strong positives. However, there are issues around extensibility (tight coupling in the controller), robustness (missing validation and error handling), and a few code quality concerns that should be addressed.

**Overall Assessment:** Solid foundation with specific improvements needed for production readiness.

---

## Architecture Review

### Checklist

- [x] Clear separation of concerns (MVC pattern)
- [x] Appropriate use of design patterns (MVC, Event Delegation)
- [ ] Loose coupling between components (partial - see issues)
- [x] High cohesion within components
- [ ] Extensible design (partial - see issues)

### Strengths

1. **Clean MVC separation**: `Player`/`Board` (Model), `UI` (View), `Game` (Controller), `WinChecker` (Service) each have a single clear responsibility.
2. **Event delegation**: Board clicks are handled via a single delegated listener on the board container (`app.js:296-301`) rather than 9 individual handlers.
3. **Parameterized win checking**: `WinChecker.generatePatterns()` accepts a `size` parameter and dynamically generates win patterns (`app.js:75-111`), enabling future board size changes.
4. **CSS custom properties**: The design token system (`index.html:11-74`) enables consistent theming and makes visual changes straightforward.

---

## Issues

### CRITICAL

*None identified.*

### HIGH

#### H1: Game controller creates all dependencies internally (no Dependency Injection)

**Location:** `app.js:321-325`

```js
constructor() {
  this.players = [new Player('X'), new Player('O')];
  this.board = new Board();
  this.winChecker = new WinChecker();
  this.ui = new UI();
```

**Problem:** `Game` instantiates all dependencies directly. This makes unit testing impossible without DOM access, prevents swapping implementations (e.g., mock UI for tests, AI player), and violates the Dependency Inversion Principle.

**Recommendation:** Accept dependencies through the constructor:

```js
constructor({ players, board, winChecker, ui } = {}) {
  this.players = players || [new Player('X'), new Player('O')];
  this.board = board || new Board();
  this.winChecker = winChecker || new WinChecker();
  this.ui = ui || new UI();
  // ...
}
```

---

#### H2: Board size configurable in Model/WinChecker but hardcoded in UI

**Location:** `app.js:159-160`, `app.js:199-200`, `index.html:798-806`

**Problem:** `Board` accepts `size` (`app.js:37`) and `WinChecker` accepts `size` (`app.js:71`), but the `UI` class hardcodes `3` in row/column calculations:

```js
const row = Math.floor(index / 3) + 1;
const col = (index % 3) + 1;
```

Additionally, the HTML contains exactly 9 hardcoded cell buttons. This inconsistency means changing the board size would silently break the UI while the model appears to support it.

**Recommendation:** Either:
- (A) Remove the `size` parameter from `Board`/`WinChecker` to be honest about the 3x3 constraint, or
- (B) Make `UI` accept a size parameter and dynamically generate board cells. Pass the board size consistently through all components.

---

#### H3: No focus trap on game-over overlay

**Location:** `app.js:265-268`, `index.html:827-834`

**Problem:** The overlay has `aria-modal="true"` and `role="dialog"`, but there is no JavaScript focus trap. Users can Tab out of the modal into the disabled game board behind it. This is an accessibility violation (WCAG 2.1 SC 1.3.2 / SC 2.4.3).

**Recommendation:** Implement a focus trap that keeps keyboard focus within the overlay while it's visible. Either use a simple custom trap or a well-tested utility. At minimum, intercept Tab/Shift+Tab to cycle within the overlay's focusable elements.

---

#### H4: No keyboard grid navigation for the board

**Location:** `index.html:797-807`

**Problem:** The 9 cells are all individual buttons with `tabindex="0"`. Users must press Tab 9 times to traverse the full board. For a 3x3 grid with `role="grid"`, arrow key navigation is the expected interaction pattern per WAI-ARIA grid authoring practices.

**Recommendation:** Implement roving `tabindex` with arrow key handlers:
- Only one cell has `tabindex="0"` at a time (the "active" cell)
- Arrow keys move the active cell in the grid
- Other cells have `tabindex="-1"`

---

### MEDIUM

#### M1: Game instance not stored or exported

**Location:** `app.js:437-439`

```js
document.addEventListener('DOMContentLoaded', () => {
  new Game();
});
```

**Problem:** The `Game` instance is created but never assigned to a variable. This makes it impossible to access from tests, browser console, or other code that might need to interact with the game programmatically.

**Recommendation:**

```js
document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
```

Or better, use ES modules and export the class.

---

#### M2: Magic numbers throughout the codebase

**Location:** `app.js:378`, `app.js:393`, `app.js:272`, `app.js:288`

**Problem:** Several unnamed numeric constants appear in the code:
- `600` ms delay before showing overlay (lines 378, 393)
- `30` default confetti particle count (line 272)
- `4000` ms confetti cleanup timeout (line 288)
- `1.5`, `2`, `0.5`, `6` in confetti particle generation (lines 281-284)

**Recommendation:** Define named constants at the top of the file or as static class properties:

```js
const OVERLAY_DELAY_MS = 600;
const CONFETTI_COUNT = 30;
const CONFETTI_CLEANUP_MS = 4000;
```

---

#### M3: No DOM element validation in UI constructor

**Location:** `app.js:128-146`

**Problem:** The `UI` constructor calls `document.getElementById()` for many elements and stores the results without checking for `null`. If any element is missing (e.g., a typo in an ID, or the script loads before the DOM), subsequent method calls will throw `TypeError: Cannot read properties of null`.

**Recommendation:** Add validation in the constructor:

```js
constructor() {
  this.els = { /* ... */ };
  for (const [key, el] of Object.entries(this.els)) {
    if (!el) throw new Error(`UI: Missing required element for "${key}"`);
  }
  // ...
}
```

---

#### M4: Confetti cleanup race condition

**Location:** `app.js:272-291`

**Problem:** `spawnConfetti` uses `setTimeout(() => container.innerHTML = '', 4000)` for cleanup. If a user wins multiple games quickly (e.g., spam-clicking through games), multiple timeouts can fire and one can prematurely clear confetti from a subsequent win.

**Recommendation:** Track the timeout ID and clear it before spawning new confetti:

```js
spawnConfetti(count = 30) {
  if (this._confettiTimeout) clearTimeout(this._confettiTimeout);
  const container = this.els.confettiContainer;
  container.innerHTML = '';
  // ... spawn particles ...
  this._confettiTimeout = setTimeout(() => {
    container.innerHTML = '';
  }, 4000);
}
```

---

#### M5: No move history for undo/replay functionality

**Location:** `app.js:36-65` (Board class)

**Problem:** The `Board` class only maintains current state (`cells` array). No move history is recorded. This prevents implementing undo, replay, or game analysis features.

**Recommendation:** Add a move history array to `Board`:

```js
constructor(size = 3) {
  this.size = size;
  this.cells = new Array(size * size).fill(null);
  this.history = [];
}

placeMark(index, symbol) {
  if (!this.isValidMove(index)) return false;
  this.cells[index] = symbol;
  this.history.push({ index, symbol });
  return true;
}
```

---

#### M6: Score state not persisted

**Problem:** All scores are lost on page refresh. For a game that tracks scores across multiple rounds, this is a notable UX gap.

**Recommendation:** Add `localStorage` persistence for scores. This could be a simple `ScoreStorage` class or methods on the `Game` class that save/load state.

---

### LOW

#### L1: No ES module system

**Location:** `app.js`, `index.html:882`

**Problem:** All classes are in a single file loaded via `<script src="app.js">`. No ES module imports/exports. This means:
- Classes cannot be individually imported for unit tests
- No tree-shaking or bundling support
- Class dependency order is implicit

**Recommendation:** Convert to ES modules with `type="module"` on the script tag. Each class can be in its own file with explicit import/export.

---

#### L2: Player symbol not validated

**Location:** `app.js:10-14`

```js
constructor(symbol) {
  this.symbol = symbol;
  this.score = 0;
}
```

**Problem:** The `Player` constructor accepts any value for `symbol` without validation. An invalid symbol like `''`, `null`, or `'Z'` would produce broken CSS class names (e.g., `mark-z`) and incorrect display.

**Recommendation:**

```js
static VALID_SYMBOLS = ['X', 'O'];

constructor(symbol) {
  if (!Player.VALID_SYMBOLS.includes(symbol)) {
    throw new Error(`Invalid symbol: ${symbol}`);
  }
  this.symbol = symbol;
  this.score = 0;
}
```

---

#### L3: `parseInt` result not validated

**Location:** `app.js:299`

```js
const index = parseInt(cell.dataset.index, 10);
```

**Problem:** If `data-index` is missing or malformed, `parseInt` returns `NaN`, which would be passed to `_handleMove()`. While `isValidMove` would reject it (NaN comparisons fail), the failure is silent and non-obvious.

**Recommendation:** Add an explicit NaN check:

```js
const index = parseInt(cell.dataset.index, 10);
if (Number.isNaN(index)) return;
```

---

#### L4: CSS embedded in HTML

**Location:** `index.html:7-758`

**Problem:** 750 lines of CSS are inline in `<style>` tags within the HTML. This hurts maintainability and prevents CSS caching separate from HTML.

**Recommendation:** Extract CSS to a separate `styles.css` file.

---

#### L5: No event emitter / observer pattern for extensibility

**Problem:** The `Game` class directly calls `UI` methods for every state change. Adding cross-cutting concerns (analytics, sound effects, AI opponent triggers, network sync) would require modifying the `Game` class each time.

**Recommendation:** Consider adding a simple event emitter so components can subscribe to game events:

```js
// Game emits events like 'move', 'win', 'draw', 'newGame'
// UI subscribes to these events
// AI, analytics, sound can also subscribe independently
```

This is a "nice to have" for a small project but becomes essential as features grow.

---

## Code Quality Checklist

- [x] Readable and maintainable code
- [x] Consistent naming conventions (camelCase methods, PascalCase classes)
- [x] No significant code duplication
- [ ] Appropriate comments (section dividers present, but no JSDoc on public API)
- [ ] Error handling present (minimal - see H2, M3)

## Robustness Checklist

- [x] Input validation for moves (`isValidMove`)
- [ ] Edge cases fully handled (confetti race condition, NaN index)
- [x] State transitions validated (gameOver flag prevents moves)
- [x] No race conditions in core game logic
- [ ] Memory leaks prevented (confetti cleanup could leak - see M4)

## Best Practices Checklist

- [x] DRY principle applied
- [ ] SOLID principles fully followed (DIP violated - see H1; OCP partially violated)
- [x] Security considerations addressed (no user input injection, event delegation)
- [x] Performance optimized (delegation, efficient DOM access)
- [x] Accessibility partially addressed (ARIA labels, `aria-live`, reduced motion)
- [ ] Full accessibility compliance (missing focus trap, grid nav - see H3, H4)

---

## Summary by Severity

| Severity | Count | Items |
|----------|-------|-------|
| CRITICAL | 0     | -     |
| HIGH     | 4     | H1 (no DI), H2 (size mismatch), H3 (focus trap), H4 (grid navigation) |
| MEDIUM   | 6     | M1 (game instance), M2 (magic numbers), M3 (DOM validation), M4 (confetti race), M5 (no history), M6 (no persistence) |
| LOW      | 5     | L1 (no modules), L2 (symbol validation), L3 (parseInt NaN), L4 (CSS in HTML), L5 (no event emitter) |

---

## Priority Recommendations

1. **Inject dependencies into `Game`** (H1) - Enables testing and swap-ability
2. **Resolve board size inconsistency** (H2) - Either make all layers dynamic or remove the false flexibility
3. **Add focus trap to overlay** (H3) - Required for accessibility compliance
4. **Add grid keyboard navigation** (H4) - Expected ARIA grid behavior
5. **Extract magic numbers to constants** (M2) - Quick win for readability
6. **Add DOM element validation** (M3) - Prevents silent failures
