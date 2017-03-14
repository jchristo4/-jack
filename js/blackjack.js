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

this.deck.displayCards();
  this.gameCount += 1;
  this.beginGame();
}


Blackjack.prototype.dealCardTo = function(player, faceDown) {
  let card = this.deck.drawCard();

  card.faceDown = faceDown;
  player.dealCard(card);
}


Blackjack.prototype.beginGame = function() {
  if (this.inProgress) return;

  this.dealCardTo(this.player, false);
  this.dealCardTo(this.dealer, false);
  this.dealCardTo(this.player, false);
  this.dealCardTo(this.dealer, true);

  this.ui.renderCards('dealer', this.dealer.dealtCards);
  this.ui.renderCards('player', this.player.dealtCards);

  if (this.dealer.total === 21 && this.player.total === 21) {
    this.finishGame('Both you and dealer have Blackjack. Dealer wins!', false);

  } else if (this.player.total === 21) {
    this.finishGame('You have Blackjack. You win!', true);

  } else if (this.dealer.total === 21) {
    this.finishGame('Dealer has Blackjack. Dealer wins!', false);

  } else {
    this.inProgress = true;
    console.log(this.getTotalsStr());
    console.log('Hit or Stand?');
  }
}


Blackjack.prototype.hitByPlayer = function() {
  if (!this.inProgress) return;

  this.dealCardTo(this.player);
  this.ui.renderCards('player', this.player.dealtCards);

  if (this.player.total > 21) {
    this.finishGame('You went over 21. Dealer wins!', false)

  } else if (this.player.cardsCount() === 5) {
    this.finishGame('You drew 5 cards with total less than 21. You win!', true);

  } else if (this.player.total === 21) {
    this.finishGameByDealer();

  } else {
    this.inProgress = true;
    console.log(this.getTotalsStr());
    console.log('Hit or Stand?');
  }
}


Blackjack.prototype.stayByPlayer = function() {
  if (!this.inProgress) return;

  this.finishGameByDealer();
}


Blackjack.prototype.finishGameByDealer = function() {
  this.setDealersSecondCardFaceUp();
  this.dealCardTo(this.dealer);
  this.ui.renderCards('dealer', this.dealer.dealtCards);

  while (true) {
    if (this.dealer.total < 17 && this.dealer.cardsCount() < 5) {
      this.dealCardTo(this.dealer);
      this.ui.renderCards('dealer', this.dealer.dealtCards);

    } else if (this.dealer.total > 21) {
      this.finishGame('Dealer went over 21. You win!', true);
      break;

    } else if (this.dealer.cardsCount() === 5) {
      this.finishGame('Dealer drew 5 cards with total less than 21. Dealer wins!', false);
      break;

    } else if (this.player.total < this.dealer.total) {
      this.finishGame(this.getTotalsStr() + ' Dealer wins!', false);
      break;

    } else if (this.player.total > this.dealer.total) {
      this.finishGame(this.getTotalsStr() + ' You win!', true);
      break;

    } else if (this.player.total === this.dealer.total) {
      this.finishGame(this.getTotalsStr() + ' Dealer wins!', false);
      break;
    }
    console.log(this.getTotalsStr());
  }
}


Blackjack.prototype.finishGame = function(message, wonByDealer) {
  this.inProgress = false;

  emitter.emit('game-over');

  this.setDealersSecondCardFaceUp();
  this.ui.renderCards('dealer', this.dealer.dealtCards);

  this.dealer.updateWinOrLoss(wonByDealer);
  this.player.updateWinOrLoss(!wonByDealer);

  this.deck.pushCardsAtEnd(this.player.dealtCards);
  this.deck.pushCardsAtEnd(this.dealer.dealtCards);

  console.log(this.getTotalsStr());
  console.log(message);
}


Blackjack.prototype.setDealersSecondCardFaceUp = function() {
  this.dealer.dealtCards[1].faceDown = false;
}


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
}


Blackjack.prototype.getTotalsStr = function() {
  return 'Your total is ' + this.player.total + ' and dealer\'s is ' + this.dealer.total + '.';
}

