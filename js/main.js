let cards = ['fa-android', 'fa-android', 'fa-angular', 'fa-angular', 'fa-apple', 'fa-apple', 'fa-aws', 'fa-aws', 'fa-chrome', 'fa-chrome', 'fa-docker', 'fa-docker', 'fa-linux', 'fa-linux', 'fa-windows', 'fa-windows']
let clickedCards = [];

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffleCards(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function showCard() {
  // prevent from 3rd cell being opened
  if (clickedCards.length === 2) {
    for (card of clickedCards){
      this.firstChild.classList.remove('is-flipped');
    }
    clickedCards = [];
    return;
  }

  // show card and temorarily remove onclick event to card can not be clicked when opened
  this.firstChild.classList.add('is-flipped');
  const innerText = this.getElementsByClassName('cell__inner');
  clickedCards.push(innerText);
  this.removeEventListener('click', showCard);

  // if 2nd card is opened - check whether cards martch
  if (clickedCards.length === 2) {
    let match = cardsMatch(clickedCards[0], clickedCards[1]);
    //leave cards opened if matched
    if (match){
      for (card of clickedCards) {
        card.parentElement.classList.add('box-guessed');
      }
    }
    // close cards and add on click even back
    else {
      for (card of clickedCards) {
            card.className = "cell__inner";
            card.parentElement.addEventListener('click', showCard);
      }
    }
    clickedCards = [];
  }

  // check if all cards are opened
  isGameOver();
}

function cardsMatch(card1, card2) {
  return card1.textContent === card2.textContent ? true : false;
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
  if (document.getElementsByClassName('box-guessed').length == 16) {
    alert('you won a game');
    createBoard(shuffleCards(cards));
  }
}

document.addEventListener("DOMContentLoaded", function() {
  createBoard(shuffleCards(cards));
});
