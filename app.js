let tryTimes = 0;
let score = 0;
const shuffledCards = [];
let firstCards = null;

const cardsPanel = document.querySelector('#cardsPanel');
const triedElement = document.querySelector('#tryTimes');
const scoreElement = document.querySelector('#score');
const cardMap = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
];

// shuffle the cards
function shuffle() {
  // generate 0 ~ 51
  const cards = [...Array(52).keys()];

  // shuffle cards
  for (let i = 52; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * i);
    shuffledCards.push(cards[randomIndex]); // 1 ~ 52
    cards.splice(randomIndex, 1);
  }
}

function indexToCardnum(index) {
  return Math.floor(index / 4);
}

// render cards to the page
function renderCards() {
  for (let i = 0; i < shuffledCards.length; i++) {
    let container;
    switch (i % 4) {
      case 0:
        container = cardsPanel.children[0];
        break;
      case 1:
        container = cardsPanel.children[1];
        break;
      case 2:
        container = cardsPanel.children[2];
        break;
      case 3:
        container = cardsPanel.children[3];
        break;
    }

    // pattern
    const patterns = { 0: 'club', 1: 'diamond', 2: 'heart', 3: 'spade' };
    let patternHTML;
    switch (shuffledCards[i] % 4) {
      case 0:
        patternHTML = `<img class="align-self-center" src="https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png"></img>`;
        break;
      case 1:
        patternHTML = `<i class="align-self-center fa-solid fa-diamond" style="color: #c21414;"></i>`;
        break;
      case 2:
        patternHTML = `<i class="align-self-center fa-solid fa-heart" style="color: #c21414;"></i>`;
        break;
      case 3:
        patternHTML = `<img class="align-self-center" src="https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png"></img>`;
        break;
    }

    container.innerHTML += `
      <div class="main-card position-relative">
        <div class="card card-back">
          <img src="https://assets-lighthouse.alphacamp.co/uploads/image/file/9222/ExportedContentImage_00.png" data-card-id="${
            shuffledCards[i]
          }" class="img-fluid rounded" alt="">
        </div>
        <div class="card card-front position-absolute top-0 d-flex flex-column justify-content-md-around" style="z-index: -1;">
          <span class="" style="">${
            cardMap[Math.floor(shuffledCards[i] / 4)]
          }</span>
          ${patternHTML}
          <span class="" style="transform: rotate(-180deg)">${
            cardMap[Math.floor(shuffledCards[i] / 4)]
          }</span>
        </div>
      </div>
    `;
  }
}

// update score and tried times
function renderUpdatedScore() {
  triedElement.textContent = `You've tried: ${tryTimes}`;
  scoreElement.textContent = `Score: ${score}`;
}

// check cards are same
function checkSame(cardIndex) {
  if (firstCards === null) {
    firstCards = cardIndex;
  } else {
    // check same
    if (indexToCardnum(firstCards) === indexToCardnum(cardIndex)) {
      score += 10;
      renderUpdatedScore();
      setTimeout(() => {
        fillCardsColor(firstCards);
        fillCardsColor(cardIndex);
        checkCompleted();
      }, 300);
    } else {
      tryTimes += 1;
      renderUpdatedScore();
      cardsPanel.style.pointerEvents = 'none';
      setTimeout(() => {
        closeCards(firstCards);
        closeCards(cardIndex);
      }, 1000);
    }
  }
}

function closeCards(cardIndex) {
  let cardImg = document.querySelector(`[data-card-id="${cardIndex}"]`);
  cardImg.parentElement.classList.toggle('flip-card-back');
  cardImg.parentElement.nextElementSibling.classList.toggle('flip-card-front');
  cardsPanel.style.pointerEvents = 'auto';
  firstCards = null;
}

function fillCardsColor(cardIndex) {
  let cardImg = document.querySelector(`[data-card-id="${cardIndex}"]`);
  cardImg.parentElement.nextElementSibling.style.backgroundColor = '#b4d9ef';
  firstCards = null;
}

// add card click event
function cardClickEvent() {
  cardsPanel.addEventListener('click', (event) => {
    if (event.target.matches('img')) {
      event.target.parentElement.classList.toggle('flip-card-back');
      event.target.parentElement.nextElementSibling.classList.toggle(
        'flip-card-front'
      );
      checkSame(parseInt(event.target.dataset.cardId));
    }
  });
}

function checkCompleted() {
  if (score === 260) {
    alert('You win the Game~~');
  }
}

shuffle();
renderCards();
cardClickEvent();
