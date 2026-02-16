/**
 * Node.js Test Runner for Tic-Tac-Toe Game Logic
 * Tests Player, Board, WinChecker, and AIPlayer classes (no DOM required).
 * For UI/integration tests, open tests.html in a browser.
 */

// Extract classes from app.js by evaluating the source
const fs = require('fs');
const path = require('path');

const vm = require('vm');

// Read app.js and extract class definitions
const appSource = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

// Extract non-DOM classes (Player, Board, WinChecker, AIPlayer)
const classSource = appSource.substring(0, appSource.indexOf('// ============================================\n// ModeSelector'));
vm.runInThisContext(classSource);

// ============================================
// Minimal Test Framework
// ============================================
let total = 0, passed = 0, failed = 0;
const failures = [];
let currentSuite = '';

function describe(name, fn) {
  currentSuite = name;
  fn();
}

function it(name, fn) {
  total++;
  try {
    fn();
    passed++;
    process.stdout.write('\x1b[32m.\x1b[0m');
  } catch (e) {
    failed++;
    process.stdout.write('\x1b[31mF\x1b[0m');
    failures.push({ suite: currentSuite, test: name, error: e.message });
  }
}

function assert(cond, msg) { if (!cond) throw new Error(msg || 'Assertion failed'); }
function assertEqual(a, b, msg) { if (a !== b) throw new Error(msg || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }
function assertDeepEqual(a, b, msg) { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(msg || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }
function assertNull(v, msg) { if (v !== null) throw new Error(msg || `Expected null, got ${JSON.stringify(v)}`); }
function assertNotNull(v, msg) { if (v === null) throw new Error(msg || 'Expected non-null'); }
function assertTrue(v, msg) { if (v !== true) throw new Error(msg || `Expected true, got ${v}`); }
function assertFalse(v, msg) { if (v !== false) throw new Error(msg || `Expected false, got ${v}`); }

console.log('Tic-Tac-Toe Logic Tests\n');

// ============================================
// Player Tests
// ============================================
describe('Player - Constructor', () => {
  it('should create player with correct symbol', () => {
    const p = new Player('X');
    assertEqual(p.symbol, 'X');
  });
  it('should initialize score to 0', () => {
    const p = new Player('X');
    assertEqual(p.score, 0);
  });
  it('should work with O symbol', () => {
    const p = new Player('O');
    assertEqual(p.symbol, 'O');
  });
});

describe('Player - CSS Classes', () => {
  it('should return correct cssClass for X', () => {
    assertEqual(new Player('X').cssClass, 'player-x');
  });
  it('should return correct cssClass for O', () => {
    assertEqual(new Player('O').cssClass, 'player-o');
  });
  it('should return correct markClass for X', () => {
    assertEqual(new Player('X').markClass, 'mark-x');
  });
  it('should return correct markClass for O', () => {
    assertEqual(new Player('O').markClass, 'mark-o');
  });
});

describe('Player - Score Management', () => {
  it('should increment score by 1', () => {
    const p = new Player('X');
    p.incrementScore();
    assertEqual(p.score, 1);
  });
  it('should increment score multiple times', () => {
    const p = new Player('X');
    p.incrementScore(); p.incrementScore(); p.incrementScore();
    assertEqual(p.score, 3);
  });
  it('should reset score to 0', () => {
    const p = new Player('X');
    p.incrementScore(); p.incrementScore();
    p.resetScore();
    assertEqual(p.score, 0);
  });
  it('should reset score when already 0', () => {
    const p = new Player('X');
    p.resetScore();
    assertEqual(p.score, 0);
  });
});

// ============================================
// Board Tests
// ============================================
describe('Board - Constructor', () => {
  it('should create 3x3 board by default', () => {
    const b = new Board();
    assertEqual(b.size, 3);
    assertEqual(b.cells.length, 9);
  });
  it('should initialize all cells to null', () => {
    const b = new Board();
    assertTrue(b.cells.every(c => c === null));
  });
  it('should support custom size', () => {
    const b = new Board(4);
    assertEqual(b.size, 4);
    assertEqual(b.cells.length, 16);
  });
  it('should support size 5', () => {
    const b = new Board(5);
    assertEqual(b.cells.length, 25);
  });
});

describe('Board - placeMark', () => {
  it('should place mark on empty cell', () => {
    const b = new Board();
    assertTrue(b.placeMark(0, 'X'));
    assertEqual(b.cells[0], 'X');
  });
  it('should reject placing mark on occupied cell', () => {
    const b = new Board();
    b.placeMark(0, 'X');
    assertFalse(b.placeMark(0, 'O'));
    assertEqual(b.cells[0], 'X');
  });
  it('should reject negative index', () => {
    const b = new Board();
    assertFalse(b.placeMark(-1, 'X'));
  });
  it('should reject out-of-bounds index', () => {
    const b = new Board();
    assertFalse(b.placeMark(9, 'X'));
  });
  it('should reject very large index', () => {
    const b = new Board();
    assertFalse(b.placeMark(1000, 'X'));
  });
  it('should place marks in sequence', () => {
    const b = new Board();
    b.placeMark(0, 'X');
    b.placeMark(1, 'O');
    b.placeMark(2, 'X');
    assertEqual(b.cells[0], 'X');
    assertEqual(b.cells[1], 'O');
    assertEqual(b.cells[2], 'X');
  });
  it('should fill all cells', () => {
    const b = new Board();
    const symbols = ['X','O','X','O','X','O','X','O','X'];
    symbols.forEach((s, i) => assertTrue(b.placeMark(i, s)));
  });
});

describe('Board - isValidMove', () => {
  it('should return true for empty cell', () => {
    assertTrue(new Board().isValidMove(0));
  });
  it('should return false for occupied cell', () => {
    const b = new Board();
    b.placeMark(4, 'X');
    assertFalse(b.isValidMove(4));
  });
  it('should return false for negative index', () => {
    assertFalse(new Board().isValidMove(-1));
  });
  it('should return false for index >= cells.length', () => {
    assertFalse(new Board().isValidMove(9));
    assertFalse(new Board().isValidMove(100));
  });
  it('should handle NaN gracefully', () => {
    assertFalse(new Board().isValidMove(NaN));
  });
  it('should handle floating point index', () => {
    assertFalse(new Board().isValidMove(1.5));
  });
  it('should validate all 9 positions on fresh board', () => {
    const b = new Board();
    for (let i = 0; i < 9; i++) assertTrue(b.isValidMove(i));
  });
});

describe('Board - isFull', () => {
  it('should return false on empty board', () => {
    assertFalse(new Board().isFull());
  });
  it('should return false with some moves', () => {
    const b = new Board();
    b.placeMark(0, 'X'); b.placeMark(4, 'O');
    assertFalse(b.isFull());
  });
  it('should return true when all cells filled', () => {
    const b = new Board();
    ['X','O','X','O','X','O','X','O','X'].forEach((s,i) => b.placeMark(i, s));
    assertTrue(b.isFull());
  });
  it('should return false with 8 of 9 cells', () => {
    const b = new Board();
    for (let i = 0; i < 8; i++) b.placeMark(i, i % 2 === 0 ? 'X' : 'O');
    assertFalse(b.isFull());
  });
});

describe('Board - reset', () => {
  it('should clear all cells to null', () => {
    const b = new Board();
    b.placeMark(0, 'X'); b.placeMark(4, 'O');
    b.reset();
    assertTrue(b.cells.every(c => c === null));
  });
  it('should allow new moves after reset', () => {
    const b = new Board();
    b.placeMark(0, 'X');
    b.reset();
    assertTrue(b.placeMark(0, 'O'));
    assertEqual(b.cells[0], 'O');
  });
});

describe('Board - getCell', () => {
  it('should return null for empty cell', () => {
    assertNull(new Board().getCell(0));
  });
  it('should return symbol for filled cell', () => {
    const b = new Board();
    b.placeMark(3, 'O');
    assertEqual(b.getCell(3), 'O');
  });
  it('should return undefined for out of bounds', () => {
    assertEqual(new Board().getCell(9), undefined);
  });
});

// ============================================
// WinChecker Tests
// ============================================
describe('WinChecker - Pattern Generation', () => {
  it('should generate 8 patterns for 3x3', () => {
    assertEqual(new WinChecker(3).winPatterns.length, 8);
  });
  it('should include all 3 row patterns', () => {
    const wc = new WinChecker(3);
    for (const row of [[0,1,2],[3,4,5],[6,7,8]]) {
      assert(wc.winPatterns.some(p => JSON.stringify(p) === JSON.stringify(row)), `Missing row ${row}`);
    }
  });
  it('should include all 3 column patterns', () => {
    const wc = new WinChecker(3);
    for (const col of [[0,3,6],[1,4,7],[2,5,8]]) {
      assert(wc.winPatterns.some(p => JSON.stringify(p) === JSON.stringify(col)), `Missing col ${col}`);
    }
  });
  it('should include main diagonal', () => {
    const wc = new WinChecker(3);
    assert(wc.winPatterns.some(p => JSON.stringify(p) === JSON.stringify([0,4,8])));
  });
  it('should include anti-diagonal', () => {
    const wc = new WinChecker(3);
    assert(wc.winPatterns.some(p => JSON.stringify(p) === JSON.stringify([2,4,6])));
  });
  it('should generate 10 patterns for 4x4', () => {
    assertEqual(new WinChecker(4).winPatterns.length, 10);
  });
  it('should generate correct 4x4 diagonal', () => {
    const wc = new WinChecker(4);
    assert(wc.winPatterns.some(p => JSON.stringify(p) === JSON.stringify([0,5,10,15])));
  });
});

describe('WinChecker - Win Detection: Rows', () => {
  it('should detect X winning top row', () => {
    const r = new WinChecker().check(['X','X','X', null,null,null, null,null,null]);
    assertNotNull(r);
    assertEqual(r.winner, 'X');
    assertDeepEqual(r.pattern, [0,1,2]);
  });
  it('should detect O winning middle row', () => {
    const r = new WinChecker().check([null,null,null, 'O','O','O', null,null,null]);
    assertNotNull(r);
    assertEqual(r.winner, 'O');
    assertDeepEqual(r.pattern, [3,4,5]);
  });
  it('should detect winning bottom row', () => {
    const r = new WinChecker().check([null,null,null, null,null,null, 'X','X','X']);
    assertNotNull(r);
    assertDeepEqual(r.pattern, [6,7,8]);
  });
});

describe('WinChecker - Win Detection: Columns', () => {
  it('should detect winning left column', () => {
    const r = new WinChecker().check(['O',null,null, 'O',null,null, 'O',null,null]);
    assertNotNull(r);
    assertEqual(r.winner, 'O');
    assertDeepEqual(r.pattern, [0,3,6]);
  });
  it('should detect winning middle column', () => {
    const r = new WinChecker().check([null,'X',null, null,'X',null, null,'X',null]);
    assertNotNull(r);
    assertEqual(r.winner, 'X');
  });
  it('should detect winning right column', () => {
    const r = new WinChecker().check([null,null,'O', null,null,'O', null,null,'O']);
    assertNotNull(r);
    assertEqual(r.winner, 'O');
  });
});

describe('WinChecker - Win Detection: Diagonals', () => {
  it('should detect main diagonal', () => {
    const r = new WinChecker().check(['X',null,null, null,'X',null, null,null,'X']);
    assertNotNull(r);
    assertEqual(r.winner, 'X');
    assertDeepEqual(r.pattern, [0,4,8]);
  });
  it('should detect anti-diagonal', () => {
    const r = new WinChecker().check([null,null,'O', null,'O',null, 'O',null,null]);
    assertNotNull(r);
    assertEqual(r.winner, 'O');
    assertDeepEqual(r.pattern, [2,4,6]);
  });
});

describe('WinChecker - No Winner', () => {
  it('should return null for partial fill', () => {
    assertNull(new WinChecker().check(['X','O','X', null,null,null, null,null,null]));
  });
  it('should return null for empty board', () => {
    assertNull(new WinChecker().check(new Array(9).fill(null)));
  });
  it('should return null for draw board 1', () => {
    assertNull(new WinChecker().check(['X','O','X', 'X','X','O', 'O','X','O']));
  });
  it('should return null for draw board 2', () => {
    assertNull(new WinChecker().check(['O','X','O', 'X','X','O', 'X','O','X']));
  });
});

describe('WinChecker - Win in Full Board', () => {
  it('should detect win even when board is full', () => {
    const r = new WinChecker().check(['X','X','X', 'O','O','X', 'X','O','O']);
    assertNotNull(r);
    assertEqual(r.winner, 'X');
  });
  it('should return first matching pattern on multiple wins', () => {
    const r = new WinChecker().check(['X','X','X', 'X',null,null, 'X',null,null]);
    assertNotNull(r);
    assertDeepEqual(r.pattern, [0,1,2]);
  });
});

// ============================================
// Edge Case Tests (Logic Only)
// ============================================
describe('Edge Case - Board Boundaries', () => {
  it('should handle Infinity as index', () => {
    assertFalse(new Board().isValidMove(Infinity));
  });
  it('should handle -Infinity as index', () => {
    assertFalse(new Board().isValidMove(-Infinity));
  });
  it('should handle undefined as index', () => {
    // undefined >= 0 is false
    assertFalse(new Board().isValidMove(undefined));
  });
});

describe('Edge Case - Player Symbol Edge Cases', () => {
  it('should accept any string as symbol (no validation)', () => {
    // This is a known issue (L2 in code review)
    const p = new Player('Z');
    assertEqual(p.symbol, 'Z');
    assertEqual(p.cssClass, 'player-z');
    assertEqual(p.markClass, 'mark-z');
  });
  it('should accept empty string as symbol', () => {
    const p = new Player('');
    assertEqual(p.symbol, '');
    assertEqual(p.cssClass, 'player-');
  });
});

describe('Edge Case - Board Size 1', () => {
  it('should create 1x1 board', () => {
    const b = new Board(1);
    assertEqual(b.cells.length, 1);
    assertTrue(b.placeMark(0, 'X'));
    assertTrue(b.isFull());
  });
  it('should have 3 win patterns for 1x1 (1 row + 1 col + 1 diag... actually)', () => {
    const wc = new WinChecker(1);
    // 1 row + 1 col + 2 diags = 4, but they're all [0]
    assertEqual(wc.winPatterns.length, 4);
  });
});

describe('Edge Case - Repeated resets', () => {
  it('should handle 100 consecutive resets', () => {
    const b = new Board();
    for (let i = 0; i < 100; i++) {
      b.placeMark(0, 'X');
      b.reset();
    }
    assertTrue(b.cells.every(c => c === null));
  });
});

// ============================================
// Board - New Methods (getEmptyCells, clone)
// ============================================
describe('Board - getEmptyCells', () => {
  it('should return all 9 indices on empty board', () => {
    const b = new Board();
    assertDeepEqual(b.getEmptyCells(), [0,1,2,3,4,5,6,7,8]);
  });
  it('should return empty array on full board', () => {
    const b = new Board();
    ['X','O','X','O','X','O','X','O','X'].forEach((s,i) => b.placeMark(i, s));
    assertDeepEqual(b.getEmptyCells(), []);
  });
  it('should return only unoccupied indices', () => {
    const b = new Board();
    b.placeMark(0, 'X');
    b.placeMark(4, 'O');
    b.placeMark(8, 'X');
    assertDeepEqual(b.getEmptyCells(), [1,2,3,5,6,7]);
  });
  it('should return single cell when 8 filled', () => {
    const b = new Board();
    for (let i = 0; i < 8; i++) b.placeMark(i, i % 2 === 0 ? 'X' : 'O');
    assertDeepEqual(b.getEmptyCells(), [8]);
  });
});

describe('Board - clone', () => {
  it('should create an independent copy', () => {
    const b = new Board();
    b.placeMark(0, 'X');
    b.placeMark(4, 'O');
    const c = b.clone();
    assertDeepEqual(c.cells, b.cells);
    assertEqual(c.size, b.size);
  });
  it('should not share cell array reference', () => {
    const b = new Board();
    b.placeMark(0, 'X');
    const c = b.clone();
    c.placeMark(1, 'O');
    assertNull(b.getCell(1)); // original unchanged
    assertEqual(c.getCell(1), 'O');
  });
  it('should preserve size', () => {
    const b = new Board(4);
    const c = b.clone();
    assertEqual(c.size, 4);
    assertEqual(c.cells.length, 16);
  });
});

// ============================================
// AIPlayer Tests
// ============================================
describe('AIPlayer - Constructor', () => {
  it('should store symbol and opponent symbol', () => {
    const wc = new WinChecker();
    const ai = new AIPlayer('O', 'X', 'hard', wc);
    assertEqual(ai.symbol, 'O');
    assertEqual(ai.opponentSymbol, 'X');
    assertEqual(ai.difficulty, 'hard');
  });
  it('should accept all difficulty levels', () => {
    const wc = new WinChecker();
    for (const d of ['easy', 'medium', 'hard']) {
      const ai = new AIPlayer('O', 'X', d, wc);
      assertEqual(ai.difficulty, d);
    }
  });
});

describe('AIPlayer - chooseMove (Easy)', () => {
  it('should return a valid cell index', () => {
    const wc = new WinChecker();
    const ai = new AIPlayer('O', 'X', 'easy', wc);
    const b = new Board();
    b.placeMark(0, 'X');
    const move = ai.chooseMove(b);
    assert(move >= 1 && move <= 8, `Move ${move} should be in range 1-8`);
    assertTrue(b.isValidMove(move));
  });
  it('should return -1 on full board', () => {
    const wc = new WinChecker();
    const ai = new AIPlayer('O', 'X', 'easy', wc);
    const b = new Board();
    ['X','O','X','O','X','O','X','O','X'].forEach((s,i) => b.placeMark(i, s));
    assertEqual(ai.chooseMove(b), -1);
  });
  it('should return the only available cell', () => {
    const wc = new WinChecker();
    const ai = new AIPlayer('O', 'X', 'easy', wc);
    const b = new Board();
    for (let i = 0; i < 8; i++) b.placeMark(i, i % 2 === 0 ? 'X' : 'O');
    assertEqual(ai.chooseMove(b), 8);
  });
  it('should always return a valid move (100 iterations)', () => {
    const wc = new WinChecker();
    const ai = new AIPlayer('O', 'X', 'easy', wc);
    for (let trial = 0; trial < 100; trial++) {
      const b = new Board();
      b.placeMark(4, 'X');
      const move = ai.chooseMove(b);
      assert(move >= 0 && move <= 8 && move !== 4, `Invalid move: ${move}`);
    }
  });
});

describe('AIPlayer - chooseMove (Hard/Minimax)', () => {
  it('should block opponent winning move', () => {
    const wc = new WinChecker();
    const ai = new AIPlayer('O', 'X', 'hard', wc);
    const b = new Board();
    // X has [0, 1], needs 2 to win
    b.placeMark(0, 'X');
    b.placeMark(1, 'X');
    b.placeMark(4, 'O');
    const move = ai.chooseMove(b);
    assertEqual(move, 2, `AI should block at 2, got ${move}`);
  });
  it('should take winning move when available', () => {
    const wc = new WinChecker();
    const ai = new AIPlayer('O', 'X', 'hard', wc);
    const b = new Board();
    // O has [3, 4], needs 5 to win
    b.placeMark(0, 'X');
    b.placeMark(3, 'O');
    b.placeMark(1, 'X');
    b.placeMark(4, 'O');
    const move = ai.chooseMove(b);
    assertEqual(move, 5, `AI should win at 5, got ${move}`);
  });
  it('should prefer winning over blocking', () => {
    const wc = new WinChecker();
    const ai = new AIPlayer('O', 'X', 'hard', wc);
    const b = new Board();
    // O can win at 6 (column: 0,3,6) AND X threatens at 2 (row: 0,1,2)
    b.cells = ['O','X',null, 'O','X',null, null,null,null];
    const move = ai.chooseMove(b);
    assertEqual(move, 6, `AI should win at 6, got ${move}`);
  });
  it('should never lose when playing optimally (X goes first)', () => {
    // Run several full games: AI plays O with hard difficulty
    // Human (X) plays randomly. AI should never lose.
    const wc = new WinChecker();
    let aiLosses = 0;
    for (let trial = 0; trial < 50; trial++) {
      const ai = new AIPlayer('O', 'X', 'hard', wc);
      const b = new Board();
      let turn = 'X';
      while (true) {
        const empty = b.getEmptyCells();
        if (empty.length === 0) break;
        if (turn === 'X') {
          // Random human move
          const move = empty[Math.floor(Math.random() * empty.length)];
          b.placeMark(move, 'X');
        } else {
          const move = ai.chooseMove(b);
          b.placeMark(move, 'O');
        }
        const result = wc.check(b.cells);
        if (result) {
          if (result.winner === 'X') aiLosses++;
          break;
        }
        turn = turn === 'X' ? 'O' : 'X';
      }
    }
    assertEqual(aiLosses, 0, `AI lost ${aiLosses} games on hard difficulty`);
  });
  it('should never lose when AI goes first (plays X)', () => {
    const wc = new WinChecker();
    let aiLosses = 0;
    for (let trial = 0; trial < 50; trial++) {
      const ai = new AIPlayer('X', 'O', 'hard', wc);
      const b = new Board();
      let turn = 'X';
      while (true) {
        const empty = b.getEmptyCells();
        if (empty.length === 0) break;
        if (turn === 'X') {
          const move = ai.chooseMove(b);
          b.placeMark(move, 'X');
        } else {
          const move = empty[Math.floor(Math.random() * empty.length)];
          b.placeMark(move, 'O');
        }
        const result = wc.check(b.cells);
        if (result) {
          if (result.winner === 'O') aiLosses++;
          break;
        }
        turn = turn === 'X' ? 'O' : 'X';
      }
    }
    assertEqual(aiLosses, 0, `AI lost ${aiLosses} games as X on hard difficulty`);
  });
});

describe('AIPlayer - Minimax Correctness', () => {
  it('should handle board with one empty cell (AI wins)', () => {
    const wc = new WinChecker();
    const ai = new AIPlayer('O', 'X', 'hard', wc);
    const b = new Board();
    // O needs position 8 to win diagonal 2,4,6... wait no, let me construct correctly
    // O at 0,3 - needs 6 for left column win
    b.cells = ['O','X','X', 'O','X',null, null,null,null];
    const move = ai.chooseMove(b);
    assertEqual(move, 6, `AI should complete column at 6, got ${move}`);
  });
  it('should not mutate the board when computing', () => {
    const wc = new WinChecker();
    const ai = new AIPlayer('O', 'X', 'hard', wc);
    const b = new Board();
    b.placeMark(0, 'X');
    b.placeMark(4, 'O');
    const cellsBefore = [...b.cells];
    ai.chooseMove(b);
    assertDeepEqual(b.cells, cellsBefore, 'Board was mutated during AI computation');
  });
  it('should handle near-empty board without error', () => {
    const wc = new WinChecker();
    const ai = new AIPlayer('O', 'X', 'hard', wc);
    const b = new Board();
    b.placeMark(4, 'X');
    const move = ai.chooseMove(b);
    assert(move >= 0 && move <= 8 && move !== 4);
  });
});

describe('AIPlayer - Medium Difficulty', () => {
  it('should always return a valid move (100 iterations)', () => {
    const wc = new WinChecker();
    const ai = new AIPlayer('O', 'X', 'medium', wc);
    for (let trial = 0; trial < 100; trial++) {
      const b = new Board();
      b.placeMark(0, 'X');
      b.placeMark(4, 'O');
      b.placeMark(8, 'X');
      const move = ai.chooseMove(b);
      const empty = b.getEmptyCells();
      assert(empty.includes(move), `Move ${move} not in empty cells ${empty}`);
    }
  });
  it('should sometimes play optimally and sometimes randomly', () => {
    // Test that medium difficulty is neither always optimal nor always random
    // by checking move distribution over many trials on a specific board
    const wc = new WinChecker();
    const ai = new AIPlayer('O', 'X', 'medium', wc);
    const moves = new Set();
    for (let trial = 0; trial < 200; trial++) {
      const b = new Board();
      b.placeMark(0, 'X');
      b.placeMark(4, 'O');
      const move = ai.chooseMove(b);
      moves.add(move);
    }
    // If purely optimal, would always pick the same move
    // If randomized, should pick at least 2 different moves over 200 trials
    assert(moves.size >= 2, `Medium difficulty only chose ${moves.size} unique move(s) over 200 trials`);
  });
});

describe('AIPlayer - Edge: Unknown Difficulty', () => {
  it('should default to hard (bestMove) for unknown difficulty', () => {
    const wc = new WinChecker();
    const ai = new AIPlayer('O', 'X', 'unknown', wc);
    const b = new Board();
    // O at 3,4, needs 5 to win
    b.placeMark(0, 'X');
    b.placeMark(3, 'O');
    b.placeMark(1, 'X');
    b.placeMark(4, 'O');
    const move = ai.chooseMove(b);
    // Default case falls through to hard
    assertEqual(move, 5, `Unknown difficulty should default to hard, got ${move}`);
  });
});

// ============================================
// Results
// ============================================
console.log('\n');
console.log('='.repeat(50));
console.log(`Total: ${total}  Passed: ${passed}  Failed: ${failed}`);
console.log(`Pass Rate: ${((passed/total)*100).toFixed(1)}%`);
console.log('='.repeat(50));

if (failures.length > 0) {
  console.log('\nFAILURES:');
  for (const f of failures) {
    console.log(`  \x1b[31mFAIL\x1b[0m ${f.suite} > ${f.test}`);
    console.log(`       ${f.error}`);
  }
}

process.exit(failed > 0 ? 1 : 0);
