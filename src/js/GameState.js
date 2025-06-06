export default class GameState {
  constructor() {
    this.playerTurn = true;
    this.level = 1;
    this.positions = [];
    this.maxScore = 0;
  }

  toggleTurn() {
    this.playerTurn = !this.playerTurn;
  }

  saveState() {
    return JSON.stringify({
      playerTurn: this.playerTurn,
      level: this.level,
      positions: this.positions,
      maxScore: this.maxScore
    });
  }

  loadState(state) {
    const parsedState = JSON.parse(state);
    this.playerTurn = parsedState.playerTurn;
    this.level = parsedState.level;
    this.positions = parsedState.positions;
    this.maxScore = parsedState.maxScore;
  }
}
