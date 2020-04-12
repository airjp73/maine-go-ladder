import { calculateMatchup, EvenMatchup } from "./MatchupCalculator";
import { ratingtoRung } from "../ladder/ratings";
import { User } from "../api/User";
import { Matching } from "react-redux";

interface TestHandicapCase {
  type: "HANDICAP";
  black: string;
  white: string;
  numStones: number;
  komi: number;
}
type TestMatchup = EvenMatchup | TestHandicapCase;

describe("calculateMatchup", () => {
  const cases: [number, number, TestMatchup][] = [
    [1, 1, { type: "EVEN" }],
    [0, 0, { type: "EVEN" }],
    [0.5, 0.5, { type: "EVEN" }],
    [-0.5, -0.5, { type: "EVEN" }],
    [-2, -2, { type: "EVEN" }],
    [
      0,
      0.1,
      { type: "HANDICAP", black: "2", white: "1", numStones: 0, komi: -5 },
    ],
    [
      0,
      0.2,
      { type: "HANDICAP", black: "2", white: "1", numStones: 0, komi: -5 },
    ],
    [
      0,
      0.3,
      { type: "HANDICAP", black: "2", white: "1", numStones: 0, komi: -5 },
    ],
    [
      0,
      0.4,
      { type: "HANDICAP", black: "2", white: "1", numStones: 0, komi: -5 },
    ],
    [
      0,
      0.5,
      { type: "HANDICAP", black: "2", white: "1", numStones: 0, komi: -5 },
    ],
  ];
  it.each(cases)(
    "should calculate the correct matchup for %d rating vs %s rating",
    (rating1, rating2, expectedMatchup) => {
      const rung1 = ratingtoRung(rating1);
      const rung2 = ratingtoRung(rating2);
      const user1: User = { id: "1", ladder_rung: rung1, name: "Bob" };
      const user2: User = { id: "2", ladder_rung: rung2, name: "Jim" };
      const actual = calculateMatchup(user1, user2);

      if (expectedMatchup.type === "HANDICAP" && actual.type === "HANDICAP") {
        const { komi, black, white, numStones } = expectedMatchup;
        expect(actual.black.id).toEqual(black);
        expect(actual.white.id).toEqual(white);
        expect(actual.komi).toEqual(komi);
        expect(actual.numStones).toEqual(numStones);
      } else {
        expect(actual.type).toEqual("EVEN");
        expect(expectedMatchup.type).toEqual("EVEN");
      }
    }
  );
});
