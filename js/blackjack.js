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
  emitter.emit('event-game-over');
  this.inProgress = false;

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

