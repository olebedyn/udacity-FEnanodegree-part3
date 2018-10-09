const WIN_GAME_CELLS_NUMBER = 16;
const FIVE_STAR_MOVES_NUMBER = 12;
const RATING_CHANGE_STEP = 3;
const ZERO_STAR_MOVES_NUMBER = FIVE_STAR_MOVES_NUMBER + 5 * RATING_CHANGE_STEP;
let cells = ['fa-android', 'fa-android', 'fa-angular', 'fa-angular', 'fa-apple', 'fa-apple', 'fa-aws', 'fa-aws', 'fa-chrome', 'fa-chrome', 'fa-docker', 'fa-docker', 'fa-linux', 'fa-linux', 'fa-windows', 'fa-windows']
let clickedCells = [];
let gameStartTimestamp = 0;
let gameTimeInterval = 0; // remember interval id to be able to clear it when game ends
let movesNumber = 0;


function createBoard(cells) {
  let gameBoard = document.getElementById('game_board');

  //cleanup the board if already exists
  if (gameBoard) {
    gameBoard.remove();
  }
  gameBoard = document.createElement('div');
  gameBoard.id='game_board';
  gameBoard.classList.add('game_board');

  for (const cell of cells) {
    // create elements
    let scene = document.createElement('div');
    let cell = document.createElement('div');
    let cellFaceFront = document.createElement('div');
    let cellFaceBack = document.createElement('div');
    let innerDiv = document.createElement('div');
    let innerText = document.createElement('i');

    // add classes
    scene.classList.add('scene');
    cell.classList.add('cell');
    cellFaceFront.classList.add('cell__face', 'cell__face--front');
    cellFaceBack.classList.add('cell__face', 'cell__face--back');
    innerDiv.classList.add('cell__inner');
    innerText.classList.add('fab', card);


    // structure
    innerDiv.appendChild(innerText);
    cellFaceBack.appendChild(innerDiv);
    cell.appendChild(cellFaceFront);
    cell.appendChild(cellFaceBack);
    scene.appendChild(cell);
    scene.addEventListener('click', showCell);
    gameBoard.appendChild(scene);
  }
  document.getElementById('board').appendChild(gameBoard);
}

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffleCells(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function showCell() {
  // start count up timer when first card in clicked and game starts
  if (!gameStartTimestamp) {
    gameStartTimestamp = Math.floor(Date.now() / 1000);
    gameTimeInterval = setInterval( () => {
      let elapsedTime = Math.floor(Date.now() / 1000) - gameStartTimestamp;
      document.getElementById('timer').innerHTML = 'Time: ' + Math.floor(elapsedTime / 60) + 'm '+ (elapsedTime - Math.floor(elapsedTime / 60) * 60) + 's';
    },
      1000
    );
  }

  // prevent from 3rd cell being opened (clickedCells already 2)
  if (clickedCells.length <= 1) {
    // show card and temorarily remove onclick event to card can not be clicked when opened
    this.firstChild.classList.add('is-flipped')
    this.removeEventListener('click', showCell);
    clickedCells.push(this);

    if (clickedCells.length === 2) { // if it's the 2nd card being opened - check whether cells martch
      movesNumber++;
      updateRating();
      let match = cellsMatch(clickedCells[0], clickedCells[1]);

      //leave cells open if matched
      if (match){
        for (cell of clickedCells) {
          setTimeout((cell) => {
            cell.getElementsByClassName('cell__face--back')[0].classList.add('cell__face--back--animated', 'cell__face--back--guessed');
            isGameOver();
          }, 1000, cell);
        }
        clickedCells = [];

      } else { // close cells and add on click even back
        for (cell of clickedCells) {
          setTimeout((cell) => {
            cell.getElementsByClassName('cell__face--back')[0].classList.add('cell__face--back--animated', 'cell__face--back--wrong');
          }, 1000, cell);

          // close cells
          setTimeout((cell)=> {
                cell.firstChild.classList.remove('is-flipped')
                cell.addEventListener('click', showCell);
                clickedCells = [];
                setTimeout((cell) => {
                  cell.getElementsByClassName('cell__face--back')[0].classList.remove('cell__face--back--animated', 'cell__face--back--wrong')
                }, 500, card);
            }, 2000, card);
        }
      }
    }
  }
}

function cellsMatch(cell1, cell2) {
  return cell1.getElementsByClassName('fab')[0].classList[1] === cell2.getElementsByClassName('fab')[0].classList[1] ? true : false;
}

function isGameOver() {
  if (document.getElementsByClassName('cell__face--back--guessed').length === WIN_GAME_CELLS_NUMBER) {
    document.getElementById('popup').classList.add('overlay-visible');
  }
}

function updateRating() {
  if (movesNumber > FIVE_STAR_MOVES_NUMBER && movesNumber < ZERO_STAR_MOVES_NUMBER ){
      let numberOfBlankStars = calcNmberOfBlankStars();
      let stars = document.getElementById('rating').children
      for (let i = numberOfBlankStars - 1; i >= 0; i--){
        stars[stars.length - 1 - i].classList.replace('fas', 'far');
      }
  }
}

function calcNmberOfBlankStars() {
  // wil remove 1 star for each additional RATING_CHANGE_STEP (3) moves above FIVE_STAR_MOVES_NUMBER (12)
  return Math.ceil((movesNumber - FIVE_STAR_MOVES_NUMBER) / RATING_CHANGE_STEP);
}

function resetScoreboard(){
  // Reset timer
  clearInterval(gameTimeInterval);
  document.getElementById('timer').innerHTML = '';

  // Rating should be back to 5-star also
  for (star of document.getElementById('rating').children) {
    if (star.classList.contains('far')) {
      star.classList.replace('far', 'fas')
    }
  }
}

function initGame() {
  document.getElementById('popup').classList.remove('overlay-visible'); // hide popup in case game is re-started by 'new game' button in modal
  clickedCells = [];
  gameStarted = false;
  movesNumber = 0;
  gameStartTimestamp = 0;
  resetScoreboard();
  createBoard(shuffleCells(cells));
}

document.addEventListener('DOMContentLoaded', function() {
  initGame(cells);
});
