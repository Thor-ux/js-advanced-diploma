import { formatCharacterInfo } from '../src/js/utils';

describe('formatCharacterInfo',  () => {
  test('formats character info correctly',  () => {
    const character = {
      level: 1, 
      attack: 10, 
      defence: 40, 
      health: 50
    };
    expect(formatCharacterInfo(character)).toBe('🎖1 ⚔10 🛡40 ❤50');
  });

  test('handles different values correctly',  () => {
    const character = {
      level: 4, 
      attack: 25, 
      defence: 25, 
      health: 100
    };
    expect(formatCharacterInfo(character)).toBe('🎖4 ⚔25 🛡25 ❤100');
  });
});
