const RUNG_0_2 = -20;
const RUNG_0_5 = -60;
const RUNG_1 = -80;

/**
 * Ladder rungs aren't all worth the same amount of rating points.
 * The farther below 0 you get, the bigger the steps.
 *
 * I'm sure there's a more elegant way of doing these,
 * but spelling out the breakpoints seems clear enough.
 *
 * @param ladderRung the rung of the ladder the user is on
 */
export function rungToRating(ladderRung: number): number {
  if (ladderRung > 0) return ladderRung / 10;

  let currentRung = ladderRung;
  let rating = 0;

  if (currentRung < RUNG_1) {
    const diff = currentRung - RUNG_1;
    rating += diff;
    currentRung -= diff;
  }

  if (currentRung < RUNG_0_5) {
    const diff = currentRung - RUNG_0_5;
    rating += diff / 2;
    currentRung -= diff;
  }

  if (currentRung < RUNG_0_2) {
    const diff = currentRung - RUNG_0_2;
    rating += diff / 5;
    currentRung -= diff;
  }

  rating += currentRung / 10;

  return rating;
}

const RATING_0_2 = -2;
const RATING_0_5 = -10;
const RATING_1 = -20;

export function ratingtoRung(rating: number): number {
  if (rating > 0) return rating * 10;

  let currentRating = rating;
  let ladderRung = 0;

  if (currentRating < RATING_1) {
    const diff = currentRating - RATING_1;
    ladderRung += diff;
    currentRating -= diff;
  }

  if (currentRating < RATING_0_5) {
    const diff = currentRating - RATING_0_5;
    ladderRung += diff * 2;
    currentRating -= diff;
  }

  if (currentRating < RATING_0_2) {
    const diff = currentRating - RATING_0_2;
    ladderRung += diff * 5;
    currentRating -= diff;
  }

  ladderRung += currentRating * 10;

  return ladderRung;
}
