import { describe, it, expect } from 'vitest';
import { generateSpiralPath, generateBoardMap, calculateNewPosition, rollDice } from '../gameLogic';
import { GRID_SIZE, TILES_COUNT, WIN_STEP, LUCKY_COUNT, TRAP_COUNT } from '../../constants';

describe('generateSpiralPath', () => {
  it(`should generate exactly ${TILES_COUNT} coordinates for ${GRID_SIZE}x${GRID_SIZE} grid`, () => {
    const path = generateSpiralPath();
    expect(path.length).toBe(TILES_COUNT);
  });

  it('should cover all cells exactly once (no duplicates)', () => {
    const path = generateSpiralPath();
    const unique = new Set(path.map(p => `${p.r},${p.c}`));
    expect(unique.size).toBe(TILES_COUNT);
  });

  it('should start at (0, 0)', () => {
    const path = generateSpiralPath();
    expect(path[0]).toEqual({ r: 0, c: 0 });
  });

  it('should end at center of the grid', () => {
    const path = generateSpiralPath();
    const last = path[path.length - 1];
    const center = Math.floor(GRID_SIZE / 2);
    expect(last).toEqual({ r: center, c: center });
  });

  it('all coordinates should be within grid bounds', () => {
    const path = generateSpiralPath();
    for (const coord of path) {
      expect(coord.r).toBeGreaterThanOrEqual(0);
      expect(coord.r).toBeLessThan(GRID_SIZE);
      expect(coord.c).toBeGreaterThanOrEqual(0);
      expect(coord.c).toBeLessThan(GRID_SIZE);
    }
  });

  it('each step should be adjacent (no diagonal jumps)', () => {
    const path = generateSpiralPath();
    for (let i = 1; i < path.length; i++) {
      const dr = Math.abs(path[i].r - path[i - 1].r);
      const dc = Math.abs(path[i].c - path[i - 1].c);
      expect(dr + dc).toBe(1);
    }
  });
});

describe('generateBoardMap', () => {
  it(`should have exactly ${TILES_COUNT} tiles`, () => {
    const board = generateBoardMap();
    expect(board.length).toBe(TILES_COUNT);
  });

  it('first tile should be blank (start)', () => {
    const board = generateBoardMap();
    expect(board[0]).toBe('blank');
  });

  it('last tile should be blank (end)', () => {
    const board = generateBoardMap();
    expect(board[TILES_COUNT - 1]).toBe('blank');
  });

  it(`should have exactly ${LUCKY_COUNT} lucky tiles`, () => {
    const board = generateBoardMap();
    const luckyCount = board.filter(t => t === 'lucky').length;
    expect(luckyCount).toBe(LUCKY_COUNT);
  });

  it(`should have exactly ${TRAP_COUNT} trap tiles`, () => {
    const board = generateBoardMap();
    const trapCount = board.filter(t => t === 'trap').length;
    expect(trapCount).toBe(TRAP_COUNT);
  });

  it('remaining tiles should be blank', () => {
    const board = generateBoardMap();
    const blankCount = board.filter(t => t === 'blank').length;
    expect(blankCount).toBe(TILES_COUNT - LUCKY_COUNT - TRAP_COUNT);
  });
});

describe('calculateNewPosition', () => {
  it('should add steps to current position', () => {
    expect(calculateNewPosition(0, 3)).toBe(3);
    expect(calculateNewPosition(10, 5)).toBe(15);
  });

  it('should bounce back from WIN_STEP when overshooting', () => {
    // current=WIN_STEP-2, steps=4 → target=WIN_STEP+2, bounce: WIN_STEP-(WIN_STEP+2-WIN_STEP)=WIN_STEP-2
    expect(calculateNewPosition(WIN_STEP - 2, 4)).toBe(WIN_STEP - 2);
    // current=WIN_STEP-1, steps=3 → target=WIN_STEP+2, bounce: WIN_STEP-2
    expect(calculateNewPosition(WIN_STEP - 1, 3)).toBe(WIN_STEP - 2);
  });

  it('should land exactly on WIN_STEP', () => {
    expect(calculateNewPosition(WIN_STEP - 1, 1)).toBe(WIN_STEP);
    expect(calculateNewPosition(WIN_STEP - 3, 3)).toBe(WIN_STEP);
  });

  it('should handle starting from 0', () => {
    expect(calculateNewPosition(0, 6)).toBe(6);
  });
});

describe('rollDice', () => {
  it('should return a number between 1 and 6', () => {
    for (let i = 0; i < 100; i++) {
      const result = rollDice();
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(6);
    }
  });

  it('should return an integer', () => {
    for (let i = 0; i < 50; i++) {
      const result = rollDice();
      expect(Number.isInteger(result)).toBe(true);
    }
  });
});
