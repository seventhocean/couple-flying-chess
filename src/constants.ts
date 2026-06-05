/** 棋盘网格边长 */
export const GRID_SIZE = 9;

/** 棋盘总格数 */
export const TILES_COUNT = GRID_SIZE * GRID_SIZE;

/** 胜利所需步数（最后一格的索引） */
export const WIN_STEP = TILES_COUNT - 1;

/** 幸运格数量 */
export const LUCKY_COUNT = 27;

/** 陷阱格数量 */
export const TRAP_COUNT = 27;

/** 格子间像素间距 */
export const GAP_PX = 4;

/** 骰子点数范围 */
export const DICE_MIN = 1;
export const DICE_MAX = 6;

/** 拒绝任务后退步数范围 */
export const REJECT_MIN_STEPS = 1;
export const REJECT_MAX_STEPS = 3;

/** 移动动画每步延迟 (ms) */
export const MOVE_STEP_DELAY = 220;

/** 骰子动画时长 (ms) */
export const DICE_ROLL_DURATION = 1000;

/** localStorage key */
export const STORAGE_KEY = 'couples-ludo-game-state';
