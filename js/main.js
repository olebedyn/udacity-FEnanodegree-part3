let cards = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]
let clicked_cards = [];

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
  if (clicked_cards.length === 2) {
    for (card of clicked_cards){
      card.className = "inner-hidden";
    }
    clicked_cards = [];
    return;
  }

  // show card and temorarily remove onclick event to card can not be clicked when opened
  const inner_box = this.firstChild;
  clicked_cards.push(inner_box);
  inner_box.className = "inner-visible";
  inner_box.parentElement.removeEventListener('click', showCard);

  // if 2nd card is opened - check whether cards martch
  if (clicked_cards.length === 2) {
    let match = cardsMatch(clicked_cards[0], clicked_cards[1]);
    //leave cards opened if matched
    if (match){
      for (card of clicked_cards) {
        card.parentElement.style.background = 'green';
        card.parentElement.classList.add('box-guessed');
      }
    }
    // close cards and add on click even back
    else {
      for (card of clicked_cards) {
            card.className = "inner-hidden";
            card.parentElement.addEventListener('click', showCard);
      }
    }
    clicked_cards = [];
  }

  // check if all cards are opened
  isGameOver();
}

function cardsMatch(card1, card2) {
  return card1.textContent === card2.textContent ? true : false;
}

function createBoard(cards) {
  let game_board = document.getElementById('game_board')
  if (game_board) {
    game_board.remove();
  }
  new_game_board = document.createElement('div');
  new_game_board.id='game_board';
  new_game_board.classList.add('game_board');
  for (const card of cards) {
    let box = document.createElement('div');
    let inner_box = document.createElement('div');
    box.classList.add('box');
    inner_box.classList.add('inner-hidden');
    inner_box.textContent = card.toString();
    box.appendChild(inner_box);
    box.addEventListener("click", showCard);
    new_game_board.appendChild(box);
  }
  document.getElementById('board').appendChild(new_game_board);
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
