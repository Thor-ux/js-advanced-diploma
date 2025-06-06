import Team from './Team';

export function* characterGenerator(allowedTypes,   maxLevel) {
  while (true) {
    const RandomType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    const level = Math.floor(Math.random() * maxLevel) + 1;
    yield new RandomType(level);
  }
}

export function generateTeam(allowedTypes,   maxLevel,   characterCount) {
  const generator = characterGenerator(allowedTypes,   maxLevel);
  return new Team(Array.from({ length:  characterCount },   () => generator.next().value));
}
