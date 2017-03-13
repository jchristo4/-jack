function Blackjack() {
  this.newGame();
  this.startGame();
}


Blackjack.prototype.newGame = function() {
  this.inProgress = false;
  this.deck = new Deck();
  this.player = new Player();
  this.dealer = new Player();
}


Blackjack.prototype.dealCardTo = function(player, faceDown) {
  faceDown = faceDown || false;
  player.dealCard(this.deck.drawCard(), faceDown);
}


Blackjack.prototype.startGame = function() {
  if (this.inProgress) return;

  this.dealCardTo(this.player, false);
  this.dealCardTo(this.dealer, false);
  this.dealCardTo(this.player, false);

  // this.player.displayDealtCards();
  // this.dealer.displayDealtCards();

  this.checkTotal();
  this.dealCardTo(this.dealer, true);
}


Blackjack.prototype.checkTotal = function() {
  if (this.dealer.total === 21 && this.player.total === 21) {
    console.log('Both have Blackjack. Dealer wins!');
  } else if (this.dealer.total === 21) {
    console.log('Dealer wins!');
  } else if (this.player.total === 21) {
    console.log('Player wins!');
  } else if (this.player.total > 21) {
    console.log('Over 21. Dealer wins!');
  } else if (this.dealer.total > 21) {
    console.log('Over 21. Player wins!');
  } else {
    console.log('Hit or Stand?');
  }
}


Blackjack.prototype.stand = function() {
  if (!this.inProgress) return;


}