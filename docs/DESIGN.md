# Tic-Tac-Toe UI Design Documentation

## Color Palette

| Token                   | Value                        | Usage                          |
|-------------------------|------------------------------|--------------------------------|
| `--color-bg-primary`    | `#0f0f1a`                    | Page background                |
| `--color-bg-secondary`  | `#1a1a2e`                    | Cell background                |
| `--color-bg-card`       | `#16213e`                    | Board & scoreboard background  |
| `--color-bg-cell-hover` | `#232345`                    | Cell hover state               |
| `--color-accent-x`      | `#e94560` (coral red)        | Player X marks & highlights    |
| `--color-accent-o`      | `#00d4ff` (electric blue)    | Player O marks & highlights    |
| `--color-win-border`    | `#4cd964` (green)            | Win state highlights           |
| `--color-draw-text`     | `#ffcc00` (gold)             | Draw state highlights          |
| `--color-text-primary`  | `#e8e8e8`                    | Primary text                   |
| `--color-text-secondary`| `#8892b0`                    | Secondary/label text           |
| `--color-text-muted`    | `#5a6380`                    | Muted/footer text              |

## Typography

- **Primary font**: `'Segoe UI', system-ui, -apple-system, sans-serif`
- **Monospace font**: `'SF Mono', 'Fira Code', 'Cascadia Code', monospace` (scores)
- **Scale**: 0.75rem (xs) to 2.5rem (3xl), with `clamp()` for cell marks
- **Title**: 800 weight with animated gradient fill (X coral -> O blue)

## Layout

- **Container**: Flexbox column, centered, max-width 480px
- **Board**: CSS Grid 3x3 with 6px gap, 1:1 aspect ratio, max-width 400px
- **Scoreboard**: CSS Grid 3-column (Player X | Draws | Player O)
- **Controls**: Flexbox row, two buttons filling available width

## Animations

| Animation       | Duration | Easing                              | Purpose                   |
|-----------------|----------|-------------------------------------|---------------------------|
| `popIn`         | 400ms    | `cubic-bezier(0.34, 1.56, 0.64, 1)`| Mark placement (bounce)   |
| `winCellPulse`  | 1.2s     | ease, infinite                      | Winning cell glow          |
| `winMark`       | 600ms    | ease                                | Winning mark scale-up      |
| `fadeIn`        | 300ms    | ease                                | Status text transitions    |
| `bounceIn`      | 600ms    | cubic-bezier bounce                 | Overlay icon entrance      |
| `gradientShift` | 4s       | ease, infinite                      | Title gradient animation   |
| `bgShift`       | 12s      | ease-in-out, infinite alternate     | Background gradient pulse  |
| `confettiFall`  | variable | linear                              | Win celebration particles  |
| `drawLine`      | 500ms    | ease                                | Win line drawing effect    |

## Responsive Breakpoints

| Breakpoint       | Target                | Changes                                   |
|------------------|-----------------------|-------------------------------------------|
| `max-width: 360px` | Small phones        | Smaller title, compact scoreboard, stacked buttons |
| `min-width: 768px` | Tablets and up      | Larger gaps, wider board spacing           |
| `max-height: 600px`| Landscape phones    | Compact vertical spacing, smaller board    |

## Accessibility

- All cells are `<button>` elements with `role="gridcell"` and descriptive `aria-label`
- Board has `role="grid"` with `aria-label`
- Status text uses `aria-live="polite"` for screen reader announcements
- Game-over overlay uses `role="dialog"` with `aria-modal="true"`
- `:focus-visible` outlines on all interactive elements
- `prefers-reduced-motion` media query disables animations
- `.sr-only` utility class for screen-reader-only content

## Integration Points

The HTML provides a complete UI shell. Game logic should integrate via:

1. **DOM IDs**: `#board`, `#status-text`, `#score-x`, `#score-o`, `#score-draws`, `#game-overlay`, etc.
2. **CSS Classes**: `.cell--filled`, `.cell--win`, `.cell--draw`, `.cell--disabled`, `.active`, `.visible`
3. **Data Attributes**: `data-index` on cells (0-8), `data-hover` for ghost preview
4. **Mark Elements**: `<span class="cell-mark mark-x">X</span>` or `mark-o`

See the HTML comment block at the bottom of `index.html` for detailed integration instructions.
