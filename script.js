$('#exp-sl').change(function () {
	if ($(this).prop('checked')) {
		$('#round3-stories').prop('disabled', false);
	} else {
		$('#round3-stories').prop('disabled', true);
		$('#round3-objects').prop('checked', true);
	}
});

$('#round3-stories').change(function () {
	$('#promo-3').prop('disabled', true).prop('checked', false);
	$('#promo-4').prop('disabled', true).prop('checked', false);
	$('#promo-5').prop('disabled', false);
});

$('#round3-objects').change(function () {
	$('#promo-3').prop('disabled', false);
	$('#promo-4').prop('disabled', false);
	$('#promo-5').prop('disabled', true).prop('checked', false);
});

$('#reset').click(function () {
	$('#input').removeClass('d-none');
	$('#output').addClass('d-none');
});

$('#game-form').submit(function (event) {
	event.preventDefault();

	var allCharacters = [];
	var allLocations = [];
	var allObjects = [];
	var allStories = [];

	var game = {
		difficulty: 'medium',
		numPlayers: null,
		expHiddenSigns: false,
		expSecretsAndLies: false,
		round3: 'objects',
		promo: []
	};

	var output = {
		characters: [],
		locations: [],
		objects: [],
		stories: []
	};

	var cards = {
		characters: [],
		locations: [],
		objects: [],
		stories: []
	};

	/*
	 * Need a complicated comparison algorithm because we're sorting both
	 * alphabetically and numerically. Our desired sort order looks like:
	 *
	 * 1, 2, 10, HS1, HS2, HS10, P1, P2, SL1, SL2, SL10
	 *
	 * * base cards sort first
	 * * expansion cards sort alphabetically by expansion code (HS < P < SL)
	 * * base cards and expansion cards sort numerically
	 */
	var cardSort = function(a, b) {
		if (typeof a == 'string') {
			/* a is an expansion card */

			if (typeof b == 'string') {
				/* and b is also an expansion card */

				aPos = a.search(/[0-9]/);
				bPos = b.search(/[0-9]/);
				aExp = a.slice(0, aPos);
				bExp = b.slice(0, bPos);

				if (aExp > bExp) {
					/* string part of a sorts after b */
					return 1;
				} else if (aExp < bExp) {
					/* string part of b sorts after a */
					return -1;
				} else {
					/* a and b are from the same expansion - sort numerically */
					return a.slice(aPos) - b.slice(bPos);
				}
			} else {
				/* but b is not an expansion card - b comes first */
				return 1;
			}
		} else {
			/* a is not an expansion card */

			if (typeof b == 'string') {
				/* but b is an expansion card - a comes first */
				return -1;
			} else {
				/* and b is also not an expansion card - sort numerically */
				return a - b;
			}
		}
	};

	$('.conditional').each(function () {
		if (!$(this).hasClass('d-none')) {
			$(this).addClass('d-none');
		}
	});

	var formArray = $(this).serializeArray();
	for (var i = 0; i < formArray.length; i++) {
		var key = formArray[i].name;
		var value = formArray[i].value;

		switch (key) {
			case 'promo[]':
				game.promo.push(Number(value));
				break;
			case 'numPlayers':
				game[key] = Number(value);
				break;
			case 'expHiddenSigns':
			case 'expSecretsAndLies':
				game[key] = value === 'on';
				break;
			case 'round3':
			case 'difficulty':
			default:
				game[formArray[i].name] = formArray[i].value;
				break;
		}
	}

	var cardCount = {
		easy: {2:4, 3:5, 4:5, 5:6, 6:6, 7:7},
		medium: {2:5, 3:6, 4:6, 5:7, 6:8, 7:8},
		hard: {2:6, 3:7, 4:7, 5:8, 6:9, 7:9},
	}[game.difficulty][game.numPlayers];

	for (var i = 1; i <= 18; i++) {
		cards.characters.push(i);
	}
	for (var i = 19; i <= 36; i++) {
		cards.locations.push(i);
	}
	for (var i = 37; i <= 54; i++) {
		cards.objects.push(i);
	}

	if (game.expHiddenSigns) {
		for (var i = 1; i <= 6; i++) {
			cards.characters.push('HS' + i);
		}
		for (var i = 7; i <= 12; i++) {
			cards.locations.push('HS' + i);
		}
		for (var i = 13; i <= 18; i++) {
			cards.objects.push('HS' + i);
		}
	}

	if (game.expSecretsAndLies) {
		for (var i = 1; i <= 6; i++) {
			cards.characters.push('SL' + i);
		}
		for (var i = 7; i <= 12; i++) {
			cards.locations.push('SL' + i);
		}
		for (var i = 13; i <= 18; i++) {
			cards.objects.push('SL' + i);
		}
		for (var i = 19; i <= 36; i++) {
			cards.stories.push('SL' + i);
		}
	}

	for (var i = 0; i < game.promo.length; i++) {
		var value = game.promo[i];

		switch (value) {
			case 1:
				cards.characters.push('P' + value);
				break;
			case 2:
				cards.locations.push('P' + value);
				break;
			case 3:
			case 4:
				cards.objects.push('P' + value);
				break;
			case 5:
				cards.stories.push('P' + value);
				break;
		}
	}

	for (var deck in cards) {
		output[deck] = cards[deck]
			.sort(function(a, b){return 0.5 - Math.random()})
			.slice(0, cardCount)
			.sort(cardSort);
	}

	switch (game.difficulty) {
		case 'easy':
			$('.conditional-easy').removeClass('d-none');
			break;
		case 'medium':
			$('.conditional-medium').removeClass('d-none');
			break;
		case 'hard':
			$('.conditional-hard').removeClass('d-none');
			break;
	}

	$('.conditional-' + game.numPlayers + 'p').removeClass('d-none');

	if (game.round3 === 'objects') {
		$('.conditional-objects').removeClass('d-none');
	} else {
		$('.conditional-stories').removeClass('d-none');
	}

	for (var deck in cards) {
		$('#out-' + deck).text('');
		for (i = 0; i < cardCount; i++) {
			$('#out-' + deck)
				.append(
					$('<span>')
						.prop('class', 'badge badge-dark')
						.text(output[deck][i])
				);
			$('#out-' + deck + ' span').before(' ');
		}
	}

	$('#input').addClass('d-none');
	$('#output').removeClass('d-none');
});
