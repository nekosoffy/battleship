import { player, computer } from './player';
import {
  renderGrid,
  renderHiddenGrid,
  handleClick,
  announceWin,
} from './render';
import '../styles/reset.css';
import '../styles/styles.css';

const section = document.querySelector('section');

let playerOneTurn = true;
let playerHasWon = false;
const playerOne = player();
const cpuPlayer = computer();

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

const playPC = function playGameTurn(target) {
  if (playerOneTurn === true) {
    const clickedCoordinate = handleClick(target);
    const validShot = cpuPlayer.receiveAttack(
      clickedCoordinate[0],
      clickedCoordinate[1],
    );

    if (validShot) {
      renderHiddenGrid(cpuPlayer.boardArray());
      playerOneTurn = false;
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
          renderHiddenGrid(cpuPlayer.boardArray());

          playerOneTurn = true;
        }
      };

      if (!playerHasWon) {
        cpuTurn();
      }
    }
  }
};

playerOne.placeShip([0, 1], playerOne.getShip('two'));
playerOne.placeShip([1, 2], playerOne.getShip('threeOne'));
playerOne.placeShip([2, 3], playerOne.getShip('threeTwo'));
playerOne.rotate();
playerOne.placeShip([5, 5], playerOne.getShip('four'));
playerOne.placeShip([5, 6], playerOne.getShip('five'));

cpuPlayer.placeShip([0, 1], cpuPlayer.getShip('two'));
cpuPlayer.placeShip([1, 2], cpuPlayer.getShip('threeOne'));
cpuPlayer.placeShip([2, 3], cpuPlayer.getShip('threeTwo'));
cpuPlayer.rotate();
cpuPlayer.placeShip([5, 5], cpuPlayer.getShip('four'));
cpuPlayer.placeShip([5, 6], cpuPlayer.getShip('five'));

renderHiddenGrid(cpuPlayer.boardArray());

section.addEventListener('click', (event) => {
  if (playerHasWon === false) {
    const { target } = event;
    playPC(target);
  }
});
