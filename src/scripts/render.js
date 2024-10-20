const sections = document.querySelectorAll('section');
const boardOne = sections[0];
const boardTwo = sections[1];

const renderGrid = function renderPlayerOneGrid(array) {
  boardOne.replaceChildren();
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

    boardOne.appendChild(div);
  });
};

const renderCompGrid = function renderComputerGrid(array) {
  boardTwo.replaceChildren();
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

    boardTwo.appendChild(div);
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

export { renderGrid, renderCompGrid, handleClick, announceWin };
