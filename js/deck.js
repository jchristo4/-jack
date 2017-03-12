function Deck() {
  this.suits = ['clubs', 'diamonds', 'hearts',  'spades' ];
  this.cardsPerSuit = 13;
  this.deck = [];
  this.dealtCards = [];

  this.totalCards = this.cardsPerSuit * this.suits.length;
  this.setup();
}

Deck.prototype.setup = function() {
  this.dealtCards = [];

  for (var i = 0; i < this.totalCards; i++) {
    this.deck.push(i);
  }

  this.shuffle();
};


Deck.prototype.dealCard = function() {
  return getCardProps(this.deck.shift());
};


Deck.prototype.getCardProps = function(n) {
  var suit = this.suits[Math.floor(n / this.cardsPerSuit)],
      face = n % this.cardsPerSuit,
      value = face;

  switch (face) {
    case 0:
      face = 'K';
      value = 10;
      break;
    case 1:
      face = '1';
      break;
    case 11:
      face = 'J';
      value = 10;
      break;
    case 12:
      face = 'Q';
      value = 10;
      break;
    default:
  }

  return {
    suit: suit,
    face: face,
    value: value
  };

};


Deck.prototype.resetAll = function() {
  this.setup();
};


Deck.prototype.shuffle = function() {
  var n = this.deck.length - 1,
      min = 0;

  for (var i = n; i > 1; i--) {
    var j = Math.round(Math.random() * (1 + i - min) + min);
    this.swapCards(i, j);
  }
};


Deck.prototype.swapCards = function(i, j) {
  var tmp = this.deck[i];
  this.deck[i] = this.deck[j];
  this.deck[j] = tmp;
}


Deck.prototype.displayCards = function() {
  console.log(this.deck.toString());
}