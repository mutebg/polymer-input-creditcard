(function() {
	var isReady = false;
	var card = new Card();
	Polymer('input-creditcard', {
		publish: {
			placeholder: '',
			disabled: false,
			readonly: false,
			required: false,
			value: '',
			name: '',
			cardtype: '',
		},
		/* -- Lifecycle ------------------------------------------------- */
		ready: function() {

		},
		domReady: function(){
			isReady = true;
			
		},
		valueChanged: function(oldValue, newValue){
			var length = 12;
			var cardtype = '';

			if( newValue ) {
				var cardType = card.cardFromNumber(newValue);
				if ( cardType ) {
					cardtype = cardType.type;
					length = cardType.length;
				}	
				this.value = card.formatCardNumber(newValue, length);
			}
			this.cardtype = cardtype;
		}
	});

	function Card() {
		var cards = [
		  {
		    type: 'amex',
		    pattern: /^3[47]/,
		    length: 15
		  },{
		    type: 'dinersclub',
		    pattern: /^(36|38|30[0-5])/,
		    length: 14,
		  }, {
		    type: 'discover',
		    pattern: /^(6011|65|64[4-9]|622)/,
		    length: 16,
		  }, {
		    type: 'jcb',
		    pattern: /^35/,
		    length: 16,
		  }, {
		    type: 'maestro',
		    pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
		    length: 19,
		  }, {
		    type: 'mastercard',
		    pattern: /^5[1-5]/,
		    length: 16,
		  }, {
		    type: 'visaelectron',
		    pattern: /^4(026|17500|405|508|844|91[37])/,
		    length: 16,
		  }, {
		    type: 'visa',
		    pattern: /^4/,
		    length: 16,
		  }
		];

		var _public = {
			cardFromNumber: function(num) {
			  var card, _i, _len;
			  num = (num + '').replace(/\D/g, '');
			  for (_i = 0, _len = cards.length; _i < _len; _i++) {
			    card = cards[_i];
			    if (card.pattern.test(num)) {
			      return card;
			    }
			  }
			},

			cardFromType: function(type) {
			  var card, _i, _len;
			  for (_i = 0, _len = cards.length; _i < _len; _i++) {
			    card = cards[_i];
			    if (card.type === type) {
			      return card;
			    }
			  }
			},
			formatCardNumber: function(number, length) {
				var noSpaceNumber = number.replace(/[^0-9\.]+/g, '');
				var returnNumber = '';
				for(var i = 0; i <= length; i= i+4 ) {
					returnNumber += noSpaceNumber.slice(i, i+4) + ' ';
				}
				return returnNumber.trim();
			}
		}

		return _public;
	}
})();

