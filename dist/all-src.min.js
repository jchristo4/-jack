'use strict';

function Blackjack() {
  this.gameCount = 0;
  this.deck = new Deck();
  this.player = new Player();
  this.dealer = new Player();
  this.ui = new UI();

  this.addEventListeners();
}


Blackjack.prototype.newGame = function() {
  this.inProgress = false;
  this.ui.resetForNewGame();

  this.player.resetForNewGame();
  this.dealer.resetForNewGame();

  if (this.gameCount && !(this.gameCount % 6)) {
    this.deck.setup();
  }

  this.gameCount += 1;
  this.beginGame();
};


Blackjack.prototype.dealCardTo = function(player, faceDown) {
  let card = this.deck.drawCard();

  card.faceDown = faceDown;
  player.dealCard(card);
};


Blackjack.prototype.beginGame = function() {
  if (this.inProgress) return;

  this.dealCardTo(this.player, false);
  this.dealCardTo(this.dealer, false);
  this.dealCardTo(this.player, false);
  this.dealCardTo(this.dealer, true);

  this.ui.renderCards('dealer', this.dealer.dealtCards);
  this.ui.renderCards('player', this.player.dealtCards);

  if (this.dealer.total === 21 && this.player.total === 21) {
    this.finishGame('Both you & dealer have Blackjack. Dealer wins !', false);

  } else if (this.player.total === 21) {
    this.finishGame('You have Blackjack. You win !!', true);

  } else if (this.dealer.total === 21) {
    this.finishGame('Dealer has Blackjack. Dealer wins !', false);

  } else {
    this.inProgress = true;
    this.ui.updateStatus('Hit or Stay?');
  }
};


Blackjack.prototype.hitByPlayer = function() {
  if (!this.inProgress) return;

  this.dealCardTo(this.player);
  this.ui.renderCards('player', this.player.dealtCards);

  if (this.player.total > 21) {
    this.finishGame('You went over 21. Dealer wins !', false);

  } else if (this.player.cardsCount() === 5) {
    this.finishGame('You drew 5 cards with total < 21. You win !!', true);

  } else if (this.player.total === 21) {
    this.finishGameByDealer();

  } else {
    this.inProgress = true;
    this.ui.updateStatus('Hit or Stay?');
  }
};


Blackjack.prototype.stayByPlayer = function() {
  if (!this.inProgress) return;

  this.finishGameByDealer();
};


Blackjack.prototype.finishGameByDealer = function() {
  this.setDealersSecondCardFaceUp();
  this.dealCardTo(this.dealer);
  this.ui.renderCards('dealer', this.dealer.dealtCards);

  while (true) {
    if (this.dealer.total < 17 && this.dealer.cardsCount() < 5) {
      this.dealCardTo(this.dealer);
      this.ui.renderCards('dealer', this.dealer.dealtCards);

    } else if (this.dealer.total > 21) {
      this.finishGame('Dealer went over 21. You win !!', true);
      break;

    } else if (this.dealer.cardsCount() === 5) {
      this.finishGame('Dealer drew 5 cards with total < 21. Dealer wins!', false);
      break;

    } else if (this.player.total < this.dealer.total) {
      this.finishGame('Dealer wins with ' + this.dealer.total + ' ! You have ' + this.player.total, false);
      break;

    } else if (this.player.total > this.dealer.total) {
      this.finishGame('You win with ' + this.player.total + ' !! Dealer has ' + this.dealer.total, true);
      break;

    } else if (this.player.total === this.dealer.total) {
      this.finishGame('Dealer wins with ' + this.dealer.total + ' ! You have ' + this.player.total, false);
      break;
    }
  }
};


Blackjack.prototype.finishGame = function(message, wonByPlayer) {
  this.inProgress = false;

  emitter.emit('game-over');

  this.setDealersSecondCardFaceUp();
  this.ui.renderCards('dealer', this.dealer.dealtCards);

  this.dealer.updateWinOrLoss(!wonByPlayer);
  this.player.updateWinOrLoss(wonByPlayer);

  this.deck.pushCardsAtEnd(this.player.dealtCards);
  this.deck.pushCardsAtEnd(this.dealer.dealtCards);

  this.ui.updateStatus(message);

  console.log('Player\'s ' + this.player.winPercentageMessage());
};


Blackjack.prototype.setDealersSecondCardFaceUp = function() {
  this.dealer.dealtCards[1].faceDown = false;
};


Blackjack.prototype.addEventListeners = function() {
  var _this = this;

  emitter.on('event-new-game', function() {
    _this.newGame();
  });

  emitter.on('event-player-hit', function() {
    _this.hitByPlayer();
  });

  emitter.on('event-player-stay', function() {
    _this.stayByPlayer();
  });
};


Blackjack.prototype.getTotalsStr = function() {
  return 'You had ' + this.player.total + ' & dealer ' + this.dealer.total + '.';
};


'use strict';

/*
 * Basic idea for this object is from David Walsh's blog post
 */
function EventsEmitter() {
  this.events = {};
}

EventsEmitter.prototype.on = function(event, listener) {
  let index;

  if (!this.events.hasOwnProperty(event)) {
    this.events[event] = [];
  }

  index = this.events[event].push(listener) - 1;

  return {
    remove: function() {
      delete this.events[event][index];
    }
  };
};


EventsEmitter.prototype.emit = function(event, data) {
  if (!this.events.hasOwnProperty(event)) return;

  this.events[event].forEach(function(item) {
    item(typeof data !== 'undefined' ? data : {});
  });
};
'use strict';

function UI() {
  this.$blackjack = document.getElementById('blackjack');
  this.$dealer = this.$blackjack.querySelector('#dealer');
  this.$player = this.$blackjack.querySelector('#player');

  this.$btnNewGame = this.$player.querySelector('.btn-new-game');
  this.$btnPlayerHit = this.$player.querySelector('.btn-player-hit');
  this.$btnPlayerStay = this.$player.querySelector('.btn-player-stay');

  this.$status = this.$blackjack.querySelector('#status .message');

  this.dirCardImages = 'images/cards/';

  this.$cards = {
    dealer: [],
    player: []
  };

  this.setup();
  this.attachEvents();
}


UI.prototype.setup = function() {
  for (let i = 1; i <= 5; i++) {
    let $dImg, $pImg;

    $dImg = document.createElement('img');
    $dImg.classList.add('card', 'dealer-card-' + i);
    this.$dealer.appendChild($dImg);
    this.$cards.dealer.push($dImg);

    $pImg = document.createElement('img');
    $pImg.classList.add('card', 'player-card-' + i);
    this.$player.appendChild($pImg);
    this.$cards.player.push($pImg);
  }
};


UI.prototype.resetForNewGame = function() {
  for (let type in this.$cards) {
    for (let $card of this.$cards[type]) {
      $card.removeAttribute('src');
      $card.style.display = 'none';
    }
  }
};


UI.prototype.renderCards = function(type, cards) {
  var i = 1;

  for (let card of cards) {
    let src = this.getCardImgUrl(card),
        $img = this.$cards[type][i - 1];

    if (card.faceDown) {
      src = this.getCardFaceDownImgUrl();
    }

    if ($img.src !== src) {
      $img.src = src;
      $img.style.display = 'inline';
      $img.classList.add('animate', 'fadeInFromRight');
    }

    i += 1;
  }
};


UI.prototype.attachEvents = function() {
  var _this = this;

  this.$btnNewGame.addEventListener('click', function() {
    emitter.emit('event-new-game');
    _this.toggleHitAndStayButtons(false);
  });

  this.$btnPlayerHit.addEventListener('click', function() {
    emitter.emit('event-player-hit');
  });

  this.$btnPlayerStay.addEventListener('click', function() {
    emitter.emit('event-player-stay');
    _this.toggleHitAndStayButtons(true);
  });

  emitter.on('game-over', function() {
    _this.toggleHitAndStayButtons(true);
  });
};


UI.prototype.updateStatus = function(message) {
  this.$status.innerHTML = message;
};


UI.prototype.toggleHitAndStayButtons = function(disable) {
  if (disable) {
    this.$btnPlayerHit.disabled = true;
    this.$btnPlayerStay.disabled = true;
  } else {
    this.$btnPlayerHit.disabled = false;
    this.$btnPlayerStay.disabled = false;
  }
};


UI.prototype.getCardImgUrl = function(card) {
  return this.dirCardImages + card.suit + '-' + card.face + '.svg';
};


UI.prototype.getCardFaceDownImgUrl = function(card) {
  return this.dirCardImages + 'card-facedown.svg';
};

'use strict';

function Player() {
  this.dealtCards = [];
  this.total = 0;
  this.games = {
    won: 0,
    lost: 0
  };
}


Player.prototype.resetForNewGame = function() {
  this.dealtCards = [];
  this.total = 0;
};


Player.prototype.dealCard = function(card) {
  var hasAce = this.hasAce();

  this.dealtCards.push(card);
  this.total += card.value;

  if (!hasAce && card.face === 'A' && (this.total + 10) <= 21) {
    this.total += 10;
  }
};


Player.prototype.hasAce = function() {
  for (let card of this.dealtCards) {
    if (card.face === 'A') {
      return true;
    }
  }

  return false;
};


Player.prototype.cardsCount = function() {
  return this.dealtCards.length;
};


Player.prototype.resetAll = function() {
  this.resetNewGame();
  this.games = {
    won: 0,
    lost: 0
  };
};


Player.prototype.winPercentageMessage = function() {
  var totalGames = this.games.won + this.games.lost,
      winPercentage = (this.games.won * 100 / totalGames).toFixed(2);

  return 'win percentage is ' + winPercentage + '% (Total games : ' + totalGames + ')';
};


Player.prototype.updateWinOrLoss = function(win) {
  (win) ? this.games.won += 1 : this.games.lost += 1;
};


Player.prototype.displayDealtCards = function() {
  var output = [];

  for (let card of this.dealtCards) {
    output.push(card.suit + '-' + card.face + ' | ' + card.faceDown);
  }

  console.log(output.join(', '));
};
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
'use strict';

  var emitter = new EventsEmitter(),
      blackjack = new Blackjack();

