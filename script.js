let player = {
    name: "Mike",
    chips: 1000
}

const deck = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'A', 'J', 'Q', 'K']
let cards = []
let sum = 0
let dealer = []
let dealerSum = 0
let bet = 0
let isAlive = false
let message = ""
const messageEl = document.getElementById("message-el")
const sumEl = document.getElementById("sum-el")
const cardsEl = document.getElementById("cards-el")
const playerEl = document.getElementById("player-el")
const betEl = document.getElementById("bet-el")
const dealerCardsEl = document.getElementById("dealer-cards")
const dealerSumEl = document.getElementById("dealer-sum")

document.addEventListener("click", e => {
    if (e.target.className === "chip" && player.chips >= e.target.id && !isAlive) {
        player.chips -= parseInt(e.target.id)
        playerEl.textContent = player.name + ": $" + player.chips
        bet += parseInt(e.target.id)
        betEl.textContent = "Bet: $" + bet
    }
})

playerEl.textContent = player.name + ": $" + player.chips

function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13)
    if (randomNumber > 9) {
        return {card: deck[randomNumber], value: 10}
    } else if (randomNumber === 9) {
        return {card: deck[randomNumber], value: 11}
    } else {
        return {card: deck[randomNumber], value: deck[randomNumber]}
    }
}

function startGame() {
    if (!isAlive && bet > 0) {
        isAlive = true
        let firstCard = getRandomCard()
        let secondCard = getRandomCard()
        cards = [firstCard.card, secondCard.card]
        if (firstCard.card === "A" && secondCard.card === "A") {
            sum = 12
        } else {
            sum = firstCard.value + secondCard.value
        }        
        let dealerFirst = getRandomCard()
        let dealerSecond = getRandomCard()
        dealer = ["?", dealerFirst.card, dealerSecond.card]
        if (dealerFirst.card === "A" && dealerSecond.card === "A") {
            dealerSum = 12
        } else {
            dealerSum = dealerFirst.value + dealerSecond.value
        }
        betEl.textContent = "Bet: $" + bet
        renderGame()
    }
}

function renderGame() {
    //player's cards
    cardsEl.textContent = "Player's cards: " 
    renderCards(cardsEl, cards)
    //dealer's cards
    dealerCardsEl.textContent = "Dealer's cards: ? " + dealer[1]
    dealerSumEl.textContent = "Dealer's sum: ?"
    sumEl.textContent = "Player's sum: " + sum
    if (sum <= 20) {
        message = "Do you want to draw a new card or stand?"
    } else if (sum === 21) {
        message = "You've got Blackjack!"
        player.chips += bet * 2
        isAlive = false
        bet = 0
        betEl.textContent = "Bet: $0"
        playerEl.textContent = player.name + ": $" + player.chips

    } else {
        message = "You're out of the game!"
        isAlive = false
        bet = 0
        betEl.textContent = "Bet: $0"
        playerEl.textContent = player.name + ": $" + player.chips
    }
    messageEl.textContent = message
}

function newCard() {
    if (isAlive) {
        let card = getRandomCard()
        if (card.card === "A" && sum + card.value > 21) {
            sum += 1
            cards.push(card.card)
        } else {
            sum += card.value
            cards.push(card.card)
        }
        renderGame()        
    }
}

function stand() {
    if (isAlive) {
        //shows dealer's cards
        dealer.shift() //remove "?" hidden first card
        dealerCardsEl.textContent = "Dealer's cards: "
        renderCards(dealerCardsEl, dealer)
        dealerSumEl.textContent = "Dealer's sum: " + dealerSum
        //checks if dealer has already won
        if (dealerSum > sum) {
            message = "Dealer Wins!"
            bet = 0
            betEl.textContent = "Bet: $0"
            playerEl.textContent = player.name + ": $" + player.chips
        } 
        //dealer draws
        while (dealerSum <= sum) {
            let card = getRandomCard()
            dealerSum += card.value
            dealer.push(card.card)
            dealerCardsEl.textContent = "Dealer's cards: "
            renderCards(dealerCardsEl, dealer)
            dealerSumEl.textContent = "Dealer's sum: " + dealerSum           
        } 
        //checks winner
        if (dealerSum <= 21) {
            message = "Dealer Wins!"
            bet = 0
            betEl.textContent = "Bet: $0"
            playerEl.textContent = player.name + ": $" + player.chips
        } else {
            message = "You Win!"
            player.chips += bet * 2
            bet = 0
            betEl.textContent = "Bet: $0"
            playerEl.textContent = player.name + ": $" + player.chips
        }
        messageEl.textContent = message
        isAlive = false
        }
}

function renderCards(element, array) {
    for (let i = 0; i < array.length ; i++) {
        element.textContent += array[i] + " "
    }
}