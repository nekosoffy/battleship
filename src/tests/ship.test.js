import { ship } from '../scripts/index';

describe('ship function', () => {
  it("Ship's endurance matches ship's length", () => {
    const testShipSinking = (length) => {
      const testShip = ship(length);
      expect(testShip.isSunk()).toBe(false);

      for (let i = 0; i < length; i++) {
        testShip.hit();
        if (i < length - 1) {
          expect(testShip.isSunk()).toBe(false);
        } else {
          expect(testShip.isSunk()).toBe(true);
        }
      }
    };

    testShipSinking(2);
    testShipSinking(3);
    testShipSinking(4);
    testShipSinking(5);
  });
});
