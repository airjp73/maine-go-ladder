import { rungToRating, ratingtoRung } from "./ratings";

describe("rung / rating conversions", () => {
  it.each([
    [0, 0],
    [1, 0.1],
    [2, 0.2],
    [3, 0.3],
    [10, 1],
    [11, 1.1],
    [20, 2],
    [30, 3],
    [40, 4],
    [-1, -0.1],
    [-2, -0.2],
    [-3, -0.3],
    [-10, -1],
    [-20, -2],
    [-25, -3],
    [-26, -3.2],
    [-30, -4],
    [-31, -4.2],
    [-60, -10],
    [-61, -10.5],
    [-62, -11],
    [-65, -12.5],
    [-80, -20],
    [-81, -21],
    [-82, -22],
    [-83, -23],
  ])("should properly convert %d to %d and back", (rung, rating) => {
    expect(rungToRating(rung)).toEqual(rating);
    expect(ratingtoRung(rating)).toEqual(rung);
  });
});
