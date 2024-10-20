import gameBoard from './gameBoard';
import ship from './ship';

const player = function createNewPlayer() {
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

  return {
    ...board,
    getShip,
  };
};

export default player;
