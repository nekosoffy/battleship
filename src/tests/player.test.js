import { player, computer } from '../scripts/player';

describe('player function', () => {
  let testPlayer;

  beforeEach(() => {
    testPlayer = player();
  });

  it("Player's ship instances are unique.", () => {
    const testShipOne = testPlayer.getShip('two');
    const testShipOne2 = testPlayer.getShip('two');
    expect(testShipOne).toBe(testShipOne2);

    const testShipTwo = testPlayer.getShip('threeOne');
    const testShipTwo2 = testPlayer.getShip('threeOne');
    expect(testShipTwo).toBe(testShipTwo2);

    const testShipThree = testPlayer.getShip('threeTwo');
    const testShipThree2 = testPlayer.getShip('threeTwo');
    expect(testShipThree).toBe(testShipThree2);

    const testShipFour = testPlayer.getShip('four');
    const testShipFour2 = testPlayer.getShip('four');
    expect(testShipFour).toBe(testShipFour2);

    const testShipFive = testPlayer.getShip('five');
    const testShipFive2 = testPlayer.getShip('five');
    expect(testShipFive).toBe(testShipFive2);
  });

  it('Returns undefined for invalid ship access.', () => {
    const nonExistentShip = testPlayer.getShip('invalidType');
    expect(nonExistentShip).toBeUndefined();
  });

  it('Separate player instances have unique ships.', () => {
    const testPlayerTwo = player();

    expect(testPlayer.getShip('two')).not.toBe(testPlayerTwo.getShip('two'));
  });

  it('Separate player instances have unique boards.', () => {
    const testPlayerTwo = player();

    testPlayer.placeShip([2, 2], testPlayer.getShip('two'));
    expect(testPlayerTwo.grid(2, 2)).toBe(null);
  });
});

describe('computer function', () => {
  let testComputer;

  beforeEach(() => {
    testComputer = computer();
  });

  it('Computer returns valid targets in hunt mode.', () => {
    const play = testComputer.makePlay();
    expect(play).toBeDefined();
    expect(play).toHaveLength(2);
    expect(play[0]).toBeGreaterThanOrEqual(0);
    expect(play[0]).toBeLessThan(10);
    expect(play[1]).toBeGreaterThanOrEqual(0);
    expect(play[1]).toBeLessThan(10);
  });

  it('Computer returns different targets every time.', () => {
    const play1 = testComputer.makePlay();
    const play2 = testComputer.makePlay();
    const play3 = testComputer.makePlay();
    expect(play1).not.toEqual(play2);
    expect(play2).not.toEqual(play3);
  });

  test('Computer leaves hunt mode, allowing it to target adjacent coordinates of a previous hit.', () => {
    const shot = [2, 2];
    testComputer.setLastHitShot(shot);
    const play = testComputer.makePlay();

    const validAdjacentTargets = [
      [3, 2],
      [2, 3],
      [1, 2],
      [2, 1],
    ];

    expect(validAdjacentTargets).toContainEqual(play);
  });

  test('Computer returns valid targets when not in hunt mode.', () => {
    const shot = [2, 2];
    testComputer.setLastHitShot(shot);
    const play = testComputer.makePlay();

    expect(play).toBeDefined();
    expect(play).toHaveLength(2);
    expect(play[0]).toBeGreaterThanOrEqual(0);
    expect(play[0]).toBeLessThan(10);
    expect(play[1]).toBeGreaterThanOrEqual(0);
    expect(play[1]).toBeLessThan(10);
  });

  test('Computer goes through all adjacent coordinates before leaving hunt mode.', () => {
    const shot = [2, 2];
    testComputer.setLastHitShot(shot);

    const plays = [];
    for (let i = 0; i < 4; i++) {
      plays.push(testComputer.makePlay());
    }

    const validAdjacentTargets = [
      [3, 2],
      [2, 3],
      [1, 2],
      [2, 1],
    ];

    expect(plays).toEqual(expect.arrayContaining(validAdjacentTargets));
    expect(plays.length).toBe(4);

    plays.forEach((play) => {
      expect(validAdjacentTargets).toContainEqual(play);
    });

    const nextPlay1 = testComputer.makePlay();
    const nextPlay2 = testComputer.makePlay();

    expect(validAdjacentTargets).not.toContainEqual(nextPlay1);
    expect(validAdjacentTargets).not.toContainEqual(nextPlay2);
  });
});
