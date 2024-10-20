import player from './player';
import { renderGrid, renderCompGrid, handleClick, announceWin } from './render';
import '../styles/reset.css';
import '../styles/styles.css';

const sections = document.querySelectorAll('section');

let playerOneTurn = true;
let playerHasWon = false;
const playerOne = player();
const computer = player();

const checkWin = function checkWinCondition() {
  if (playerOne.shipsSank()) {
    playerHasWon = true;
    announceWin('Computer has won!');
  } else if (computer.shipsSank()) {
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

playerOne.placeShip([0, 1], playerOne.getShip('two'));
playerOne.placeShip([1, 2], playerOne.getShip('threeOne'));
playerOne.placeShip([2, 3], playerOne.getShip('threeTwo'));
playerOne.rotate();
playerOne.placeShip([5, 5], playerOne.getShip('four'));
playerOne.placeShip([5, 6], playerOne.getShip('five'));

computer.placeShip([0, 1], computer.getShip('two'));
computer.placeShip([1, 2], computer.getShip('threeOne'));
computer.placeShip([2, 3], computer.getShip('threeTwo'));
computer.rotate();
computer.placeShip([5, 5], computer.getShip('four'));
computer.placeShip([5, 6], computer.getShip('five'));

renderGrid(playerOne.boardArray());
renderCompGrid(computer.boardArray());

sections.forEach((el) => {
  el.addEventListener('click', (event) => {
    if (playerHasWon === false) {
      const { target } = event;
      playTurn(target);
    }
  });
});
