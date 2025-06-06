export default class Character {

  constructor(level,  type) {
    
    if (new.target === Character) {
      throw new Error('Cannot instantiate Character directly. Use specific character classes instead.');
    }
    
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 100;
    this.type = type;

    if (this.level < 1 || this.level > 4) {
      throw new Error('Character level must be between 1 and 4');
    }
  }
}