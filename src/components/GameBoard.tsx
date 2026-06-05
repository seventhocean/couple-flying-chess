import { TileType, PathCoord, Player } from '../types';
import { Sparkles, Bomb, Trophy, User, UserRound } from 'lucide-react';

interface GameBoardProps {
  boardMap: TileType[];
  pathCoords: PathCoord[];
  players: Player[];
  currentTurn: number;
}

const GRID = 9;
const GAP_PX = 4;

export function GameBoard({ boardMap, pathCoords, players, currentTurn }: GameBoardProps) {
  const coordToIndex: Record<string, number> = {};
  pathCoords.forEach((coord, idx) => {
    coordToIndex[`${coord.r},${coord.c}`] = idx;
  });

  const renderTile = (r: number, c: number) => {
    const idx = coordToIndex[`${r},${c}`];
    const type = boardMap[idx];
    const isStart = idx === 0;
    const isEnd = idx === 80;

    let className = 'relative w-full h-full rounded-lg flex items-center justify-center transition-colors duration-300';

    if (isStart) {
      className += ' bg-white/10 border border-white/20';
    } else if (isEnd) {
      className += ' bg-white shadow-lg shadow-white/20';
    } else if (type === 'lucky') {
      className += ' bg-[#FF375F]/20';
    } else if (type === 'trap') {
      className += ' bg-[#BF5AF2]/20';
    } else {
      className += ' bg-[#2C2C2E]';
    }

    return (
      <div key={`${r}-${c}`} className={className}>
        {isStart && <span className="text-[7px] font-bold text-gray-400">START</span>}
        {isEnd && <Trophy className="text-[#FFD700]" size={14} />}
        {!isStart && !isEnd && type === 'lucky' && (
          <Sparkles className="text-[#FF375F]" size={12} fill="currentColor" />
        )}
        {!isStart && !isEnd && type === 'trap' && (
          <Bomb className="text-[#BF5AF2]" size={12} />
        )}
      </div>
    );
  };

  // 计算头像定位：精确对齐格子中心
  // 格子实际宽度 = (boardSize - 8*gap) / 9
  // 格子 i 的中心 = i * (tileWidth + gap) + tileWidth/2
  const tileCenter = (i: number) =>
    `calc(${(i / GRID) * 100}% + ${(i / GRID) * GAP_PX}px + ((100% - ${(GRID - 1) * GAP_PX}px) / ${GRID}) / 2)`;

  return (
    <div className="w-full max-w-[380px] aspect-square relative">
      <div
        className="absolute inset-0 grid grid-cols-9"
        style={{ gap: `${GAP_PX}px` }}
      >
        {Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 9 }).map((_, c) => renderTile(r, c))
        )}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {players.map((player) => {
          const coord = pathCoords[player.step];
          const playersOnSameTile = players.filter(p => p.step === player.step);
          const isOverlapping = playersOnSameTile.length > 1;
          const indexOnTile = playersOnSameTile.findIndex(p => p.id === player.id);

          let translate = 'translate(-50%, -50%)';
          if (isOverlapping) {
            translate = indexOnTile === 0
              ? 'translate(calc(-50% - 3px), calc(-50% - 3px))'
              : 'translate(calc(-50% + 3px), calc(-50% + 3px))';
          }

          const isActive = player.id === currentTurn;
          const isMale = player.id === 0;

          return (
            <div
              key={player.id}
              className="absolute flex items-center justify-center transition-all duration-500 ease-in-out z-20"
              style={{
                top: tileCenter(coord.r),
                left: tileCenter(coord.c),
                transform: translate,
                width: 0,
                height: 0,
              }}
            >
              <div
                className={`relative flex items-center justify-center w-7 h-7 rounded-full shadow-lg transition-transform duration-300 ${isActive ? 'avatar-pulse scale-110' : ''}`}
                style={{
                  backgroundColor: player.color,
                  border: '2px solid white'
                }}
              >
                {isMale ? (
                  <User className="text-white w-4 h-4" />
                ) : (
                  <UserRound className="text-white w-4 h-4" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
