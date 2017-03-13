function Blackjack() {
  this.gameCount = 0;
  this.deck = new Deck();
  this.player = new Player();
  this.dealer = new Player();
}


Blackjack.prototype.newGame = function() {
  this.inProgress = false;

  this.player.resetForNewGame();
  this.dealer.resetForNewGame();
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

  if (this.dealer.total === 21 && this.player.total === 21) {
    this.closeGame('Both you and dealer have Blackjack. Dealer wins!', false);

  } else if (this.player.total === 21) {
    this.closeGame('You have Blackjack. You win!', true);

  } else if (this.dealer.total === 21) {
    this.closeGame('Dealer has Blackjack. Dealer wins!', false);

  } else {
    console.log('Hit or Stand?');
  }
}


Blackjack.prototype.hitByPlayer = function() {
  if (!this.inProgress) return;

  this.dealCardTo(this.player);

  if (this.player.total > 21) {
    this.closeGame('You went over 21. Dealer wins!', false)

  } else if (this.player.cardsCount() === 5) {
    this.closeGame('You drew 5 cards with total less than 21. You win!', true);

  } else if (this.player.total === 21) {
    this.closeGameByDealer();

  } else {
    console.log('Hit or Stand?');
  }
}


Blackjack.prototype.standByPlayer = function() {
  if (!this.inProgress) return;

  this.closeGameByDealer();
}


Blackjack.prototype.closeGameByDealer = function() {
  this.dealCardTo(this.dealer);

  while (true) {
    if (this.dealer.total < 17 && this.dealer.cardsCount() < 5) {
      this.dealCardTo(this.dealer);

    } else if (this.dealer.total > 21) {
      this.closeGame('Dealer went over 21. You win!', true);
      break;

    } else if (this.dealer.cardsCount() === 5) {
      this.closeGame('Dealer drew 5 cards with total less than 21. Dealer wins!', false);
      break;

    } else if (this.player.total < this.dealer.total) {
      this.closeGame(this.getTotalsStr() + ' Dealer wins!', false);
      break;

    } else if (this.player.total > this.dealer.total) {
      this.closeGame(this.getTotalsStr() + ' You win!', true);
      break;

    } else if (this.player.total === this.dealer.total) {
      this.closeGame(this.getTotalsStr() + ' Dealer wins!', false);
      break;
    }
  }
}


Blackjack.prototype.closeGame = function(message, wonByDealer) {
  this.inProgress = false;

  this.dealer.updateWinOrLoss(wonByDealer);
  this.player.updateWinOrLoss(!wonByDealer);

  console.log(message);
}


Blackjack.prototype.getTotalsStr = function() {
  return 'Your total is ' + this.player.total + ' and dealer\'s is ' + this.dealer.total + '.';
}

