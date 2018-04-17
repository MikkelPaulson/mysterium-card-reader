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
		numPsychics: null,
		expHiddenSigns: false,
		expSecretsAndLies: false,
		round3: 'objects',
		promo: []
	};

	var output = {
		characters: [],
		locations: [],
		objects: [],
		stories: [],
		crows: '',
		clairvoyancy: 0
	};

	var cards = {
		characters: [],
		locations: [],
		objects: [],
		stories: []
	};

	var cardSort = function(a, b) {
		if (typeof a == 'string') {
			if (typeof b == 'string') {
				aPos = a.search(/[0-9]/);
				bPos = b.search(/[0-9]/);
				aExp = a.slice(0, aPos);
				bExp = b.slice(0, bPos);

				if (aExp > bExp) {
					return 1;
				} else if (aExp < bExp) {
					return -1;
				} else {
						return a.slice(aPos) - b.slice(bPos);
				}
			} else {
				return 1;
			}
		} else {
			if (typeof b == 'string') {
				return -1;
			} else {
				return a - b;
			}
		}
	};

	var formArray = $(this).serializeArray();
	for (var i = 0; i < formArray.length; i++) {
		key = formArray[i].name;
		value = formArray[i].value;

		switch (key) {
			case 'promo[]':
				game.promo.push(value);
				break;
			case 'numPsychics':
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
		easy: {1:4, 2:5, 3:5, 4:6, 5:6, 6:7},
		medium: {1:5, 2:6, 3:6, 4:7, 5:8, 6:8},
		hard: {1:6, 2:7, 3:7, 4:8, 5:9, 6:9},
	}[game.difficulty][game.numPsychics];

	for (i = 1; i <= 18; i++) {
		cards.characters.push(i);
	}
	for (i = 19; i <= 36; i++) {
		cards.locations.push(i);
	}
	for (i = 37; i <= 54; i++) {
		cards.objects.push(i);
	}

	if (game.expHiddenSigns) {
		for (i = 1; i <= 6; i++) {
			cards.characters.push('HS' + i);
		}
		for (i = 7; i <= 12; i++) {
			cards.locations.push('HS' + i);
		}
		for (i = 13; i <= 18; i++) {
			cards.objects.push('HS' + i);
		}
	}

	if (game.expSecretsAndLies) {
		for (i = 1; i <= 6; i++) {
			cards.characters.push('SL' + i);
		}
		for (i = 7; i <= 12; i++) {
			cards.locations.push('SL' + i);
		}
		for (i = 13; i <= 18; i++) {
			cards.objects.push('SL' + i);
		}
		for (i = 19; i <= 36; i++) {
			cards.stories.push('SL' + i);
		}
	}

	for (i = 0; i < game.promo.length; i++) {
		switch (i) {
			case 1:
				cards.characters.push('P' + i);
				break;
			case 2:
				cards.locations.push('P' + i);
				break;
			case 3:
			case 4:
				cards.objects.push('P' + i);
				break;
			case 5:
				cards.stories.push('P' + i);
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
			output.crows = '1 per round';
			break;
		case 'medium':
			output.crows = '3 per game';
			break;
		case 'hard':
			output.crows = '1 per game';
			break;
	}

	switch (game.numPsychics) {
		case 1:
		case 2:
			output.clairvoyancy = 0;
			break;
		case 3:
		case 4:
			output.clairvoyancy = 4;
			break;
		default:
			output.clairvoyancy = 6;
			break;
	}

	$('#out-crows').html(output.crows);
	$('#out-clairvoyancy').html(output.clairvoyancy);

	if (game.round3 === 'objects') {
		$('#out-objects-container').removeClass('d-none');
		if (!$('#out-stories-container').hasClass('d-none')) {
			$('#out-stories-container').addClass('d-none');
		}
	} else {
		$('#out-stories-container').removeClass('d-none');
		if (!$('#out-objects-container').hasClass('d-none')) {
			$('#out-objects-container').addClass('d-none');
		}
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
