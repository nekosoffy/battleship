import alien from '../images/alien.png';
import airplane from '../images/plane.svg';
import fire from '../images/fire.svg';
import energy from '../images/energy.svg';

let currentShipSize;

const main = document.querySelector('main');

const create = function createDOMElement(
  element,
  parent,
  newClass = '',
  attribute = null,
  atrValue = '',
  id = '',
  textContent = '',
) {
  const el = document.createElement(element);

  if (newClass) {
    el.classList.add(newClass);
  }

  if (attribute) {
    el.setAttribute(attribute, atrValue);
  }

  if (id) {
    el.id = id;
  }

  if (textContent) {
    el.textContent = textContent;
  }

  parent.appendChild(el);
  return el;
};

const renderGrid = function renderGridWithShips(array) {
  main.replaceChildren();
  const section = document.createElement('section');
  const flatArray = array.flat();
  flatArray.forEach((el) => {
    const div = document.createElement('div');

    if (el === 'miss') {
      create('img', div, '', 'src', energy, '', '');
    }

    if (typeof el === 'object' && el !== null) {
      create('img', div, '', 'src', airplane, '', '');
    }

    if (el === 'hit') {
      create('img', div, '', 'src', airplane, '', '');
      div.classList.add('hit');
    }

    div.addEventListener('dragover', (event) => {
      event.preventDefault();
      const shipSize = event.dataTransfer.getData('size');
      const index = [...section.children].indexOf(div);

      for (let i = 0; i < shipSize; i++) {
        const highlightSquare = section.children[index + i];
        if (highlightSquare) {
          highlightSquare.classList.add('highlight');
        }
      }
    });

    section.appendChild(div);
  });
  main.prepend(section);
};

const renderHiddenGrid = function renderGridWithHiddenShips(array) {
  main.replaceChildren();
  const section = document.createElement('section');
  const flatArray = array.flat();
  flatArray.forEach((el) => {
    const div = document.createElement('div');

    if (el === 'miss') {
      create('img', div, '', 'src', fire, '', '');
    }

    if (el === 'hit') {
      create('img', div, '', 'src', alien, '', '');
      div.classList.add('hit');
    }

    section.appendChild(div);
  });

  main.prepend(section);
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

const showShips = function showShipsForPlacement() {
  function cheese(num, element) {
    for (let i = 0; i < num; i++) {
      const img = create('img', element, '', 'src', airplane, '', '');
      img.draggable = false;
    }
  }

  const aside = document.querySelector('aside');

  if (aside.classList.contains('hidden')) {
    aside.classList.remove('hidden');
  }

  aside.replaceChildren();

  const divOne = create('div', aside, 'ship', 'draggable', 'true', 'two');
  const divTwo = create('div', aside, 'ship', 'draggable', 'true', 'threeOne');
  const divThree = create(
    'div',
    aside,
    'ship',
    'draggable',
    'true',
    'threeTwo',
  );
  const divFour = create('div', aside, 'ship', 'draggable', 'true', 'four');
  const divFive = create('div', aside, 'ship', 'draggable', 'true', 'five');

  const divs = aside.querySelectorAll('div');

  cheese(2, divOne);
  cheese(3, divTwo);
  cheese(3, divThree);
  cheese(4, divFour);
  cheese(5, divFive);

  divs.forEach((el) => {
    el.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text', event.target.id);
      currentShipSize = event.target.children.length;
    });
  });
};

const renderBtns = function renderShipPlacementButtons(
  onReset,
  onStart,
  btnWrapper = document.querySelector('.btn-wrapper'),
) {
  const createButton = (className, text, callback) => {
    const button = create('button', btnWrapper, className, null, '', '', text);
    button.addEventListener('click', callback);
    return button;
  };

  createButton('reset-btn', 'Reset Placement', onReset);
  const startBtn = createButton('start-btn', 'Start Game', onStart);
  startBtn.disabled = true;
};

const gridHighlight = function gridHightlightWhenDragging(x, y, rect) {
  const section = document.querySelector('section');

  // Calculate cell size
  const cellWidth = rect.width / 10;
  const cellHeight = rect.height / 10;

  // Find the nearest cell center
  const column = Math.floor(x / cellWidth);
  const row = Math.floor(y / cellHeight);

  // Calculate the target index based on nearest cell
  const targetIndex = row * 10 + column;
  const index = Math.max(0, Math.min(targetIndex, 99));
  const columns = 10;

  section.querySelectorAll('.highlight').forEach((square) => {
    square.classList.remove('highlight');
  });
  section.querySelectorAll('.invalid').forEach((square) => {
    square.classList.remove('invalid');
  });

  const startIndex = index - Math.floor(currentShipSize / 2);
  let isValid = true;

  for (let i = 0; i < currentShipSize; i++) {
    const highlightSquareIndex = startIndex + i;

    if (
      highlightSquareIndex >= 0 &&
      highlightSquareIndex < section.children.length &&
      Math.floor(highlightSquareIndex / columns) === Math.floor(index / columns)
    ) {
      const highlightSquare = section.children[highlightSquareIndex];

      if (highlightSquare.classList.contains('occupied')) {
        isValid = false;
      }

      highlightSquare.classList.add('highlight');
    } else {
      isValid = false;
    }
  }

  if (!isValid) {
    for (let i = 0; i < currentShipSize; i++) {
      const highlightSquareIndex = startIndex + i;
      if (
        highlightSquareIndex >= 0 &&
        highlightSquareIndex < section.children.length &&
        Math.floor(highlightSquareIndex / columns) ===
          Math.floor(index / columns)
      ) {
        const highlightSquare = section.children[highlightSquareIndex];
        highlightSquare.classList.add('invalid');
      }
    }
  }
};

export {
  renderGrid,
  renderHiddenGrid,
  handleClick,
  announceWin,
  showShips,
  renderBtns,
  gridHighlight,
};
