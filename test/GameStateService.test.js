import GameStateService from '../src/js/GameStateService';
import GameState from '../src/js/GameState';

describe('GameStateService', () => {
  let stateService;
  let mockStorage;

  beforeEach(() => {
    mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn()
    };
    stateService = new GameStateService(mockStorage);
  });

  test('save should store state in storage', () => {
    const state = new GameState();
    state.level = 2;
    stateService.save(state);
    expect(mockStorage.setItem).toHaveBeenCalledWith('gameState', expect.any(String));
  });

  test('load should return null if no saved state', () => {
    mockStorage.getItem.mockReturnValue(null);
    expect(stateService.load()).toBeNull();
  });

  test('load should return GameState if saved state exists', () => {
    const savedState = JSON.stringify({
      playerTurn: false,
      level: 3,
      positions: [],
      maxScore: 100
    });
    mockStorage.getItem.mockReturnValue(savedState);
    const loadedState = stateService.load();
    expect(loadedState).toBeInstanceOf(GameState);
    expect(loadedState.level).toBe(3);
  });

  test('getMaxScore should return 0 if no max score saved', () => {
    mockStorage.getItem.mockReturnValue(null);
    expect(stateService.getMaxScore()).toBe(0);
  });

  test('saveMaxScore should store max score in storage', () => {
    stateService.saveMaxScore(200);
    expect(mockStorage.setItem).toHaveBeenCalledWith('maxScore', '200');
  });
});