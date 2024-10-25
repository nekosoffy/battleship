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
      div.classList.add('miss');
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

      div.addEventListener('mouseenter', () => {
        div.classList.add('hover');
      });

      div.addEventListener('mouseleave', () => {
        div.classList.remove('hover');
      });
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
  const shipsContainer = document.querySelector('aside');

  function createShipElement(num, size) {
    const div = create(
      'div',
      shipsContainer,
      'ship',
      'draggable',
      'true',
      size,
    );

    for (let i = 0; i < num; i++) {
      const img = create('img', div, '', 'src', airplane, '', '');
      img.draggable = false;
    }

    return div;
  }

  const shipSizes = [
    { num: 2, size: 'two' },
    { num: 3, size: 'threeOne' },
    { num: 3, size: 'threeTwo' },
    { num: 4, size: 'four' },
    { num: 5, size: 'five' },
  ];

  shipSizes.forEach(({ num, size }) => createShipElement(num, size));

  const divs = shipsContainer.querySelectorAll('div');
  divs.forEach((el) => {
    el.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text', event.target.id);
      currentShipSize = event.target.children.length;
    });
  });
};

const toggleShipsContainer = function toggleShipsContainerVisibility(mode) {
  const shipsContainer = document.querySelector('aside');
  const combatBtn = document.querySelector('.combat-btn');

  if (mode === 'off') {
    shipsContainer.replaceChildren();
    shipsContainer.classList.add('hidden');
    combatBtn.disabled = false;
    return;
  }

  if (mode === 'on') {
    shipsContainer.replaceChildren();
    showShips();
    shipsContainer.classList.remove('hidden');
    combatBtn.disabled = true;
    return;
  }

  if (shipsContainer.childNodes.length === 0) {
    shipsContainer.classList.toggle('hidden');
    combatBtn.disabled = false;
    return;
  }

  if (shipsContainer.classList.contains('hidden')) {
    showShips();
    shipsContainer.classList.toggle('hidden');
    combatBtn.disabled = true;
  }
};

const renderBtn = function renderNewButton(className, text) {
  const btnWrapper = document.querySelector('.btn-wrapper');
  const button = create('button', btnWrapper, className, null, '', '', text);
  return button;
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

    toggleShipsContainer();
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
  const infoBox = document.querySelector('.intro-wrapper');
  infoBox.replaceChildren();
  create('h2', infoBox, 'information', null, '', '', string);
};

const addCursor = function addAimCursor() {
  const section = document.querySelector('section');
  section.classList.add('field');
};

export {
  renderGrid,
  handleClick,
  showShips,
  renderBtn,
  gridHighlight,
  removeHighlights,
  enableShipPlacement,
  announce,
  toggleShipsContainer,
  addCursor,
};
