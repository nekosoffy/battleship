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
  if (playerOne.board().shipsSank()) {
    playerHasWon = true;
    announceWin('Computer has won!');
  } else if (computer.board().shipsSank()) {
    playerHasWon = true;
    announceWin('Player has won!');
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
    const sucessfulShot = computer
      .board()
      .receiveAttack(clickedCoordinate[0], clickedCoordinate[1]);
    if (sucessfulShot) {
      renderCompGrid(computer.board().boardArray());
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

computer.board().placeShip([0, 1], computer.getShip('two'));
computer.board().placeShip([1, 2], computer.getShip('threeOne'));
computer.board().placeShip([2, 3], computer.getShip('threeTwo'));
computer.board().rotate();
computer.board().placeShip([5, 5], computer.getShip('four'));
computer.board().placeShip([5, 6], computer.getShip('five'));

renderGrid(playerOne.board().boardArray());
renderCompGrid(computer.board().boardArray());

sections.forEach((el) => {
  el.addEventListener('click', (event) => {
    if (playerHasWon === false) {
      const { target } = event;
      playTurn(target);
    }
  });
});
