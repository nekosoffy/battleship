import { player, computer } from './player';
import {
  renderGrid,
  handleClick,
  announce,
  showShips,
  renderBtns,
  enableShipPlacement,
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

const resetShips = function resetShipPlacement() {
  const aside = document.querySelector('aside');
  reset();
  showShips();
  renderGrid(playerOne.boardArray());
  enableShipPlacement(playerOne);
  aside.classList.remove('hidden');
};

const checkWin = function checkWinCondition() {
  if (playerOne.shipsSank()) {
    playerHasWon = true;
    announce('Computer has won!');
  } else if (cpuPlayer.shipsSank()) {
    playerHasWon = true;
    announce('Player has won!');
  }
};

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const update = function updateRenderAndEventListener(callback) {
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
    renderGrid(cpuPlayer.boardArray(), 'hidden');
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
  btnWrapper.classList.add('invisible');
  aside.replaceChildren();
  aside.classList.add('hidden');
  update(playAgainstComp);
};

cpuPlayer.placeAllShips();

playAgainstCpuBtn.addEventListener('click', () => {
  renderGrid(playerOne.boardArray());
  playAgainstCpuBtn.remove();
  showShips();
  enableShipPlacement(playerOne);
  renderBtns(resetShips, startGame);
});
