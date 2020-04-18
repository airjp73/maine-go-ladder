import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState, AppDispatch } from "../store/store";
import mainPageSlice, { UserStates } from "./mainPageSlice";
import { AnimatePresence, motion } from "framer-motion";
import UserItem from "./UserItem";
import { css } from "@emotion/core";
import { Theme } from "../styles/theme";
import buttonStyle from "../styles/buttonStyle";
import AnimateHeight from "../components/AnimateHeight/AnimateHeight";
import type { User } from "../apiTypes/User";
import { rungToRating } from "../ladder/ratings";
import matchupValues from "./matchupValues";

export interface EvenMatchup {
  type: "EVEN";
}
export interface HandicapMatchup {
  type: "HANDICAP";
  black: User;
  white: User;
  numStones: number;
  komi: number;
}
export interface LargeDifferenceMatchup {
  type: "LARGE_DIFF";
}
export type Matchup = EvenMatchup | HandicapMatchup | LargeDifferenceMatchup;

export function calculateMatchup(user1: User, user2: User): Matchup {
  if (user1.ladder_rung === user2.ladder_rung) return { type: "EVEN" };

  const [black, white] =
    user1.ladder_rung > user2.ladder_rung ? [user2, user1] : [user1, user2];

  const blackRating = rungToRating(black.ladder_rung);
  const whiteRating = rungToRating(white.ladder_rung);
  const difference = whiteRating - blackRating;
  const vals = matchupValues.find(([diff]) => diff === difference);
  if (!vals) return { type: "LARGE_DIFF" };

  const [rating, numStones, komi] = vals;
  return {
    type: "HANDICAP",
    black,
    white,
    numStones,
    komi: komi * -1, // komi is backwards in the lookup values
  };
}

const matchupStyle = css`
  margin: 0;
`;

const MatchupCalculator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector((state: AppState) => state.mainPage.currentState);
  const user1 = useSelector((state: AppState) => state.mainPage.selectedUser);
  const user2 = useSelector((state: AppState) => state.mainPage.matchup);
  const matchup: Matchup | null =
    user1 && user2 ? calculateMatchup(user1, user2) : null;

  const getMatchupInfo = (matchup: Matchup): React.ReactElement => {
    switch (matchup.type) {
      case "EVEN":
        return <p css={matchupStyle}>Even Game</p>;
      case "LARGE_DIFF":
        return <p css={matchupStyle}>Difference too large to calculate</p>;
      case "HANDICAP":
        return (
          <>
            <p>{matchup.black.name} is black</p>
            <p>{matchup.white.name} is white</p>
            <p>{matchup.numStones} handicap stones</p>
            <p>
              {matchup.komi < 0
                ? `Black has ${matchup.komi * -1} komi`
                : `White has ${matchup.komi} komi`}
            </p>
          </>
        );
    }
  };

  return (
    <AnimatePresence initial={false}>
      {mode === UserStates.MATCHUP && (
        <AnimateHeight
          key="matchup-mode-section"
          css={css`
            position: sticky;
            top: 4rem;
            z-index: 1;
          `}
        >
          <div
            css={(theme: Theme) => css`
              ${theme.styles.raisedBox};
              margin: 0.5rem auto;
              border-radius: 3px;
              max-width: 850px;
              > * + * {
                margin-top: 1rem;
              }
            `}
          >
            {user1 && <UserItem user={user1} />}
            {user2 && <UserItem user={user2} />}
            {!user2 && (
              <div
                css={css`
                  border: 1px solid black;
                  border-radius: 3px;
                  padding: 0.5rem 1rem;
                  text-align: left;
                `}
              >
                Choose another player
              </div>
            )}
            <AnimatePresence initial={false}>
              {matchup && (
                <AnimateHeight
                  key="matchup-info"
                  height={matchup.type === "HANDICAP" ? "9rem" : "1.5rem"}
                >
                  {getMatchupInfo(matchup)}
                </AnimateHeight>
              )}
            </AnimatePresence>
            <button
              css={buttonStyle}
              onClick={() => dispatch(mainPageSlice.actions.cancelMatchup())}
            >
              Close Matchup Calculator
            </button>
          </div>
        </AnimateHeight>
      )}
    </AnimatePresence>
  );
};

export default MatchupCalculator;
