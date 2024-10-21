import { player, computer } from './player';
import { renderGrid, renderCompGrid, handleClick, announceWin } from './render';
import '../styles/reset.css';
import '../styles/styles.css';

const sections = document.querySelectorAll('section');

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

const playTurn = function playGameTurn(target) {
  if (playerOneTurn === true && target.parentNode.id === 'first-board') {
    const clickedCoordinate = handleClick(target);
    const sucessfulShot = playerOne.receiveAttack(
      clickedCoordinate[0],
      clickedCoordinate[1],
    );

    if (sucessfulShot) {
      renderGrid(playerOne.boardArray());
      playerOneTurn = false;
      checkWin();
      return;
    }
  }

  if (playerOneTurn === false && target.parentNode.id === 'second-board') {
    const clickedCoordinate = handleClick(target);
    const sucessfulShot = computer.receiveAttack(
      clickedCoordinate[0],
      clickedCoordinate[1],
    );
    if (sucessfulShot) {
      renderCompGrid(computer.boardArray());
      playerOneTurn = true;
      checkWin();
    }
  }
};

const playPC = function playGameTurn(target) {
  if (playerOneTurn === true && target.parentNode.id === 'second-board') {
    const clickedCoordinate = handleClick(target);
    const validShot = cpuPlayer.receiveAttack(
      clickedCoordinate[0],
      clickedCoordinate[1],
    );

    if (validShot) {
      renderCompGrid(cpuPlayer.boardArray());
      playerOneTurn = false;
      checkWin();

      setTimeout(() => {
        const cpuTarget = cpuPlayer.makePlay();
        const shot = playerOne.receiveAttack(cpuTarget[0], cpuTarget[1]);

        renderGrid(playerOne.boardArray());

        if (shot === 'ship') {
          cpuPlayer.setLastHitShot(cpuTarget);
        }

        playerOneTurn = true;
        checkWin();
      }, 2000);
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

renderGrid(playerOne.boardArray());
renderCompGrid(cpuPlayer.boardArray());

sections.forEach((el) => {
  el.addEventListener('click', (event) => {
    if (playerHasWon === false) {
      const { target } = event;
      playPC(target);
    }
  });
});
