export default class Team {

  constructor(characters) {
    this.characters = characters;

  }

  addCharacter(character) {
    this.characters.push(character);
  }

  removeCharacter(character) {
    this.characters = this.characters.filter(char => char !== character);
  }

}

import { generateTeam } from './generators';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';

const playerTypes = [Bowman,  Swordsman,  Magician];
const playerTeam = generateTeam(playerTypes,  3,  4);

console.log(playerTeam.characters.length);
playerTeam.characters.forEach(character => {
  console.log(`Type:  ${character.type},  Level:  ${character.level}`);
});

const playerGenerator = characterGenerator(playerTypes,  2);
const character1 = playerGenerator.next().value;
console.log(character1.type);
console.log(character1.level);

const character2 = playerGenerator.next().value;
const character3 = playerGenerator.next().value;