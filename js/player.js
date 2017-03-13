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
  var hasAce = this.hasAce();

  card.faceDown = faceDown || false;

  this.dealtCards.push(card);
  this.total += card.value;

  if (!hasAce && card.face === 'A' && (this.total + 10) <= 21) {
    this.total += 10;
  }
}


Player.prototype.hasAce = function() {
  for (let card of this.dealtCards) {
    if (card.face === 'A') {
      return true;
    }
  }

  return false;
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
  var totalGames = this.games.won + this.games.lost,
      winPercentage = (this.games.won * 100 / totalGames).toFixed(2);

  return winPercentage + '%';
}


Player.prototype.displayDealtCards = function() {
  var output = [];

  for (let card of this.dealtCards) {
    output.push(card.suit + '-' + card.face + ' | ' + card.faceDown);
  }

  console.log(output.join(', '))
}