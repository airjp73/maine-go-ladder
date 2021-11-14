import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState, AppDispatch } from "../core/store";
import mainPageSlice, { UserStates } from "./mainPageSlice";
import { AnimatePresence } from "framer-motion";
import UserItem from "./UserItem";
import { css } from "@emotion/core";
import { Theme } from "../common/styles/theme";
import buttonStyle from "../common/styles/buttonStyle";
import AnimateHeight from "../common/components/AnimateHeight/AnimateHeight";
import type { User } from "../resources/users/User";
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
  // Round to the nearest .1
  const difference = Math.round((whiteRating - blackRating) * 10) / 10;
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
            <div
              css={css`
                margin: 0.5rem 0;
                display: flex;
                align-items: center;
              `}
            >
              <div
                css={css`
                  height: 1rem;
                  width: 1rem;
                  border-radius: 50%;
                  background-color: black;
                  margin-right: 0.5rem;
                `}
              />
              <span>{matchup.black.name}</span>
              <div
                css={css`
                  height: 1rem;
                  width: 1rem;
                  border-radius: 50%;
                  background-color: white;
                  margin: 0 0.5rem 0 1.5rem;
                `}
              />
              <span>{matchup.white.name}</span>
            </div>
            <p>{matchup.numStones} handicap stones</p>
            <p>{matchup.komi} komi</p>
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
                Choose another player below from the list below
              </div>
            )}
            <AnimatePresence initial={false}>
              {matchup && (
                <AnimateHeight
                  key="matchup-info"
                  height={matchup.type === "HANDICAP" ? "6rem" : "1.5rem"}
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
