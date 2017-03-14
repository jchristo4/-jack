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
}


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
}


UI.prototype.updateStatus = function(message) {
  this.$status.innerHTML = message;
}



UI.prototype.toggleHitAndStayButtons = function(disable) {
  if (disable) {
    this.$btnPlayerHit.disabled = true;
    this.$btnPlayerStay.disabled = true;
  } else {
    this.$btnPlayerHit.disabled = false;
    this.$btnPlayerStay.disabled = false;
  }
}


UI.prototype.getCardImgUrl = function(card) {
  return this.dirCardImages + card.suit + '-' + card.face + '.svg';
}


UI.prototype.getCardFaceDownImgUrl = function(card) {
  return this.dirCardImages + 'card-facedown.svg';
}
