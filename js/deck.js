'use strict';

function Deck() {
  this.suits = ['clubs', 'diamonds', 'hearts',  'spades' ];
  this.cardsPerSuit = 13;
  this.dealtCards = [];

  this.totalCards = this.cardsPerSuit * this.suits.length;
  this.deck = [];
  this.setup();
}

Deck.prototype.setup = function() {
  this.dealtCards = [];

  for (let i = 0; i < this.totalCards; i++) {
    this.deck.push(i);
  }

  this.shuffle();
};


Deck.prototype.drawCard = function() {
  return this.getCardProps(this.deck.shift());
};


Deck.prototype.getCardProps = function(n) {
  let suit = this.suits[Math.floor(n / this.cardsPerSuit)],
      face = n % this.cardsPerSuit,
      value = Math.min(10, face);

  switch (face) {
    case 0:
      face = 'K'; value = 10; break;
    case 1:
      face = 'A'; break;
    case 11:
      face = 'J'; break;
    case 12:
      face = 'Q'; break;
    default:
  }

  return {
    suit: suit,
    face: face,
    value: value,
    faceDown: false
  };
};


Deck.prototype.pushCardsAtEnd = function(cards) {
  this.deck.concat(cards);
};


Deck.prototype.resetAll = function() {
  this.setup();
};


Deck.prototype.shuffle = function() {
  let n = this.deck.length - 1,
      min = 0;

  for (let i = n; i > 1; i--) {
    let j = Math.round(Math.random() * (1 + i - min) + min);
    this.swapCards(i, j);
  }
};


Deck.prototype.swapCards = function(i, j) {
  let tmp = this.deck[i];
  this.deck[i] = this.deck[j];
  this.deck[j] = tmp;
};


Deck.prototype.displayCards = function() {
  console.log(this.deck.toString());
};