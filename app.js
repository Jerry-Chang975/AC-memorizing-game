const GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished',
};

const cardsPanel = document.querySelector('#cardsPanel');

const views = {
  renderCards(container, renderHTML) {
    container.innerHTML += renderHTML;
  },
  renderScore() {
    document.querySelector('#score').textContent = `Score: ${models.score}`;
    document.querySelector(
      '#completedScore'
    ).textContent = `Score: ${models.score}`;
  },
  renderTriedTimes() {
    document.querySelector(
      '#tryTimes'
    ).textContent = `You've tried: ${models.triedTimes}`;
    document.querySelector(
      '#completedTriedTimes'
    ).textContent = `You've tried: ${models.triedTimes}`;
  },
  closeCards(cardsIndex) {
    cardsIndex.forEach((cardIndex) => {
      let cardImg = document.querySelector(`[data-card-id="${cardIndex}"]`);
      // setTimeout(() => {
      cardImg.parentElement.classList.remove('flip-card-back');
      cardImg.parentElement.nextElementSibling.classList.remove(
        'flip-card-front'
      );
      cardImg.parentElement.nextElementSibling.style.backgroundColor =
        '#ffffff';
      // }, 300);
    });
  },
  fillCardsColor(cardsIndex) {
    cardsIndex.forEach((cardIndex) => {
      let cardImg = document.querySelector(`[data-card-id="${cardIndex}"]`);
      cardImg.parentElement.nextElementSibling.style.backgroundColor =
        '#b4d9ef';
    });
  },
  flipAnimation(element) {
    element.parentElement.classList.add('flip-card-back');
    element.parentElement.nextElementSibling.classList.add('flip-card-front');
  },
  wrongCardsAnimation(cardsIndex) {
    setTimeout(() => {
      cardsIndex.forEach((cardIndex) => {
        let cardImg = document.querySelector(`[data-card-id="${cardIndex}"]`);
        cardImg.parentElement.nextElementSibling.style.backgroundColor =
          '#ffd6f5';
      });
    }, 200);
  },
};

const controllers = {
  currentState: GAME_STATE.FirstCardAwaits,
  cardMap: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
  generateCards() {
    const shuffledCards = utility.shuffleCardsIndex();
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

      let cardsHTML = `
      <div class="main-card position-relative">
        <div class="card card-back">
          <img src="https://assets-lighthouse.alphacamp.co/uploads/image/file/9222/ExportedContentImage_00.png" data-card-id="${
            shuffledCards[i]
          }" class="img-fluid rounded" alt="">
        </div>
        <div class="card card-front position-absolute top-0 d-flex flex-column justify-content-md-around" style="z-index: -1;">
          <span class="" style="">${
            this.cardMap[Math.floor(shuffledCards[i] / 4)]
          }</span>
          ${patternHTML}
          <span class="" style="transform: rotate(-180deg)">${
            this.cardMap[Math.floor(shuffledCards[i] / 4)]
          }</span>
        </div>
      </div>
    `;
      views.renderCards(container, cardsHTML);
    }
  },
  dispatchCardAction(card) {
    const cardIndex = parseInt(card.dataset.cardId);
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        views.flipAnimation(card);
        models.revealedCards.push(cardIndex);
        this.currentState = GAME_STATE.SecondCardAwaits;
        break;

      case GAME_STATE.SecondCardAwaits:
        views.flipAnimation(card);
        models.revealedCards.push(cardIndex);
        if (
          utility.indexToCardNum(models.revealedCards[0]) ===
          utility.indexToCardNum(models.revealedCards[1])
        ) {
          this.currentState = GAME_STATE.CardsMatched;
          views.renderScore((models.score += 10));
          // wait for animation completed
          setTimeout(this.pairCards, 200);
          this.checkCompleted();
        } else {
          this.currentState = GAME_STATE.CardsMatchFailed;
          views.renderTriedTimes(models.triedTimes++);
          views.wrongCardsAnimation(models.revealedCards);
          // keep revealed state in 1 sec.
          setTimeout(this.resetCards, 1000);
        }
        break;
    }
  },
  checkCompleted() {
    if (models.score === 260) {
      this.currentState = GAME_STATE.GameFinished;
      document.querySelector('#completed').style.visibility = 'visible';
    } else {
      this.currentState = GAME_STATE.FirstCardAwaits;
    }
  },
  pairCards() {
    views.fillCardsColor(models.revealedCards);
    models.revealedCards = [];
  },
  resetCards() {
    views.closeCards(models.revealedCards);
    models.revealedCards = [];
    controllers.currentState = GAME_STATE.FirstCardAwaits;
  },
};

const models = {
  revealedCards: [],
  triedTimes: 0,
  score: 0,
};

const utility = {
  // shuffle the cards
  shuffleCardsIndex() {
    const shuffledCards = [];
    // generate 0 ~ 51
    const cards = [...Array(52).keys()];
    // shuffle cards
    for (let i = 52; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * i);
      shuffledCards.push(cards[randomIndex]); // 1 ~ 52
      cards.splice(randomIndex, 1);
    }
    return shuffledCards;
  },
  indexToCardNum(index) {
    return Math.floor(index / 4);
  },
};

// add card click event
controllers.generateCards();
cardsPanel.addEventListener('click', (event) => {
  if (event.target.matches('img')) {
    controllers.dispatchCardAction(event.target);
  }
});
