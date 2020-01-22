(function(window) {

	var Game = function(element, option) {
		this.element = document.getElementById(element);
		this.option = option;

		this.info_div = document.createElement('div');
		this.info_div.id = "info_div";

		this.deck_div = document.createElement("div");
		this.deck_div.id = "deck_div";
		this.gameDeck = new Deck(option);
		this.gameDeck.buildDeck.call(this);

		var shuffleBtn =document.createElement("button");
		shuffleBtn.innerHTML = "TASUJ";
		shuffleBtn.onclick = this.gameDeck.shuffle.bind(this);

		this.info_div.appendChild(shuffleBtn);

		this.rules = {
			discardRow : [
				{
					name: "TO WIEM",
					droppable: true,
					maxcards: this.deck_div.children.length,
					piles: 1
				}
			],
			gameComplete: function(card) {
				if (card.currentTarget.childNodes.length === this.discardRow[0].maxcards) {
					alert("ZROBIONE !");
				}
			}
		};

		this.buildDiscard = function() {
			for (var i = this.rules.discardRow.length - 1; i >= 0; i--) {
				var zone = document.createElement("div");
				zone.className = "zone row";
				var discardRule = this.rules.discardRow[i];
				var a = 0;
				while (a < discardRule.piles) {
					var discardObj = new DiscardPile();
					discardObj.name = discardRule.name;
					discardObj.droppable = discardRule.droppable;
					discardObj.id = "pile-" + a;
					var buildObj = discardObj.init();
					zone.appendChild(buildObj);
					a++;
				}
				this.element.appendChild(zone);
			}
		};

		this.element.appendChild(this.info_div);
		this.element.appendChild(this.deck_div);
		this.buildDiscard();
	};

	var Deck = function(option) {
		this.deckData = option.data;
		this.buildDeck = function() {
			var parentFrag = document.createDocumentFragment();
			this.deck_div.innerHTML = "";
			for (var i = this.option.data.length - 1; i >= 0; i--) {
				var card = new Card();
				card.id = "card-" + i;
				card.data = this.option.data[i];
				card.buildCard(parentFrag);
			}
			this.deck_div.appendChild(parentFrag);
			this.gameDeck.stack.call(this);
		};
	};

	Deck.prototype.shuffle = function() {
		var cardsToShuffle = this.gameDeck.deckData;
		var a = cardsToShuffle.length, b, i;
		while (a) {
			i = Math.floor(Math.random() * a--);
			b = cardsToShuffle[a];
			cardsToShuffle[a] = cardsToShuffle[i];
			cardsToShuffle[i] = b;
		}
		this.gameDeck.deckData = cardsToShuffle;
		this.gameDeck.buildDeck.call(this);
	};

	Deck.prototype.stack = function() {
		var cards = this.deck_div.children;
		for (var i = cards.length - 1; i >= 0; i--) {
			cards[i].style.top = i + "px";
			cards[i].style.left = i + "px";
			cards[i].classList.add("stacked_card");
		}
	};

	var Card = function() {
		this.id = "";
		this.data = "";
		this.cardCont = document.createElement("div");
		this.cardCont.className = "card_container";
		this.cardFront = document.createElement("div");
		this.cardFront.className = "card_front";
		this.cardBack = document.createElement("div");
		this.cardBack.className = "card_back";

		this.buildCard = function(parentFrag) {
			var flipDiv = document.createElement("div"),
				frontValDiv = document.createElement("div"),
				backValDiv = document.createElement("div"),
				catDiv = document.createElement("div");

			flipDiv.className = "flip";
			frontValDiv.className = "front_val";
			backValDiv.className = "back_val";
			catDiv.className = "cat_val";

			frontValDiv.innerHTML = this.data.question;
			backValDiv.innerHTML = this.data.answer;
			catDiv.innerHTML = this.data.category;

			this.cardFront.appendChild(frontValDiv);
			this.cardFront.appendChild(catDiv);
			this.cardBack.appendChild(backValDiv);

			flipDiv.appendChild(this.cardFront);
			flipDiv.appendChild(this.cardBack);

			this.cardCont.id = this.id;
			this.cardCont.appendChild(flipDiv);

			this.cardCont.onclick = cardClick;
			this.cardCont.draggable = true;
			this.cardCont.ondragstart = cardDrag;
			parentFrag.appendChild(this.cardCont);
		};
	};

	var cardClick = (function(card) {
		var counter = 0;
		return function (card) {
			card.currentTarget.classList.toggle("flip_card");
			card.currentTarget.classList.toggle("slide_over");
			card.currentTarget.style.zIndex = counter;
			counter++;
		};
	})();

	function cardDrag(card) {
		card.dataTransfer.setData("text/plain", card.currentTarget.id);
	}

	var DiscardPile = function() {
		this.name = "";
		this.droppable = true;
		this.id = "";
		this.init = function() {
			var holderContainer = document.createElement("div"),
			holderLabel = document.createElement("div"),
			holderTarget = document.createElement("div");
			holderTarget.ondragover = function(card) {
				card.preventDefault();
			};
			holderTarget.ondrop = this.cardDrop;
			holderContainer.className = "holder_container";
			holderLabel.className = "holder_label";
			holderTarget.className = "holder_target";
			holderLabel.innerText = this.name;

			holderContainer.appendChild(holderLabel);
			holderContainer.appendChild(holderTarget);

			return holderContainer;
		};
	};

	DiscardPile.prototype.cardDrop = function(card) {
		var cardId = card.dataTransfer.getData("text/plain");
		var cardDragging = document.getElementById(cardId);
		cardDragging.style.top = "0px";
		cardDragging.style.left = "0px";
		card.currentTarget.appendChild(cardDragging);
	};

	window.Game = Game;

})(window);
