import { calcMoveRange, calcAttackRange } from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.selectedCharacter = null;
    this.possibleMoves = [];
    this.possibleAttacks = [];
  }

  init() {
    this.playerTypes = [Bowman, Swordsman, Magician];
    this.enemyTypes = [Vampire, Undead, Daemon];
    
    this.playerTeam = generateTeam(this.playerTypes, 1, 2);
    this.enemyTeam = generateTeam(this.enemyTypes, 1, 2);

    this.positions = this.positionCharacters();
    
    this.gamePlay.drawUi('prairie');
    this.gamePlay.redrawPositions(this.positions);

    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

moveCharacter(character, newPosition) {
  const oldPosition = character.position;
  character.position = newPosition;
  this.gamePlay.deselectCell(oldPosition);
  this.selectedCharacter = null;
  this.gamePlay.redrawPositions(this.positions);
  this.endTurn();
}

attackCharacter(attacker, target) {
  const damage = Math.max(attacker.character.attack - target.character.defence, attacker.character.attack * 0.1);
  target.character.health -= Math.floor(damage);

  this.gamePlay.showDamage(target.position, damage).then(() => {
    if (target.character.health <= 0) {
      this.positions = this.positions.filter(char => char !== target);
    }
    this.gamePlay.redrawPositions(this.positions);

    if (this.checkGameOver()) {
      return;
    }

    this.endTurn();
  });
}

endTurn() {
  this.gameState.toggleTurn();
  this.selectedCharacter = null;
  if (!this.gameState.playerTurn) {
    this.computerTurn();
  }
}

computerTurn() {

  const enemyCharacters = this.positions.filter(char => !this.isPlayerCharacter(char.character));
  for (const enemy of enemyCharacters) {
    const attackRange = calcAttackRange(enemy.character, enemy.position, this.gamePlay.boardSize);
    const playerInRange = this.positions.find(char => 
      this.isPlayerCharacter(char.character) && attackRange.includes(char.position)
    );

    if (playerInRange) {
      this.attackCharacter(enemy, playerInRange);
      return;
    }
  }

  const enemyToMove = enemyCharacters[Math.floor(Math.random() * enemyCharacters.length)];
  const moveRange = calcMoveRange(enemyToMove.character, enemyToMove.position, this.gamePlay.boardSize);
  const nearestPlayerPosition = this.findNearestPlayerPosition(enemyToMove.position);
  
  if (nearestPlayerPosition !== null) {
    const bestMove = moveRange.reduce((best, move) => 
      this.getDistance(move, nearestPlayerPosition) < this.getDistance(best, nearestPlayerPosition) ? move : best
    );
    this.moveCharacter(enemyToMove, bestMove);
  } else {
    this.endTurn();
  }
}

findNearestPlayerPosition(fromPosition) {
  const playerPositions = this.positions
    .filter(char => this.isPlayerCharacter(char.character))
    .map(char => char.position);

  return playerPositions.reduce((nearest, position) => 
    this.getDistance(fromPosition, position) < this.getDistance(fromPosition, nearest) ? position : nearest
  , null);
}

getDistance(pos1, pos2) {
  const [row1, col1] = [Math.floor(pos1 / this.gamePlay.boardSize), pos1 % this.gamePlay.boardSize];
  const [row2, col2] = [Math.floor(pos2 / this.gamePlay.boardSize), pos2 % this.gamePlay.boardSize];
  return Math.max(Math.abs(row1 - row2), Math.abs(col1 - col2));
}

levelUp() {
  for (const char of this.positions) {
    if (this.isPlayerCharacter(char.character)) {
      char.character.level += 1;
      char.character.attack = Math.max(char.character.attack, char.character.attack * (80 + char.character.health) / 100);
      char.character.defence = Math.max(char.character.defence, char.character.defence * (80 + char.character.health) / 100);
      char.character.health = Math.min(100, char.character.health + 80);
    }
  }
  this.gamePlay.redrawPositions(this.positions);
}

startNewLevel() {
  this.level += 1;
  if (this.level > 4) {
    this.gameOver(true);
    return;
  }

  const themes = ['prairie', 'desert', 'arctic', 'mountain'];
  this.gamePlay.drawUi(themes[this.level - 1]);

  const enemyLevel = Math.floor((this.level - 1) / 2) + 1;
  const enemyCount = this.level + 1;
  this.enemyTeam = generateTeam(this.enemyTypes, enemyLevel, enemyCount);
  
  const newPositions = this.positionCharacters(this.enemyTeam, true);
  this.positions = [...this.positions.filter(char => this.isPlayerCharacter(char.character)), ...newPositions];

  this.gamePlay.redrawPositions(this.positions);
}

checkGameOver() {
  const playerCharacters = this.positions.filter(char => this.isPlayerCharacter(char.character));
  const enemyCharacters = this.positions.filter(char => !this.isPlayerCharacter(char.character));

  if (playerCharacters.length === 0) {
    this.gameOver(false);
    return true;
  } else if (enemyCharacters.length === 0) {
    this.levelUp();
    this.startNewLevel();
    return true;
  }
  return false;
}

gameOver(playerWon) {
  this.gamePlay.showMessage(playerWon ? 'Congratulations! You completed all levels!' : 'Game Over. You lost!');
  this.gamePlay.cellClickListeners = [];
  this.gamePlay.cellEnterListeners = [];
  this.gamePlay.cellLeaveListeners = [];
  
  if (playerWon) {
    const score = this.calculateScore();
    if (score > this.stateService.getMaxScore()) {
      this.stateService.saveMaxScore(score);
    }
  }
}

calculateScore() {
  
  return this.positions.reduce((score, char) => {
    if (this.isPlayerCharacter(char.character)) {
      score += char.character.health;
    }
    return score;
  }, 0);
}

newGame() {
  this.level = 1;
  this.positions = [];
  this.init();
}
}
