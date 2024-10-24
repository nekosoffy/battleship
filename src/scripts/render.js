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

const renderGrid = function renderGridWithShips(array, mode = 'open') {
  const openGrid = (el, div) => {
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
  };

  const hiddenGrid = (el, div) => {
    if (el === 'miss') {
      create('img', div, '', 'src', fire, '', '');
    }

    if (el === 'hit') {
      create('img', div, '', 'src', alien, '', '');
      div.classList.add('hit');
    }
  };

  main.replaceChildren();
  const section = document.createElement('section');
  const flatArray = array.flat();
  flatArray.forEach((el) => {
    const div = document.createElement('div');

    if (mode === 'open') {
      openGrid(el, div);
    }

    if (mode === 'hidden') {
      hiddenGrid(el, div);
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
  const startBtn = createButton('start-btn', 'Begin Combat', onStart);
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

const removeHighlights = function removeHightlightsFromGrid() {
  const section = document.querySelector('section');
  section.querySelectorAll('.highlight').forEach((square) => {
    square.classList.remove('highlight');
    square.classList.remove('invalid');
  });
};

const enableShipPlacement = function enableShipPlacementOnGrid(player) {
  const aside = document.querySelector('aside');
  const section = document.querySelector('section');
  const divs = section.querySelectorAll('div');

  section.addEventListener('drop', (event) => {
    event.preventDefault();
    const { target } = event;
    const draggableData = event.dataTransfer.getData('text');
    const draggableID = document.getElementById(draggableData);

    if (!target.classList.contains('occupied') && !target.src) {
      const coordinate = handleClick(target);
      const validCoordinate = player.placeShip(
        coordinate,
        player.getShip(draggableData),
      );

      if (validCoordinate) {
        renderGrid(player.boardArray());
        draggableID.remove();
        enableShipPlacement(player);
      }
    }

    if (!aside.childNodes.length) {
      document.querySelector('.start-btn').disabled = false;
      aside.classList.add('hidden');
    }

    removeHighlights();
  });

  section.addEventListener('dragover', (event) => {
    event.preventDefault();
    const rect = section.getBoundingClientRect();
    const cursorXRelativeToGrid = event.clientX - rect.left;
    const cursorYRelativeToGrid = event.clientY - rect.top;
    gridHighlight(cursorXRelativeToGrid, cursorYRelativeToGrid, rect);
  });

  section.addEventListener('dragleave', (event) => {
    event.preventDefault();
    removeHighlights();
  });

  divs.forEach((el) => {
    if (el.childNodes.length !== 0) {
      el.classList.add('occupied');
    }
  });
};

const announce = function announceInformation(string) {
  const heading = document.querySelector('h1');
  heading.textContent = string;
};

export {
  renderGrid,
  handleClick,
  showShips,
  renderBtns,
  gridHighlight,
  removeHighlights,
  enableShipPlacement,
  announce,
};
