import { player, computer } from './player';
import {
  renderGrid,
  renderHiddenGrid,
  handleClick,
  announceWin,
  showShips,
  renderBtns,
  gridHighlight,
} from './render';
import '../styles/reset.css';
import '../styles/styles.css';

let playerOne = player();
let cpuPlayer = computer();
let playerHasWon = false;

const playAgainstCpuBtn = document.getElementById('play-cpu-btn');

const reset = function resetGameState() {
  playerHasWon = false;
  playerOne = player();
  cpuPlayer = computer();
};

const enableShipPlacement = function enableShipPlacementOnGrid() {
  const section = document.querySelector('section');
  const aside = document.querySelector('aside');
  const divs = section.querySelectorAll('div');

  const removeHighlight = () => {
    section.querySelectorAll('.highlight').forEach((square) => {
      square.classList.remove('highlight');
      square.classList.remove('invalid');
    });
  };

  section.addEventListener('drop', (event) => {
    event.preventDefault();
    const { target } = event;

    const sourceElemData = event.dataTransfer.getData('text');
    const sourceElemId = document.getElementById(sourceElemData);

    if (!target.classList.contains('occupied') && !target.src) {
      const coordinate = handleClick(target);
      const validCoordinate = playerOne.placeShip(
        coordinate,
        playerOne.getShip(sourceElemData),
      );

      if (validCoordinate) {
        renderGrid(playerOne.boardArray());
        sourceElemId.remove();
      }
    }

    section.querySelectorAll('.highlight').forEach((square) => {
      square.classList.remove('highlight');
      square.classList.remove('invalid');
    });

    removeHighlight();
    enableShipPlacement();

    if (!aside.childNodes.length) {
      document.querySelector('.start-btn').disabled = false;
      aside.classList.add('hidden');
    }
  });

  divs.forEach((el) => {
    if (el.childNodes.length !== 0) {
      el.classList.add('occupied');
    }

    el.addEventListener('dragover', (event) => {
      event.preventDefault();
      const rect = section.getBoundingClientRect();
      const cursorXRelativeToGrid = event.clientX - rect.left;
      const cursorYRelativeToGrid = event.clientY - rect.top;
      gridHighlight(cursorXRelativeToGrid, cursorYRelativeToGrid, rect);
    });

    el.addEventListener('dragleave', (event) => {
      event.preventDefault();
      removeHighlight();
    });
  });
};

const resetShips = function resetShipPlacement() {
  const aside = document.querySelector('aside');
  reset();
  showShips();
  renderGrid(playerOne.boardArray());
  enableShipPlacement();
  aside.classList.remove('hidden');
};

const checkWin = function checkWinCondition() {
  if (playerOne.shipsSank()) {
    playerHasWon = true;
    announceWin('Computer has won!');
  } else if (cpuPlayer.shipsSank()) {
    playerHasWon = true;
    announceWin('Player has won!');
  }
};

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const update = function updateRenderAndEventListener(callback) {
  renderHiddenGrid(cpuPlayer.boardArray());
  const section = document.querySelector('section');
  section.addEventListener('click', (event) => {
    if (playerHasWon === false) {
      const { target } = event;
      callback(target);
    }
  });
};

const playAgainstComp = function playGameAgainstComputer(target) {
  let validShot = false;

  if (target.childNodes.length === 0 && !target.src) {
    console.log(target.childNodes.length);
    const clickedCoordinate = handleClick(target);
    validShot = cpuPlayer.receiveAttack(
      clickedCoordinate[0],
      clickedCoordinate[1],
    );
  }

  if (validShot) {
    renderHiddenGrid(cpuPlayer.boardArray());
    checkWin();

    const cpuTurn = async () => {
      await delay(2000);
      renderGrid(playerOne.boardArray());

      await delay(2000);
      const cpuTarget = cpuPlayer.makePlay();
      const shot = playerOne.receiveAttack(cpuTarget[0], cpuTarget[1]);

      renderGrid(playerOne.boardArray());

      if (shot === 'ship') {
        cpuPlayer.setLastHitShot(cpuTarget);
      }

      checkWin();

      if (!playerHasWon) {
        await delay(2000);
        update(playAgainstComp);
      }
    };

    if (!playerHasWon) {
      cpuTurn();
    }
  }
};

const startGame = function startGameAfterShipPlacement() {
  const btnWrapper = document.querySelector('.btn-wrapper');
  const aside = document.querySelector('aside');
  btnWrapper.replaceChildren();
  aside.replaceChildren();
  aside.classList.add('hidden');
  update(playAgainstComp);
};

cpuPlayer.placeAllShips();

playAgainstCpuBtn.addEventListener('click', () => {
  renderGrid(playerOne.boardArray());
  playAgainstCpuBtn.remove();
  showShips();
  enableShipPlacement();
  renderBtns(resetShips, startGame);
});
