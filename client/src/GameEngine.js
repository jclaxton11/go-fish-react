// GameEngine.js

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function generateDeck() {
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function deal(deck, count = 7) {
  return deck.splice(0, count);
}

function checkForBooks(hand) {
  const counts = {};
  for (const card of hand) {
    counts[card.value] = (counts[card.value] || 0) + 1;
  }

  const books = [];
  for (const value in counts) {
    if (counts[value] === 4) {
      books.push(value);
    }
  }

  const remainingHand = hand.filter(card => !books.includes(card.value));
  return { books, remainingHand };
}

function askForCard(fromHand, toHand, value) {
  const matches = toHand.filter(card => card.value === value);
  const updatedToHand = toHand.filter(card => card.value !== value);
  const updatedFromHand = [...fromHand, ...matches];
  return {
    success: matches.length > 0,
    fromHand: updatedFromHand,
    toHand: updatedToHand,
  };
}

function drawCard(hand, deck) {
  if (deck.length === 0) return { hand, deck };
  return {
    hand: [...hand, deck[0]],
    deck: deck.slice(1),
  };
}

function initGame() {
  const deck = shuffle(generateDeck());
  const playerHand = deal(deck, 7);
  const opponentHand = deal(deck, 7);
  return {
    deck,
    playerHand,
    opponentHand,
    playerBooks: [],
    opponentBooks: [],
    currentPlayer: 'player', // or 'opponent'
  };
}

module.exports = {
  initGame,
  askForCard,
  drawCard,
  checkForBooks,
};
