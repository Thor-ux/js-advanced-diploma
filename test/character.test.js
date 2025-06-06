import Character from '../src/js/Character';
import Bowman from '../src/js/characters/Bowman';
import Swordsman from '../src/js/characters/Swordsman';
import Magician from '../src/js/characters/Magician';
import { characterGenerator,   generateTeam } from '../src/js/generators';

describe('Character',   () => {
  test('Cannot instantiate Character directly',   () => {
    expect(() => new Character(1,   'generic')).toThrow();
  });

  test('Can instantiate inherited classes',   () => {
    expect(() => new Bowman(1)).not.toThrow();
    expect(() => new Swordsman(1)).not.toThrow();
    expect(() => new Magician(1)).not.toThrow();
  });

  test('Level 1 characters have correct stats',   () => {
    const bowman = new Bowman(1);
    expect(bowman.attack).toBe(25);
    expect(bowman.defence).toBe(25);

    const swordsman = new Swordsman(1);
    expect(swordsman.attack).toBe(40);
    expect(swordsman.defence).toBe(10);

    const magician = new Magician(1);
    expect(magician.attack).toBe(10);
    expect(magician.defence).toBe(40);
  });
});

describe('Generators',   () => {
  test('characterGenerator produces infinite characters',   () => {
    const types = [Bowman,   Swordsman,   Magician];
    const generator = characterGenerator(types,   4);
    
    for (let i = 0; i < 100; i++) {
      const character = generator.next().value;
      expect(types).toContain(character.constructor);
      expect(character.level).toBeGreaterThanOrEqual(1);
      expect(character.level).toBeLessThanOrEqual(4);
    }
  });

  test('generateTeam creates correct number of characters within level range',   () => {
    const types = [Bowman,   Swordsman,   Magician];
    const team = generateTeam(types,   4,   5);
    
    expect(team.characters.length).toBe(5);
    team.characters.forEach(char => {
      expect(char.level).toBeGreaterThanOrEqual(1);
      expect(char.level).toBeLessThanOrEqual(4);
    });
  });
});