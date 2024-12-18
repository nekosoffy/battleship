import gameBoard from '../scripts/gameBoard';
import ship from '../scripts/ship';

describe('gameBoard function', () => {
  let testBoard;
  let testShip;

  beforeEach(() => {
    testBoard = gameBoard();
    testShip = ship(3);
  });

  it('Board is initialized only with null elements.', () => {
    testBoard.boardArray().forEach((el) => {
      expect(el).toEqual(Array(10).fill(null));
    });
  });

  it('Ship is placed at the specified coordinate, horizontally.', () => {
    testBoard.placeShip([3, 5], testShip);
    expect(testBoard.grid(3, 4)).toBe(testShip);
    expect(testBoard.grid(3, 5)).toBe(testShip);
    expect(testBoard.grid(3, 6)).toBe(testShip);
  });

  it('Ship is placed at the specified coordinate, vertically.', () => {
    testBoard.rotate();
    testBoard.placeShip([3, 5], testShip);
    expect(testBoard.grid(2, 5)).toBe(testShip);
    expect(testBoard.grid(3, 5)).toBe(testShip);
    expect(testBoard.grid(4, 5)).toBe(testShip);
  });

  it("Ship isn't placed horizontally if parts of it go out of bounds.", () => {
    testBoard.placeShip([5, 0], testShip);
    testBoard.placeShip([5, 9], testShip);
    expect(testBoard.grid(5, 0)).toBe(null);
    expect(testBoard.grid(5, 9)).toBe(null);
  });

  it("Ship isn't placed vertically if parts of it go out of bounds.", () => {
    testBoard.rotate();
    testBoard.placeShip([0, 5], testShip);
    testBoard.placeShip([9, 5], testShip);
    expect(testBoard.grid(0, 5)).toBe(null);
    expect(testBoard.grid(9, 5)).toBe(null);
  });

  it('Overlapping ship placements are unsuccessful.', () => {
    const testShipTwo = ship(3);
    expect(testBoard.placeShip([4, 5], testShip)).toBe(true);
    expect(testBoard.placeShip([4, 4], testShipTwo)).toBe(false);
  });

  it('Ship can be placed randomly', () => {
    function getShipCoordinates(board, targetShip) {
      const coordinates = [];
      board.flat().forEach((grid, index) => {
        if (grid === targetShip) {
          coordinates.push(index);
        }
      });
      return coordinates;
    }

    const placements = new Set();
    const runs = 100;

    for (let i = 0; i < runs; i++) {
      const testBoardTwo = gameBoard();
      testBoardTwo.placeShipRandom(testShip);

      const coordinates = getShipCoordinates(
        testBoardTwo.boardArray(),
        testShip,
      );

      placements.add(coordinates.toString());
    }

    expect(placements.size).toBeGreaterThan(runs / 2);
  });

  it('Ship takes hits appropriately.', () => {
    testBoard.placeShip([5, 5], testShip);
    testBoard.receiveAttack(5, 4);
    testBoard.receiveAttack(5, 5);
    testBoard.receiveAttack(5, 6);
    expect(testShip.isSunk()).toBe(true);
  });

  it('Board reports whether or not all of its ships have sunk.', () => {
    const testShipTwo = ship(3);
    testBoard.placeShip([5, 5], testShip);
    testBoard.placeShip([2, 2], testShipTwo);
    testBoard.receiveAttack(5, 4);
    testBoard.receiveAttack(5, 5);
    testBoard.receiveAttack(5, 6);
    expect(testBoard.shipsSank()).toBe(false);
    testBoard.receiveAttack(2, 1);
    testBoard.receiveAttack(2, 2);
    testBoard.receiveAttack(2, 3);
    expect(testBoard.shipsSank()).toBe(true);
  });

  it('Board keeps track of missed attacks.', () => {
    testBoard.receiveAttack(4, 5);
    expect(testBoard.grid(4, 5)).toBe('miss');
  });

  it('Attacks on the same spot are unsuccessful.', () => {
    expect(testBoard.receiveAttack(4, 5)).toBe(true);
    expect(testBoard.receiveAttack(4, 5)).toBe(false);
  });
});
