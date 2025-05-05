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

function aiChooseCard(opponentHand) {
  const counts = {};
  for (const card of opponentHand) {
    counts[card.value] = (counts[card.value] || 0) + 1;
  }

  const candidateValues = Object.keys(counts);
  if (candidateValues.length === 0) return null;

  // Randomly pick a value that the AI has at least one of
  const randomIndex = Math.floor(Math.random() * candidateValues.length);
  return candidateValues[randomIndex];
}

function opponentTurn(gameState) {

  if (gameState.currentPlayer !== 'opponent') {
    console.log("Not opponent's turn, skipping");
    return gameState;
  }

  const valueToAsk = aiChooseCard(gameState.opponentHand);
  if (!valueToAsk) {
    console.log("AI has no card to ask for, skipping turn");
    return gameState;
  }

  console.log(`AI asks for ${valueToAsk}`);

  const result = askForCard(
    gameState.opponentHand,
    gameState.playerHand,
    valueToAsk
  );

  let updatedOpponentHand = result.fromHand;
  let updatedPlayerHand = result.toHand;
  let updatedDeck = gameState.deck;

  if (!result.success) {
    // If AI's ask fails, it draws a card
    const drawResult = drawCard(updatedOpponentHand, updatedDeck);
    updatedOpponentHand = drawResult.hand;
    updatedDeck = drawResult.deck;
  }

  const { books, remainingHand } = checkForBooks(updatedOpponentHand);
  updatedOpponentHand = remainingHand;


  return {
    ...gameState,
    opponentHand: updatedOpponentHand,
    playerHand: updatedPlayerHand,
    opponentBooks: [...gameState.opponentBooks, ...books],
    deck: updatedDeck,
    currentPlayer: 'player',
  };
}




module.exports = {
  initGame,
  askForCard,
  drawCard,
  checkForBooks,
  opponentTurn,
};
