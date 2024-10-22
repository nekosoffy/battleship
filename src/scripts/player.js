import gameBoard from './gameBoard';
import ship from './ship';

const player = function createPlayer() {
  const board = gameBoard();

  const ships = {
    two: ship(2),
    threeOne: ship(3),
    threeTwo: ship(3),
    four: ship(4),
    five: ship(5),
  };

  const getShip = function getShipType(type) {
    return ships[type];
  };

  const placeAllShips = function placeAllShipsRandomly() {
    const shipsToBePlaced = Object.values(ships);
    while (shipsToBePlaced.length) {
      if (board.placeShipRandom(shipsToBePlaced.at(-1))) {
        shipsToBePlaced.pop();
      }
    }
  };

  return {
    ...board,
    getShip,
    placeAllShips,
  };
};

const computer = function createComputer() {
  const comp = player();

  const validTargets = [];

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      if ((x + y) % 2 === 0) {
        validTargets.push([x, y]);
      }
    }
  }

  let inHuntMode = true;
  const targetStack = [];
  let lastHitShot = null;
  const invalidTargets = [];

  const populateStack = function populateTargetStack() {
    const newTargets = [
      [lastHitShot[0], lastHitShot[1] - 1],
      [lastHitShot[0] - 1, lastHitShot[1]],
      [lastHitShot[0], lastHitShot[1] + 1],
      [lastHitShot[0] + 1, lastHitShot[1]],
    ].filter(
      (el) =>
        el[0] >= 0 &&
        el[0] < 10 &&
        el[1] >= 0 &&
        el[1] < 10 &&
        !invalidTargets.some(
          (target) => target[0] === el[0] && target[1] === el[1],
        ),
    );

    targetStack.push(...newTargets);
  };

  const checkStack = function checkTargetStack() {
    if (!targetStack.length) {
      inHuntMode = true;
    }
  };

  const makePlay = function makeComputerPlay() {
    const removeFromValidTargets = (array) => {
      const index = validTargets.findIndex(
        (el) => el[0] === array[0] && el[1] === array[1],
      );

      if (index !== -1) {
        validTargets.splice(index, 1);
      }
    };

    if (!inHuntMode) {
      const coordinate = targetStack.pop();
      invalidTargets.push(coordinate);
      removeFromValidTargets(coordinate);
      checkStack();
      return coordinate;
    }

    const randomTarget =
      validTargets[Math.floor(Math.random() * validTargets.length)];
    invalidTargets.push(randomTarget);
    removeFromValidTargets(randomTarget);
    return randomTarget;
  };

  const setLastHitShot = function setlastHitShotShipCoordinate(coordinate) {
    lastHitShot = coordinate;
    populateStack();
    inHuntMode = false;
  };

  return { ...comp, makePlay, setLastHitShot };
};

export { player, computer };
