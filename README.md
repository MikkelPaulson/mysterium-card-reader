# Mysterium Card Reader

A jQuery application that shuffles and draws
[Mysterium](https://boardgamegeek.com/boardgame/181304/mysterium) game cards.
Given a number of players, difficulty, and available expansions/promo cards, it
will provide you with a list of card numbers for each of the decks.

I used a simple random number generator for card selection until I got the
Secrets & Lies expansion, which complicated matters by not having sequential
numbering. This application makes that possible once again, and has the added
bonus of knowing how many cards to choose depending on the number of players,
which I otherwise always have to look up.

## Supported expansions

* [Mysterium: Hidden Signs](https://boardgamegeek.com/boardgameexpansion/192661/mysterium-hidden-signs)
* [Mysterium: Secrets & Lies](https://boardgamegeek.com/boardgameexpansion/192661/mysterium-hidden-signs)
* Promo cards 1-5

## Caveats

* I don't currently own Hidden Signs, so I'm assuming that its cards are
  numbered in the same sequence as Secrets & Lies, ie. HS1-HS6 are characters,
  HS7-HS12 are locations, and HS13-HS18 are objects.
* I'm a backend developer. Sorry about the code.
