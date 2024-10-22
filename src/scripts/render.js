const board = document.querySelector('section');

const renderGrid = function renderGridWithShips(array) {
  board.replaceChildren();
  const flatArray = array.flat();
  flatArray.forEach((el) => {
    const div = document.createElement('div');

    if (el === 'miss') {
      div.textContent = 'X';
    }

    if (typeof el === 'object' && el !== null) {
      div.textContent = 'O';
    }

    if (el === 'hit') {
      div.textContent = 'O';
      div.classList.add('hit');
    }

    board.appendChild(div);
  });
};

const renderHiddenGrid = function renderGridWithHiddenShips(array) {
  board.replaceChildren();
  const flatArray = array.flat();
  flatArray.forEach((el) => {
    const div = document.createElement('div');

    if (el === 'miss') {
      div.textContent = 'X';
    }

    if (el === 'hit') {
      div.textContent = 'O';
      div.classList.add('hit');
    }

    board.appendChild(div);
  });
};

const handleClick = function handleGridClick(target) {
  let squares = target.parentNode.querySelectorAll('div');
  squares = [...squares];
  const coordinate = squares.indexOf(target);
  const x = Math.floor(coordinate / 10);
  const y = coordinate % 10;
  return [x, y];
};

const announceWin = function announceRoundWinner(string) {
  const heading = document.querySelector('h2');
  heading.textContent = string;
};

export { renderGrid, renderHiddenGrid, handleClick, announceWin };
