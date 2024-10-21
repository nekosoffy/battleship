const ship = function createShip(size) {
  if (size < 2 || size > 5) {
    return undefined;
  }

  const length = size;
  let hits = 0;
  let sunk = false;

  const hit = function takeHit() {
    hits += 1;
  };

  const isSunk = function isShipSunk() {
    if (hits >= length) {
      sunk = true;
    }

    return sunk;
  };

  const getLength = function getShipLength() {
    return length;
  };

  return { hit, isSunk, getLength };
};

export default ship;
