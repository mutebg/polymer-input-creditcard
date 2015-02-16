(function() {
	var card = new Card();
	Polymer('input-creditcard', {
		
		cardtype: '',
		
		publish: {
			placeholder: '',
			disabled: false,
			readonly: false,
			required: false,
			valid: false,
			errorClassName: 'error',
			value: '',
			name: ''
		},

		domReady: function(){
			this.input = this.$.creditcard;
		},

		valueChanged: function(oldNumber, newNumber){
			var length = 12;
			var cardtype = '';

			if( newNumber ) {
				var cardType = card.cardFromNumber(newNumber);
				if ( cardType ) {
					cardtype = cardType.type;
					length = cardType.length[ cardType.length.length - 1 ];
				}
				//format number
				this.value = card.formatCardNumber(newNumber, length);
			}

			//validate number
			if ( this.valid ) {
				if ( ! card.validateCardNumber(newNumber) ) {
					this.classList.add( this.errorClassName );
				} else {
					this.classList.remove( this.errorClassName );
				}
			}

			//set card type
			this.cardtype = cardtype;
		},

		//---------public methods----------
		//check for valid number
		isValid: function() {
			return card.validateCardNumber( this.value );
		},
		//get card type name
		getCardType: function() {
			return this.cardtype;
		}
	});

	function Card() {
		var cards = [
			{
			  type: 'amex',
			  pattern: /^3[47]/,
			  format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
			  length: [15],
			  luhn: true
			}, {
			  type: 'dankort',
			  pattern: /^5019/,
			  length: [16],
			  luhn: true
			}, {
			  type: 'dinersclub',
			  pattern: /^(36|38|30[0-5])/,
			  length: [14],
			  luhn: true
			}, {
			  type: 'discover',
			  pattern: /^(6011|65|64[4-9]|622)/,
			  length: [16],
			  luhn: true
			}, {
			  type: 'jcb',
			  pattern: /^35/,
			  length: [16],
			  luhn: true
			}, {
			  type: 'laser',
			  pattern: /^(6706|6771|6709)/,
			  length: [16, 17, 18, 19],
			  luhn: true
			}, {
			  type: 'maestro',
			  pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
			  length: [12, 13, 14, 15, 16, 17, 18, 19],
			  cvcLength: [3],
			  luhn: true
			}, {
			  type: 'mastercard',
			  pattern: /^5[1-5]/,
			  length: [16],
			  luhn: true
			}, {
			  type: 'unionpay',
			  pattern: /^62/,
			  length: [16, 17, 18, 19],
			  luhn: false
			}, {
			  type: 'visaelectron',
			  pattern: /^4(026|17500|405|508|844|91[37])/,
			  length: [16],
			  luhn: true
			}, {
			  type: 'visa',
			  pattern: /^4/,
			  length: [13, 14, 15, 16],
			  luhn: true
			}
		];


		var publicMethods = {
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
			formatCardNumber: function(number, length) {
				var noSpaceNumber = number.replace(/[^0-9\.]+/g, '');
				var returnNumber = '';
				for(var i = 0; i <= length; i= i+4 ) {
					returnNumber += noSpaceNumber.slice(i, i+4) + ' ';
				}
				return returnNumber.trim();
			},
			validateCardNumber: function(number) {
				var card, _ref;
      	number = (number + '').replace(/\s+|-/g, '');
      	if (!/^\d+$/.test(number)) {
        	return false;
      	}
      	card = this.cardFromNumber(number);
      	if ( !card ) {
        	return false;
      	}
      	return ( card.length.indexOf( number.length ) >= 0 ) && ( card.luhn === false || this.luhnCheck(number) );
      },
			//Luhn algorithm => http://en.wikipedia.org/wiki/Luhn_algorithm
			luhnCheck: function(num) {
			  var digit, digits, odd, sum, _i, _len;
			  odd = true;
			  sum = 0;
			  digits = (num + '').split('').reverse();
			  for (_i = 0, _len = digits.length; _i < _len; _i++) {
			    digit = digits[_i];
			    digit = parseInt(digit, 10);
			    if ((odd = !odd)) {
			      digit *= 2;
			    }
			    if (digit > 9) {
			      digit -= 9;
			    }
			    sum += digit;
			  }
			  return sum % 10 === 0;
			}
		}

		return publicMethods;
	}
})();

