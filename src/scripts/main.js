'use strict';

const { GameClass } = require('./modules/Game.class');

const HTML_CELLS = document.querySelectorAll('.field-cell');
const Game = new GameClass(HTML_CELLS);

Game.FIELD = GameClass.makeMatrix();
Game.moveList = GameClass.makeMatrix();
Game.HTML_MATRIX = GameClass.makeMatrix(HTML_CELLS);

function eventListener(keyEvent) {
  const PREV_FIELD = Game.FIELD.map((elem) => [...elem]);

  Game.madeMove = true;

  Game.moveField(Game.FIELD, keyEvent.key, Game.moveList);
  Game.visualize(keyEvent.key, PREV_FIELD);

  for (let i = 0; i < Game.moveList.length; i++) {
    for (let j = 0; j < Game.moveList.length; j++) {
      Game.moveList[i][j] = 0;
    }
  }

  document.querySelector('.game-score').innerText = `${Game.score}`;

  if (
    !Game.canMoveHorizontaly(Game.FIELD)
    && !Game.canMoveVerticaly(Game.FIELD)
    && !Game.hasEmptySpace(Game.FIELD)
  ) {
    document.querySelector('.game-field__game-over').style.display = 'flex';
    document.removeEventListener('keydown', eventListener);

    setTimeout(() => {
      document.querySelector('.game-field__game-over').style.opacity = '1';
      document.querySelector('.message-lose').classList.remove('hidden');
    }, 10);
  } else if (Game.winStatus) {
    document.querySelector('.game-field__game-win').style.display = 'flex';
    document.removeEventListener('keydown', eventListener);

    setTimeout(() => {
      document.querySelector('.game-field__game-win').style.opacity = '1';
      document.querySelector('.message-win').classList.remove('hidden');
    }, 10);
  }
}

document.body.querySelector('.button').addEventListener('click', () => {
  document.querySelector('.message-start').classList.add('hidden');

  if (Game.isGameStarted) {
    Game.FIELD.forEach((elem, row) => {
      elem.forEach((secEl, column) => {
        Game.FIELD[row][column] = 0;
      });
    });

    HTML_CELLS.forEach((cell) => {
      cell.innerHTML = '';

      while (cell.firstChild) {
        cell.removeChild(cell.firstChild);
      }
    });

    document.body.querySelector('button').classList = 'button start';
    document.body.querySelector('button').innerHTML = 'Start';
    document.body.querySelector('.game-score').innerHTML = '0';

    document.body.querySelector('.game-field__game-over').style.display
      = 'none';

    document.body.querySelector('.game-field__game-win').style.display = 'none';

    document.body.querySelector('.message-lose').classList.add('hidden');
    document.body.querySelector('.message-win').classList.add('hidden');
    // document.body.querySelector('.message-start').classList.remove('hidden');
    Game.madeMove = false;
    Game.score = 0;
  }

  if (!Game.madeMove) {
    setTimeout(() => {
      Game.randomCell(Game.FIELD);
      Game.randomCell(Game.FIELD);
      Game.visualize(Game.FIELD, Game.HTML_MATRIX, Game.moveList);
    }, 50);

    document.querySelector('.button').classList = 'button restart';
    document.querySelector('.button').innerText = 'Restart';
    Game.isGameStarted = true;
  }

  document.addEventListener('keydown', eventListener);
});
