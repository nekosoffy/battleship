const sections = document.querySelectorAll('section');
const boardOne = sections[0];
const boardTwo = sections[1];

function gridOne(array) {
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
}

function gridComputer(array) {
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
}

function handleClick(target) {
  let squares = target.parentNode.querySelectorAll('div');
  squares = [...squares];
  const coordinate = squares.indexOf(target);
  const x = Math.floor(coordinate / 10);
  const y = coordinate % 10;
  return [x, y];
}

export { gridOne, gridComputer, handleClick };
