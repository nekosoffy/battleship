import { player, computer } from './player';
import {
  renderGrid,
  handleClick,
  announce,
  showShips,
  renderBtn,
  enableShipPlacement,
  toggleShipsContainer,
} from './render';
import '../styles/reset.css';
import '../styles/styles.css';

let playerOne = player();
let cpuPlayer = computer();
let playerHasWon = false;

const playAgainstCpuBtn = document.getElementById('play-cpu-btn');
const mainHeading = document.querySelector('h1');
const container = document.querySelector('.container');

const reset = function resetGameState() {
  playerHasWon = false;
  playerOne = player();
  cpuPlayer = computer();
};

const resetShips = function resetShipPlacement() {
  reset();
  renderGrid(playerOne.boardArray());
  enableShipPlacement(playerOne);
  toggleShipsContainer('on');
};

const handleRandomize = function handleRandomizedShipPlacement() {
  reset();
  playerOne.placeAllShips();
  cpuPlayer.placeAllShips();
  renderGrid(playerOne.boardArray());
  toggleShipsContainer('off');
};

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const checkWin = function checkWinCondition() {
  const replay = async () => {
    await delay(1500);
    const btnWrapper = document.querySelector('.btn-wrapper');
    btnWrapper.replaceChildren();
    btnWrapper.classList.remove('invisible');
    renderBtn('replay-btn', 'Rematch!');
  };

  if (playerOne.shipsSank()) {
    playerHasWon = true;
    announce('You were annihilated...');
    replay();
  } else if (cpuPlayer.shipsSank()) {
    playerHasWon = true;
    announce('Humans have won!');
    replay();
  }
};

const update = function updateRenderAndEventListener(callback) {
  announce('Your move!');
  renderGrid(cpuPlayer.boardArray(), 'hidden');
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
    const clickedCoordinate = handleClick(target);
    validShot = cpuPlayer.receiveAttack(
      clickedCoordinate[0],
      clickedCoordinate[1],
    );
  }

  if (validShot) {
    if (validShot === 'ship') {
      announce('Your shot hit an alien!');
    }

    renderGrid(cpuPlayer.boardArray(), 'hidden');
    checkWin();

    const cpuTurn = async () => {
      await delay(2000);
      renderGrid(playerOne.boardArray());
      announce('The aliens are attacking...');

      await delay(2000);
      const cpuTarget = cpuPlayer.makePlay();
      const shot = playerOne.receiveAttack(cpuTarget[0], cpuTarget[1]);

      renderGrid(playerOne.boardArray());

      if (shot === 'ship') {
        cpuPlayer.setLastHitShot(cpuTarget);
        announce('An unit was striked!');
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

const enterCombat = function enterCombatAfterShipPlacement() {
  const btnWrapper = document.querySelector('.btn-wrapper');
  btnWrapper.classList.add('invisible');
  toggleShipsContainer('off');
  update(playAgainstComp);
};

const startFreshGame = function startFreshGameAfterIntro() {
  const btnWrapper = document.querySelector('.btn-wrapper');
  btnWrapper.replaceChildren();
  reset();
  cpuPlayer.placeAllShips();
  announce('Position your fleet!');
  renderGrid(playerOne.boardArray());
  renderBtn('reset-btn', 'Reset Placement');
  const combatBtn = renderBtn('combat-btn', 'Begin Combat');
  renderBtn('random-btn', 'Randomize');
  toggleShipsContainer();
  showShips();
  enableShipPlacement(playerOne);
  combatBtn.disabled = true;
};

container.addEventListener('click', (event) => {
  const { target } = event;

  if (target.id === 'play-cpu-btn') {
    mainHeading.remove();
    playAgainstCpuBtn.remove();
    startFreshGame();
  }

  if (target.classList.contains('reset-btn')) {
    resetShips();
  }

  if (target.classList.contains('combat-btn')) {
    enterCombat();
  }

  if (target.classList.contains('random-btn')) {
    handleRandomize();
  }

  if (target.classList.contains('replay-btn')) {
    startFreshGame();
  }
});
