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
    return;
  }

  // show card and temorarily remove onclick event to card can not be clicked when opened
  this.firstChild.classList.add('is-flipped')
  this.removeEventListener('click', showCard);
  clickedCards.push(this);


  // if 2nd card is opened - check whether cards martch
  if (clickedCards.length === 2) {
    let match = cardsMatch(clickedCards[0], clickedCards[1]);
    //leave cards opened if matched
    if (match){
      for (card of clickedCards) {
        setTimeout((card) => {
          card.getElementsByClassName('cell__face--back')[0].classList.add('cell__face--back--guessed');
          isGameOver();
        }, 1000, card);
      }
      clickedCards = [];

    }
    // close cards and add on click even back
    else {
      for (card of clickedCards) {
        setTimeout((card) => {
          card.getElementsByClassName('cell__face--back')[0].classList.add('cell__face--back--wrong');
        }, 1000, card);
        setTimeout((card)=> {
              card.firstChild.classList.remove('is-flipped')
              card.addEventListener('click', showCard);
              clickedCards = [];
              setTimeout((card)=> {
                card.getElementsByClassName('cell__face--back')[0].classList.remove('cell__face--back--wrong')
              }, 500, card);
          }, 2000, card);
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
  if (document.getElementsByClassName('cell__face--back--guessed').length === 16) {
    alert('you won a game');
    createBoard(shuffleCards(cards));
  }
}

document.addEventListener("DOMContentLoaded", function() {
  createBoard(shuffleCards(cards));
});
