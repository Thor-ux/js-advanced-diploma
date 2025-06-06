export function calcTileType(index, boardSize) {
  
  const row = Math.floor(index / boardSize);
  const col = index % boardSize;

  if (row === 0 && col === 0) return 'top-left';
  if (row === 0 && col === boardSize - 1) return 'top-right';
  if (row === boardSize - 1 && col === 0) return 'bottom-left';
  if (row === boardSize - 1 && col === boardSize - 1) return 'bottom-right';
  if (row === 0) return 'top';
  if (row === boardSize - 1) return 'bottom';
  if (col === 0) return 'left';
  if (col === boardSize - 1) return 'right';
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }
  
  if (health < 50) {
    return 'normal';
  }
  return 'high';
}

export function calcMoveRange(character, position, boardSize) {
  const range = character.type === 'swordsman' || character.type === 'undead' ? 4 :
                character.type === 'bowman' || character.type === 'vampire' ? 2 : 1;
  return getValidCells(position, range, boardSize);
}

export function calcAttackRange(character, position, boardSize) {
  const range = character.type === 'swordsman' || character.type === 'undead' ? 1 :
                character.type === 'bowman' || character.type === 'vampire' ? 2 : 4;
  return getValidCells(position, range, boardSize);
}

function getValidCells(position, range, boardSize) {
  const cells = [];
  const [row, col] = [Math.floor(position / boardSize), position % boardSize];

  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      if (i === 0 && j === 0) continue;
      const newRow = row + i;
      const newCol = col + j;
      if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
        cells.push(newRow * boardSize + newCol);
      }
    }
  }

  return cells;
}
