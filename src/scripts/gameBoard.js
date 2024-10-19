const gameBoard = function createGameboard() {
  const board = Array.from({ length: 10 }, () => Array(10).fill(null));
  const invalidCoordinates = [];
  const unsinkedShips = [];
  let isHorizontal = true;

  const grid = function getGrid(x, y) {
    return board[x][y];
  };

  const rotate = function rotateShipPlacement() {
    isHorizontal = !isHorizontal;
  };

  const placeShip = function placeShipOnBoard(coordinates, object) {
    const length = object.getLength();
    const row = board[coordinates[0]];
    const centerCol = coordinates[1];

    if (row[centerCol] !== null) {
      return false;
    }

    if (isHorizontal) {
      const leftIndex = centerCol - Math.floor(length / 2);
      const rightIndex = leftIndex + length - 1;

      if (leftIndex < 0 || rightIndex >= 10) {
        return false;
      }

      const shipPosition = row.slice(leftIndex, rightIndex + 1);

      if (shipPosition.every((el) => el === null)) {
        for (let i = leftIndex; i <= rightIndex; i++) {
          row[i] = object;
        }
      } else {
        return false;
      }

      unsinkedShips.push(object);
    }

    if (!isHorizontal) {
      const upperIndex = coordinates[0] - Math.floor(length / 2);
      const lowerIndex = upperIndex + length - 1;

      for (let i = upperIndex; i <= lowerIndex; i++) {
        if (board[i] === undefined || board[i][coordinates[1]] !== null) {
          return false;
        }
      }

      for (let i = upperIndex; i <= lowerIndex; i++) {
        board[i][coordinates[1]] = object;
      }

      unsinkedShips.push(object);
    }

    return true;
  };

  const receiveAttack = function receiveEnemyAttack(x, y) {
    if (
      invalidCoordinates.some((element) => element[0] === x && element[1] === y)
    ) {
      return false;
    }

    const target = board[x][y];
    if (typeof target === 'object' && target !== null) {
      target.hit();
      board[x][y] = 'hit';
      invalidCoordinates.push([x, y]);

      if (target.isSunk() === true) {
        unsinkedShips.splice(unsinkedShips[unsinkedShips.indexOf(target)], 1);
      }
    } else if (target === null) {
      board[x][y] = 'miss';
      invalidCoordinates.push([x, y]);
    }

    return true;
  };

  const shipsSank = function checkAllShipsSank() {
    if (!unsinkedShips.length) {
      return true;
    }

    return false;
  };

  return { grid, rotate, placeShip, receiveAttack, shipsSank };
};

export default gameBoard;
