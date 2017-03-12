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
}


Player.prototype.dealCard = function(card, faceDown) {
  card.faceDown = faceDown || false;

  this.dealtCards.push(card);
  this.total += card.value;
}


Player.prototype.cardsCount = function() {
  return this.dealtCards.length;
}


Player.prototype.resetAll = function() {
  this.resetNewGame();
  this.games = {
    won: 0,
    lost: 0
  };
}


Player.prototype.winPercentage = function() {
  var total = this.games.won + this.games.lost,
      winPercentage = (this.games.won * 100 / total).toFixed(2);

  return winPercentage + '%';
}


Player.prototype.displayDealtCards = function() {
  var output = [];

  for (card of this.dealtCards) {
    output.push(card.suit + '-' + card.face + ' | ' + card.faceDown);
  }

  console.log(output.join(', '))
}