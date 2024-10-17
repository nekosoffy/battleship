const ship = function createShip(size) {
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

  return { hit, isSunk, length };
};

export { ship };
