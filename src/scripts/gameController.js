import ship from './ship';
import gameBoard from './gameBoard';
import player from './player';
import { gridOne, gridComputer, handleClick } from './render';
import '../styles/reset.css';
import '../styles/styles.css';

const sections = document.querySelectorAll('section');

let playerOneTurn = true;
const playerOne = player();
const playerTwo = player();

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

gridOne(playerOne.board().boardArray());
gridComputer(playerTwo.board().boardArray());

sections.forEach((el) => {
  el.addEventListener('click', (event) => {
    const { target } = event;

    if (playerOneTurn === true && target.parentNode.id === 'first-board') {
      const clickedCoordinate = handleClick(target);
      const sucessfulShot = playerOne
        .board()
        .receiveAttack(clickedCoordinate[0], clickedCoordinate[1]);

      if (sucessfulShot) {
        gridOne(playerOne.board().boardArray());
        playerOneTurn = false;
        return;
      }
    }

    if (playerOneTurn === false && target.parentNode.id === 'second-board') {
      const clickedCoordinate = handleClick(target);
      const sucessfulShot = playerTwo
        .board()
        .receiveAttack(clickedCoordinate[0], clickedCoordinate[1]);
      if (sucessfulShot) {
        gridComputer(playerTwo.board().boardArray());
        playerOneTurn = true;
      }
    }
  });
});
