const WIN_GAME_CARDS_NUMBER = 16;
const FIVE_STAR_MOVES_NUMBER = 12;
const RATING_CHANGE_STEP = 3;
const ZERO_STAR_MOVES_NUMBER = 12 + 5 * RATING_CHANGE_STEP;
let cards = ['fa-android', 'fa-android', 'fa-angular', 'fa-angular', 'fa-apple', 'fa-apple', 'fa-aws', 'fa-aws', 'fa-chrome', 'fa-chrome', 'fa-docker', 'fa-docker', 'fa-linux', 'fa-linux', 'fa-windows', 'fa-windows']
let clickedCards = [];
let gameStarted = false;
let gameTimeInterval = 0; // remember interval id to be able to clear it when game ends
let gameStartTimestamp = 0;
let movesNumber = 0;

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffleCards(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function showCard() {
  // start count up timer when first card in clicked and game starts
  if (!gameStarted) {
    gameStarted = true;
    gameStartTimestamp = Math.floor(Date.now() / 1000);
    gameTimeInterval = setInterval( () => {
      let elapsedTime = Math.floor(Date.now() / 1000) - gameStartTimestamp;
      document.getElementById("timer").innerHTML = "Time: " + Math.floor(elapsedTime / 60) + 'm '+ (elapsedTime - Math.floor(elapsedTime / 60) * 60) + "s";
    },
      1000
    );
  }

  // prevent from 3rd cell being opened
  if (clickedCards.length <= 1) {
    // show card and temorarily remove onclick event to card can not be clicked when opened
    this.firstChild.classList.add('is-flipped')
    this.removeEventListener('click', showCard);
    clickedCards.push(this);
    // if it's the 2nd card being opened - check whether cards martch
    if (clickedCards.length === 2) {
      movesNumber++;
      updateRating();
      let match = cardsMatch(clickedCards[0], clickedCards[1]);
      //leave cards opened if matched
      if (match){
        for (card of clickedCards) {
          setTimeout((card) => {
            card.getElementsByClassName('cell__face--back')[0].classList.add('cell__face--back--animated', 'cell__face--back--guessed');
            isGameOver();
          }, 1000, card);
        }
        clickedCards = [];

      }
      // close cards and add on click even back
      else {
        for (card of clickedCards) {
          setTimeout((card) => {
            card.getElementsByClassName('cell__face--back')[0].classList.add('cell__face--back--animated', 'cell__face--back--wrong');
          }, 1000, card);

          // close cards
          setTimeout((card)=> {
                card.firstChild.classList.remove('is-flipped')
                card.addEventListener('click', showCard);
                clickedCards = [];
                setTimeout((card)=> {
                  card.getElementsByClassName('cell__face--back')[0].classList.remove('cell__face--back--animated', 'cell__face--back--wrong')
                }, 500, card);
            }, 2000, card);
        }
      }
    }
  }
}

function cardsMatch(card1, card2) {
  return card1.getElementsByClassName('fab')[0].classList[1] === card2.getElementsByClassName('fab')[0].classList[1] ? true : false;
}

function createBoard(cards) {
  let gameBoard = document.getElementById('game_board')
  if (gameBoard) {
    gameBoard.remove();
  }
  newGameBoard = document.createElement('div');
  newGameBoard.id='game_board';
  newGameBoard.classList.add('game_board');
  for (const card of cards) {
    // create elements
    let scene = document.createElement('div');
    let cell = document.createElement('div');
    let cellFaceFront = document.createElement('div');
    let cellFaceBack = document.createElement('div');
    let innerDiv = document.createElement('div');
    let innerText = document.createElement('i');

    // add casses
    scene.classList.add('scene');
    cell.classList.add('cell');
    cellFaceFront.classList.add('cell__face', 'cell__face--front');
    cellFaceBack.classList.add('cell__face', 'cell__face--back');
    innerDiv.classList.add('cell__inner');
    innerText.classList.add('fab', card);
    innerDiv.appendChild(innerText);
    cellFaceBack.appendChild(innerDiv);
    cell.appendChild(cellFaceFront);
    cell.appendChild(cellFaceBack);
    scene.appendChild(cell);
    scene.addEventListener('click', showCard);
    newGameBoard.appendChild(scene);
  }
  document.getElementById('board').appendChild(newGameBoard);
}

function isGameOver() {
  if (document.getElementsByClassName('cell__face--back--guessed').length === WIN_GAME_CARDS_NUMBER) {
    document.getElementById('popup').classList.add('overlay-visible');
  }
}

function updateRating() {
  if (movesNumber > FIVE_STAR_MOVES_NUMBER && movesNumber < ZERO_STAR_MOVES_NUMBER ){
      let numberOfBlankStars = calcNmberOfStars();
      let stars = document.getElementById('rating').children
      for (let i=numberOfBlankStars-1; i >= 0; i--){
        stars[stars.length - 1 - i].classList.replace('fas', 'far');
      }
  }
}

function calcNmberOfStars() {
  // wil remove 1 stat for each 3 moves above 12
  return Math.ceil((movesNumber - FIVE_STAR_MOVES_NUMBER) / RATING_CHANGE_STE);
}

function resetScoreboard(){
  // Reset timer
  clearInterval(gameTimeInterval);
  document.getElementById("timer").innerHTML = "";

  // Rating should be back to 5-star also
  for (star of document.getElementById("rating").children) {
    if (star.classList.contains('far')) {
      star.classList.replace('far', 'fas')
    }
  }
}

function initGame() {
  // hide popup in case game is re-started by 'new game' button in modal
  if (document.getElementById('popup').classList.contains('overlay-visible')){
      document.getElementById('popup').classList.remove('overlay-visible');
  }
  clickedCards = [];
  gameStarted = false;
  movesNumber = 0;
  gameStartTimestamp = 0;
  resetScoreboard();
  createBoard(shuffleCards(cards));
}

document.addEventListener("DOMContentLoaded", function() {
  initGame(cards);
});
