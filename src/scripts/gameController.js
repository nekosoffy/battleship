import player from './player';
import { renderGrid, renderCompGrid, handleClick } from './render';
import '../styles/reset.css';
import '../styles/styles.css';

const sections = document.querySelectorAll('section');

let playerOneTurn = true;
let playerHasWon = false;
const playerOne = player();
const playerTwo = player();

const checkWin = function checkWinCondition() {
  if (playerOne.board().shipsSank()) {
    playerHasWon = true;
  } else if (playerTwo.board().shipsSank()) {
    playerHasWon = true;
  }
};

const playTurn = function playGameTurn(target) {
  if (playerOneTurn === true && target.parentNode.id === 'first-board') {
    const clickedCoordinate = handleClick(target);
    const sucessfulShot = playerOne
      .board()
      .receiveAttack(clickedCoordinate[0], clickedCoordinate[1]);

    if (sucessfulShot) {
      renderGrid(playerOne.board().boardArray());
      playerOneTurn = false;
      checkWin();
      return;
    }
  }

  if (playerOneTurn === false && target.parentNode.id === 'second-board') {
    const clickedCoordinate = handleClick(target);
    const sucessfulShot = playerTwo
      .board()
      .receiveAttack(clickedCoordinate[0], clickedCoordinate[1]);
    if (sucessfulShot) {
      renderCompGrid(playerTwo.board().boardArray());
      playerOneTurn = true;
      checkWin();
    }
  }
};

playerOne.board().placeShip([0, 1], playerOne.getShip('two'));
playerOne.board().placeShip([1, 2], playerOne.getShip('threeOne'));
playerOne.board().placeShip([2, 3], playerOne.getShip('threeTwo'));
playerOne.board().rotate();
playerOne.board().placeShip([5, 5], playerOne.getShip('four'));
playerOne.board().placeShip([5, 6], playerOne.getShip('five'));

playerTwo.board().placeShip([0, 1], playerTwo.getShip('two'));
playerTwo.board().placeShip([1, 2], playerTwo.getShip('threeOne'));
playerTwo.board().placeShip([2, 3], playerTwo.getShip('threeTwo'));
playerTwo.board().rotate();
playerTwo.board().placeShip([5, 5], playerTwo.getShip('four'));
playerTwo.board().placeShip([5, 6], playerTwo.getShip('five'));

renderGrid(playerOne.board().boardArray());
renderCompGrid(playerTwo.board().boardArray());

sections.forEach((el) => {
  el.addEventListener('click', (event) => {
    if (playerHasWon === false) {
      const { target } = event;
      playTurn(target);
    }
  });
});
