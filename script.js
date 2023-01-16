let player = {
  name: "Bank",
  chips: 1000,
};

let playerCards = [];
let sum = 0;
let dealerCards = [];
let dealerSum = 0;
let bet = 0;
let isAlive = false;
let message = "";
const messageEl = document.getElementById("message-el");
const sumEl = document.getElementById("sum-el");
const playerEl = document.getElementById("player-el");
const betEl = document.getElementById("bet-el");
const dealerSumEl = document.getElementById("dealer-sum");
const playerCardsDiv = document.querySelector(".player");
const dealerCardsDiv = document.querySelector(".dealer");

//Event listener for selecting bet amount
document.addEventListener("click", (e) => {
  if (
    e.target.className === "chip" &&
    player.chips >= e.target.id &&
    !isAlive
  ) {
    player.chips -= parseInt(e.target.id);
    playerEl.textContent = player.name + ": $" + player.chips;
    bet += parseInt(e.target.id);
    betEl.textContent = "Bet: $" + bet;
  }
});

playerEl.textContent = player.name + ": $" + player.chips;

function getRandomCard() {
  const deck = [2, 3, 4, 5, 6, 7, 8, 9, 10, "A", "J", "Q", "K"];
  const suits = ["Spades", "Diamonds", "Hearts", "Clubs"];

  let randCard = randomNumber(13); //select random card
  let suit = suits[randomNumber(4)]; //select random suit

  if (randCard > 9) {
    return {
      card: deck[randCard],
      value: 10, //value 10 for J, Q, and K
      suit: suit,
    };
  } else if (randCard === 9) {
    return {
      card: deck[randCard],
      value: 11, //value 11 for A
      suit: suit,
    };
  } else {
    return {
      card: deck[randCard],
      value: deck[randCard],
      suit: suit,
    };
  }
}

function startGame() {
  if (!isAlive && bet > 0) {
    isAlive = true;
    let firstCard = getRandomCard();
    let secondCard = getRandomCard();
    playerCards = [firstCard, secondCard];

    if (firstCard.card === "A" && secondCard.card === "A") {
      sum = 12;
    } else {
      sum = firstCard.value + secondCard.value;
    }

    let dealerFirst = getRandomCard();
    let dealerSecond = getRandomCard();
    dealerCards = [dealerFirst, dealerSecond];
    if (dealerFirst.card === "A" && dealerSecond.card === "A") {
      dealerSum = 12;
    } else {
      dealerSum = dealerFirst.value + dealerSecond.value;
    }
    betEl.textContent = "Bet: $" + bet;
    renderGame();
  }
}

function renderGame() {
  //player's cards
  sumEl.textContent = "Player's sum: " + sum;
  playerCardsDiv.innerHTML = null;
  renderCards(playerCardsDiv, playerCards);

  //render dealer's cards
  dealerCardsDiv.innerHTML = `<img
          id="dealer-first-card"
          src="./cards/blueBack.webp"
          alt="Dealer's first card"
          width="100px"
          height="155.633px"
        />
        <img
          id="dealer-second-card"
          src="./cards/${dealerCards[1].card}-${dealerCards[1].suit}.webp"
          alt="Dealer's second card"
          width="100px"
          height="155.633px"
        />`;
  dealerSumEl.textContent = "Dealer's sum: ?";

  if (sum <= 20) {
    message = "Do you want to draw a new card or stand?";
  } else if (sum === 21) {
    message = "You've got Blackjack!";
    player.chips += bet * 2;
    isAlive = false;
    bet = 0;
    betEl.textContent = "Bet: $0";
    playerEl.textContent = player.name + ": $" + player.chips;
  } else {
    message = "You're out of the game!";
    isAlive = false;
    bet = 0;
    betEl.textContent = "Bet: $0";
    playerEl.textContent = player.name + ": $" + player.chips;
  }
  messageEl.textContent = message;
}

function newCard() {
  if (isAlive) {
    let card = getRandomCard();
    if (card.card === "A" && sum + card.value > 21) {
      sum += 1;
      playerCards.push(card);
    } else {
      sum += card.value;
      playerCards.push(card);
    }
    renderGame();
  }
}

function stand() {
  if (isAlive) {
    //shows dealer's hidden card
    dealerCardsDiv.innerHTML = null;
    renderCards(dealerCardsDiv, dealerCards);
    dealerSumEl.textContent = "Dealer's sum: " + dealerSum;

    //checks if dealer has already won
    if (dealerSum > sum) {
      message = "Dealer Wins!";
      bet = 0;
      betEl.textContent = "Bet: $0";
      playerEl.textContent = player.name + ": $" + player.chips;
    }

    //If the dealer hasn't won with 2 cards then the dealer draws cards till their sum is more than player's sum
    while (dealerSum <= sum) {
      let card = getRandomCard();
      dealerSum += card.value;
      dealerCards.push(card);
      dealerCardsDiv.innerHTML = null;
      renderCards(dealerCardsDiv, dealerCards);
      dealerSumEl.textContent = "Dealer's sum: " + dealerSum;
    }

    //checks winner
    if (dealerSum <= 21) {
      //dealer wins if their sum is less or equal to 21
      message = "Dealer Wins!";
      bet = 0;
      betEl.textContent = "Bet: $0";
      playerEl.textContent = player.name + ": $" + player.chips;
    } else {
      //player wins if dealer's sum exceeded  21
      message = "You Win!";
      player.chips += bet * 2;
      bet = 0;
      betEl.textContent = "Bet: $0";
      playerEl.textContent = player.name + ": $" + player.chips;
    }
    messageEl.textContent = message;
    isAlive = false;
  }
}

//render cards
function renderCards(element, array) {
  for (let i = 0; i < array.length; i++) {
    const img = document.createElement("img");
    let imgSrc = `./cards/${array[i].card}-${array[i].suit}.webp`;
    img.setAttribute("src", imgSrc);
    img.setAttribute("alt", "card image");
    img.setAttribute("width", "100px");
    img.setAttribute("height", "155.633px");
    element.appendChild(img);
  }
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}
